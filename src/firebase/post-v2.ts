import { API_QUERY } from "@/config/api-query";
import { db } from "@/lib/firebase";
import { QueryClient } from "@tanstack/react-query";
import {
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  Timestamp,
  WriteBatch,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
  writeBatch,
} from "firebase/firestore";
import { compact, keysIn } from "lodash";
import { toDashCase } from "./signal";
import { Section } from "@/components/AdminEditor/Sections/Section";
import { Post as PostV1 } from "@/firebase/post";
import readingTime from "reading-time";
import { PostFilters } from "@/components/Me/Posts/PostsEntry";
import { Descendant } from "slate";
import {
  extractFirstWordsFromPostNodes,
  extractTextFromEditor,
  getFirstExistingText,
  getFirstImage,
} from "@/components/SlateEditor/utils/helpers";
import {
  AspectRatioType,
  ImageCropData,
} from "@/components/AdminEditor/ImageCropper";
import { handleUploadAsync } from "@/lib/firebase/upload";
import { prepareThumbnailVariantsByCropData } from "@/lib/transformers/image";

export interface Author {
  name: string;
  email: string;
  photoURL: string;
  uid: string;
}

export enum PostPosition {
  Full_C = "full-with-creative",
  Full_Q = "full-with-quote",
  HEADLINE = "headline",
  TEXT_CONTENT = "text-content",
}

export enum SnippetPosition {
  TITLE = "title",
  RIGHT = "right",
  LEFT = "left",
  MID_CONTENT = "mid-content",
}

export enum SnippetDesign {
  CLASSIC_CARD = "classic-card",
  DETAILED_CARD = "detailed-card",
  COMPACT_CARD = "compact-card",
  SIMPLE_LIST = "simple-list",
}

function defaultExtractReducer(acc: any, curr: any) {
  return [...acc, curr];
}

function textContentReducer(acc: any, curr: any) {
  acc.push(curr.textContent);
  return acc;
}

export function srcReducer(acc: any, curr: any) {
  if (curr.classList.contains("blog-image")) acc.push(curr.src);
  return acc;
}

export function flattenDocumentData<T>(data: DocumentSnapshot<T>) {
  if (data.exists()) {
    return data.data();
  }
  throw new Error("Document does not exist");
}

export function flattenQueryData<T>(data: QuerySnapshot<T>) {
  return compact(data.docs.map((doc) => doc.data()));
}

export function flattenQueryDataWithId<T>(data: QuerySnapshot<T>) {
  return compact(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  ) as (T & { id: string })[];
}

interface GetWithoutFlatten {
  <T>(id: string): Promise<DocumentSnapshot<T>>;
  <T>(id: string, flatten: false): Promise<DocumentSnapshot<T>>;
  <T>(id: string, flatten: true): Promise<T>;
}

type PostDocumentSnapshot = DocumentSnapshot<
  Post | undefined,
  ReturnType<typeof postConverter.toFirestore>
>;

type PostQuerySnapshot = QuerySnapshot<
  Post | undefined,
  ReturnType<typeof postConverter.toFirestore>
>;

interface QueryParams extends Partial<PostFilters> {
  _startAfter?: string;
  _limit?: number;
  _flatten?: boolean;
  _userId?: string;
  status?: string[];
}

type GetAllReturnType<T> = {
  firstDoc: PostDocumentSnapshot;
  data: T;
  lastDoc: PostDocumentSnapshot;
};

const headings = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
};

export type SubTextVariants = {
  long: string;
  short: string;
  very_short: string;
  medium: string;
};

export type PostStatus = "draft" | "published" | "scheduled" | "unpublished";

export type ImageVariant = {
  url: string;
  alt: string;
} & ImageCropData;

export type PostThumbnail = {
  baseImageUrl: string;
  variants: ImageVariant[];
};

export class Post {
  _id: string | undefined = undefined;
  readonly title: string;
  readonly subTitle: string;
  readonly topic: string;
  readonly author: Author;
  readonly html: Document;
  readonly quotes: string[];
  private _status: PostStatus = "draft";
  private _scheduledTime: string | undefined = undefined;
  readonly timestamp: string | undefined = undefined;
  private _position: PostPosition | undefined = undefined;
  snippetPosition: SnippetPosition = SnippetPosition.MID_CONTENT;
  snippetDesign: SnippetDesign = SnippetDesign.CLASSIC_CARD;
  displayTitle: string | undefined = undefined;
  displayContent: string | undefined = undefined;
  nodes: Descendant[] | undefined = undefined;
  private _sections: Section[] = [];
  readonly is_v2: boolean;
  private _subTextVariants: SubTextVariants | undefined | null = undefined;
  private _thumbnailVariants: ImageVariant[] | null = null;
  private _thumbnail: PostThumbnail | null = null;

  private _snippetData: {
    title?: string;
    content?: string | null;
    image?: string | null;
    quote?: string | null;
    iframe?: string | null;
    subTitle?: string | null;
    subTextVariants?: SubTextVariants | null;
  } | null = null;

  get sections() {
    return this._sections;
  }

  get subTextVariants() {
    return this._subTextVariants;
  }

  get status() {
    return this._status;
  }

  get scheduledTime() {
    return this._scheduledTime;
  }

  get thumbnailVariants() {
    return this._thumbnailVariants;
  }

  get thumbnail() {
    return this._thumbnail;
  }

  get id(): string | undefined {
    if (this._id) return this._id;
    console.warn("Post id is not set, Try calling generateUniqueId() first");
    return undefined;
  }

  set id(id: string) {
    this._id = id;
  }

  get snippetData() {
    return this._snippetData;
  }

  get position() {
    return this._position;
  }

  constructor(
    title: string,
    subTitle: string,
    subTextVariants: SubTextVariants | null | undefined,
    author: Author,
    topic: string,
    sections: Section[] = [],
    status: PostStatus = "published",
    id?: string,
    timestamp?: string,
    position?: SnippetPosition,
    design?: SnippetDesign,
    displayTitle?: string,
    displayContent?: string,
    scheduledTime?: string,
    is_v2: boolean = true,
    nodes?: Descendant[],
    thumbnail: PostThumbnail | null = null
  ) {
    this.title = title;
    this.subTitle = subTitle;
    this.displayTitle = displayTitle ?? title;
    this.displayContent = displayContent;
    this._sections = Section.createFactory(sections);
    this.author = author;
    this.topic = topic;
    this.html = this.parseContent();
    this.quotes = this.extractElements<string>(
      "blockquote",
      textContentReducer
    );
    this._subTextVariants = subTextVariants;
    this.nodes = nodes;
    this.preparePostSnippetData();
    this._id = id;
    this.timestamp = timestamp;
    this.snippetDesign = design ?? SnippetDesign.CLASSIC_CARD;
    this.snippetPosition = position ?? SnippetPosition.MID_CONTENT;
    this.is_v2 = !!is_v2;
    this._status = status;
    this._scheduledTime = scheduledTime;
    this._thumbnailVariants = thumbnail?.variants ?? null;
    this._thumbnail = thumbnail;
  }

  private parseContent(): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      Section.mergedContent(this.sections),
      "text/html"
    );
    return doc;
  }

  private extractElements<T extends any>(
    tag: string,
    reducer = defaultExtractReducer
  ): T[] {
    return compact(
      Array.from(this.html.getElementsByTagName(tag)).reduce(reducer, [])
    );
  }

  getThumbnail(aspectRatio: AspectRatioType, noFallback = false) {
    if (this._thumbnailVariants && this._thumbnailVariants.length > 0) {
      const variant = this._thumbnailVariants.find(
        (variant) => variant.aspectRatio === aspectRatio
      );
      return variant?.url ?? (noFallback ? null : this.snippetData?.image);
    }
    return noFallback ? null : this.snippetData?.image;
  }

  preparePostSnippetData() {
    if (this.nodes) {
      const snippetData = {
        title: this.displayTitle,
        content: extractFirstWordsFromPostNodes(this.nodes, 250),
        image: getFirstImage(this.nodes),
        // quote: quotes[0],
        // iframe: iframes[0],
        author: this.author,
        topic: this.topic,
        subTitle: this.subTitle,
        subTextVariants: this._subTextVariants ?? null,
      };

      this._snippetData = snippetData;

      return;
    }

    const textElements = {
      h1: this.extractElements<string>("h1", textContentReducer),
      h2: this.extractElements<string>("h2", textContentReducer),
      h3: this.extractElements<string>("h3", textContentReducer),
      h4: this.extractElements<string>("h4", textContentReducer),
      h5: this.extractElements<string>("h5", textContentReducer),
      h6: this.extractElements<string>("h6", textContentReducer),
      p: this.extractElements<string>("p", textContentReducer),
    };

    const images = this.extractElements<string>("img", srcReducer);

    const iframes = this.extractElements<string>("iframe", srcReducer);

    const quotes = this.extractElements<string>(
      "blockquote",
      textContentReducer
    );

    const priorities: (keyof typeof textElements)[] = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
    ];

    const titleTag = priorities.find(
      (priority) => textElements[priority].length > 0
    );

    if (!titleTag) return null;

    const contentTag = priorities.find(
      (priority) => textElements[priority].length > 0 && priority !== titleTag
    );

    const snippetData = {
      title: this.displayTitle,
      content: this.displayContent
        ? this.displayContent
        : contentTag
        ? textElements[contentTag]?.[0]
        : textElements[titleTag]?.[1] ?? "",
      image: images[0],
      quote: quotes[0],
      iframe: iframes[0],
      author: this.author,
      topic: this.topic,
    };

    this._snippetData = snippetData;

    if (
      (snippetData.content || snippetData.title) &&
      (snippetData.image || snippetData.iframe) &&
      snippetData.author &&
      snippetData.topic
    ) {
      this._position = PostPosition.Full_C;
      return;
    }

    if (
      (snippetData.content || snippetData.title) &&
      snippetData.quote &&
      snippetData.author &&
      snippetData.topic
    ) {
      this._position = PostPosition.Full_Q;
      return;
    }

    if (snippetData.title && snippetData.content) {
      this._position = PostPosition.TEXT_CONTENT;
      return;
    }

    if (snippetData.title) {
      this._position = PostPosition.HEADLINE;
      return;
    }
  }

  private async generateUniqueId(collectionName: string = "posts") {
    let id = toDashCase(this.title);
    let count = 1;
    while (await this.idExistsinFirestore(id, collectionName)) {
      id = `${toDashCase(this.title)}-${count}`;
      count++;
    }
    this.id = id;
    return id;
  }

  private async idExistsinFirestore(
    id: string,
    collectionName: string = "posts"
  ) {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  }

  async saveToFirestore(returnBatch: boolean | WriteBatch = false) {
    const postId = this.id ?? (await this.generateUniqueId());
    const postRef = doc(db, "posts", postId).withConverter(postConverter);

    await this.makeThumbnailLive();

    await setDoc(postRef, this, { merge: true });

    return this;
  }

  async makeThumbnailLive() {
    const url = this.thumbnail?.baseImageUrl;
    if (!url) return;

    if (url.startsWith("blob:")) {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });

      const live_url = await handleUploadAsync(file, {
        setProgress: (value: number) => {
          console.log("Progress - ", value);
        },
      });

      this._thumbnail = prepareThumbnailVariantsByCropData({
        baseImageUrl: live_url,
        variants: this._thumbnail?.variants ?? [],
      });
    }
  }

  async saveDraftToFirestore() {
    const postId = await this.generateUniqueId("post_drafts");

    const postRef = doc(db, "post_drafts", postId).withConverter(postConverter);

    await setDoc(postRef, this);

    return postId;
  }

  async updateInFirestore() {
    if (!this.id) {
      throw new Error("Post id is missing");
    }

    const postRef = doc(db, "posts", this.id).withConverter(postConverter);

    await this.makeThumbnailLive();

    await setDoc(postRef, this, { merge: true });

    return this;
  }

  async updateDraftInFirestore() {
    if (!this.id) {
      throw new Error("Post id is missing");
    }

    const postRef = doc(db, "post_drafts", this.id).withConverter(
      postConverter
    );
    await setDoc(postRef, this);

    return this.id;
  }

  static async deleteFromFirestore(
    id: string,
    returnBatch: boolean | WriteBatch = false
  ) {
    if (!id) {
      throw new Error("Post id is missing");
    }

    const postRef = doc(db, "posts", id).withConverter(postConverter);

    if (returnBatch) {
      const batch =
        returnBatch instanceof WriteBatch ? returnBatch : writeBatch(db);
      batch.delete(postRef);
      return batch;
    }

    await deleteDoc(postRef);

    return id;
  }

  static async unpublishPostInFirestore(id: string) {
    if (!id) {
      throw new Error("Post id is missing");
    }

    const postRef = doc(db, "posts", id);

    await setDoc(
      postRef,
      {
        status: "unpublished",
        scheduledTime: null,
      },
      { merge: true }
    );

    return id;
  }

  static async publishPostInFirestore(id: string) {
    if (!id) {
      throw new Error("Post id is missing");
    }

    const postRef = doc(db, "posts", id);

    await setDoc(
      postRef,
      {
        status: "published",
      },
      { merge: true }
    );

    return id;
  }

  async saveToBookmark(userId?: string) {
    if (!userId) {
      throw new Error("User id is missing");
    }
    if (!this.id) {
      throw new Error("Post id is missing");
    }
    const userRef = doc(db, "users", userId, "bookmarks", this.id);

    await setDoc(userRef, {
      id: this.id,
      bookmarked_at: serverTimestamp(),
    });

    return this.id;
  }

  async removeFromBookmark(userId?: string) {
    if (!userId) {
      throw new Error("User id is missing");
    }
    if (!this.id) {
      throw new Error("Post id is missing");
    }

    const userRef = doc(db, "users", userId, "bookmarks", this.id);

    await deleteDoc(userRef);

    return this;
  }

  /**
   * Publishes the post.
   */
  livePost() {
    this._status = "published";
    this._scheduledTime = undefined;
  }

  /**
   *
   * @param scheduledTime - The time to schedule the post in ISO string format.
   */
  schedulePost(scheduledTime: string) {
    // Check if the input time is valid ISO string
    if (!new Date(scheduledTime).toISOString()) {
      throw new Error("Invalid Scheduled Time");
    }

    this._status = "scheduled";
    this._scheduledTime = scheduledTime;
  }

  /**
   * Publishes the post.
   */
  draftPost() {
    this._status = "draft";
  }

  unpublishPost() {
    this._status = "unpublished";
  }

  /**
   * Fetches a post document from Firestore.
   *
   * Overload 1: Fetches the document snapshot.
   * @param {string} id - The ID of the post to fetch.
   * @returns {Promise<PostDocumentSnapshot>} A promise that resolves to the post document snapshot.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   *
   * Overload 2: Fetches the document snapshot without flattening.
   * @param {string} id - The ID of the post to fetch.
   * @param {false} flatten - A boolean flag set to false indicating the document data should not be flattened.
   * @returns {Promise<PostDocumentSnapshot>} A promise that resolves to the post document snapshot.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   *
   * Overload 3: Fetches the document data with flattening.
   * @param {string} id - The ID of the post to fetch.
   * @param {true} flatten - A boolean flag set to true indicating the document data should be flattened.
   * @returns {Promise<Post>} A promise that resolves to the flattened post data.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   *
   * @param {string} id - The ID of the post to fetch.
   * @param {boolean} [flatten=false] - A boolean flag indicating whether to flatten the document data.
   * @returns {Promise<PostDocumentSnapshot | Post>} A promise that resolves to the post document snapshot or flattened post data.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   */
  static async get(id: string): Promise<PostDocumentSnapshot>;
  static async get(id: string, flatten: false): Promise<PostDocumentSnapshot>;
  static async get(id: string, flatten: true): Promise<Post>;
  static async get(id: string, flatten: boolean = false) {
    const docRef = doc(db, "posts", id).withConverter(postConverter);
    const data = await getDoc(docRef);
    return flatten ? flattenDocumentData(data) : data;
  }

  static async getFlagship(): Promise<PostQuerySnapshot>;
  static async getFlagship(raw: false): Promise<PostQuerySnapshot>;
  static async getFlagship(
    raw: true
  ): Promise<QuerySnapshot<DocumentData, DocumentData>>;
  static async getFlagship(raw?: boolean) {
    const postsRef = raw
      ? collection(db, "posts")
      : collection(db, "posts").withConverter(postConverter);
    const _query = query(postsRef, where("isFlagship", "==", true), limit(1));

    const docs = await getDocs(_query);

    return docs;
  }

  static async getByCategory(
    category: string,
    _limit: QueryParams["_limit"] = 4
  ): Promise<(Post | PostV1)[]> {
    const postsRef = collection(db, "posts").withConverter(postConverter);
    const _query = query(
      postsRef,
      where("topic", "==", category),
      where("hasTextMeta", "==", true),
      orderBy("timestamp", "desc"),
      limit(_limit)
    );

    const docs = await getDocs(_query);

    return compact(flattenQueryData(docs));
  }

  static async getRecentPosts(
    _limit: QueryParams["_limit"] = 4
  ): Promise<(Post | PostV1)[]> {
    const postsRef = collection(db, "posts").withConverter(postConverter);
    const _query = query(
      postsRef,
      where("hasTextMeta", "==", true),
      orderBy("timestamp", "desc"),
      limit(_limit)
    );

    const docs = await getDocs(_query);

    return compact(flattenQueryData(docs));
  }

  static async getAll(): Promise<GetAllReturnType<PostQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<GetAllReturnType<PostQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<GetAllReturnType<PostQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
    _userId?: string | undefined;
  } & Partial<PostFilters>): Promise<GetAllReturnType<Post[]>>;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  } & Partial<PostFilters>): Promise<GetAllReturnType<Post[]>>;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<
    GetAllReturnType<PostQuerySnapshot>
  >;
  static async getAll(queryParams?: QueryParams) {
    const {
      _startAfter,
      _limit = 50,
      _flatten,
      status: _status,
      sort: _sort,
      _userId,
      topics: _topics,
      dateRange: _dateRange,
    } = queryParams ?? {};
    const postsRef = collection(db, "posts").withConverter(postConverter);

    let _query = query(postsRef);

    if (_status && _status.length > 0) {
      // Add status filter
      _query = query(_query, where("status", "in", _status));
    }

    // Add topic filter if provided
    if (_topics && _topics.length > 0) {
      _query = query(_query, where("topic", "in", _topics));
    }

    if (_dateRange && _dateRange.length === 2) {
      const [startDate, endDate] = _dateRange;
      if (startDate && endDate) {
        _query = query(
          _query,
          where("timestamp", ">=", startDate.toDate()),
          where("timestamp", "<=", endDate.toDate())
        );
      } else if (startDate) {
        _query = query(_query, where("timestamp", ">=", startDate.toDate()));
      } else if (endDate) {
        _query = query(_query, where("timestamp", "<=", endDate.toDate()));
      }
    }

    // Add additional conditions based on _userEmail and _startAfter
    if (_userId) {
      _query = query(_query, where("author.uid", "==", _userId));
    }
    // Add sorting to the query
    if (_sort && _sort.length > 0) {
      _sort.forEach((sortOption: { field: string; order: "asc" | "desc" }) => {
        // if (sortOption.field === "timestamp") return;
        _query = query(_query, orderBy(sortOption.field, sortOption.order));
      });
    } else {
      // Default sorting by timestamp
      _query = query(_query, orderBy("timestamp", "desc"));
    }

    if (_startAfter) {
      _query = query(_query, startAfter(_startAfter));
    }

    _query = query(_query, limit(_limit));

    const docs = await getDocs(_query);

    return {
      firstDoc: docs.docs[0],
      data: _flatten ? flattenQueryData(docs) : docs,
      lastDoc: docs.docs[docs.docs.length - 1],
    };
  }

  /**
   *
   * @param userId
   * @returns
   */
  static async getSavedPosts(userId: string): Promise<(Post | PostV1)[]> {
    const userRef = collection(db, "users", userId, "bookmarks");
    const docs = await getDocs(userRef);
    const bookMarks = docs.docs.map((doc) => doc.id);

    console.log("bookMarks - ", bookMarks);
    const postsRef = collection(db, "posts").withConverter(postConverter);

    const _query = query(
      postsRef,
      where("id", "in", bookMarks),
      orderBy("timestamp", "desc")
    );

    const postDocs = await getDocs(_query);

    console.log("postDocs - ", postDocs);

    return compact(flattenQueryData(postDocs));
  }

  static async getPublishedPosts(): Promise<PostQuerySnapshot>;
  static async getPublishedPosts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<PostQuerySnapshot>;
  static async getPublishedPosts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<PostQuerySnapshot>;
  static async getPublishedPosts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  }): Promise<Post[]>;
  static async getPublishedPosts({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<PostQuerySnapshot>;
  static async getPublishedPosts(queryParams?: QueryParams) {
    const { _startAfter, _limit = 50, _flatten } = queryParams ?? {};
    const postsRef = collection(db, "posts").withConverter(postConverter);
    let _query = query(
      postsRef,
      where("status", "==", "published"),
      orderBy("timestamp", "desc"),
      limit(_limit)
    );

    if (_startAfter) {
      _query = query(
        postsRef,
        where("status", "==", "published"),
        orderBy("timestamp", "desc"),
        startAfter(_startAfter),
        limit(_limit)
      );
    }

    const docs = await getDocs(_query);

    return _flatten ? flattenQueryData(docs) : docs;
  }

  static async getAllDrafts(): Promise<PostQuerySnapshot>;
  static async getAllDrafts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<PostQuerySnapshot>;
  static async getAllDrafts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<PostQuerySnapshot>;
  static async getAllDrafts({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  }): Promise<Post[]>;
  static async getAllDrafts({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<PostQuerySnapshot>;
  static async getAllDrafts(queryParams?: QueryParams) {
    const { _startAfter, _limit = 50, _flatten } = queryParams ?? {};
    const postsRef = collection(db, "posts").withConverter(postConverter);
    let _query = query(
      postsRef,
      where("status", "==", "draft"),
      orderBy("timestamp", "desc"),
      limit(_limit)
    );

    if (_startAfter) {
      _query = query(
        postsRef,
        where("status", "==", "draft"),
        orderBy("timestamp", "desc"),
        startAfter(_startAfter),
        limit(_limit)
      );
    }

    const docs = await getDocs(_query);

    return _flatten ? flattenQueryData(docs) : docs;
  }
}

export const postConverter = {
  toFirestore: (post: Post) => {
    return {
      title: post.title,
      subTitle: post.subTitle,
      id: post.id,
      author: post.author,
      topic: post.topic,
      timestamp: serverTimestamp(),
      position: post.snippetPosition,
      design: post.snippetDesign,
      displayTitle: post.displayTitle ?? post.title,
      displayContent: post.displayContent ?? "",
      read_time: readingTime(
        post.nodes
          ? extractTextFromEditor(post.nodes)
          : Section.mergedContent(post.sections)
      ).text,
      subTextVariants: post.subTextVariants,
      sections: Section.toPlainObject(post.sections),
      meta: {
        description: post.snippetData?.content ?? null,
        image: post.snippetData?.image ?? null,
        quote: post.snippetData?.quote ?? null,
      },
      status: post.status,
      scheduledTime: post.scheduledTime
        ? Timestamp.fromDate(new Date(post.scheduledTime))
        : null,
      hasTextMeta: !!post.snippetData?.content && !!post.topic,
      hasImageMeta:
        !!post.topic &&
        !!post.snippetData?.image &&
        !!post.snippetData?.content,
      is_v2: true,
      nodes: post.nodes,
      displayThumbnail: post.thumbnail,
    };
  },
  fromFirestore: (snapshot: any) => {
    if (!snapshot.exists) return undefined;
    const data = snapshot.data();

    if (!data.sections && data.content) {
      return new PostV1(
        data.title,
        data.content,
        data.author,
        data.topic,
        snapshot.id,
        data.timestamp.toDate().toISOString(),
        data.position,
        data.design,
        data.isFlagship,
        data.displayTitle,
        data.displayContent
      );
    }

    return new Post(
      data.title,
      data.subTitle,
      data.subTextVariants,
      data.author,
      data.topic,
      data.sections,
      data.status ?? "published",
      snapshot.id,
      data.timestamp.toDate().toISOString(),
      data.position,
      data.design,
      data.displayTitle,
      data.displayContent,
      data.scheduledTime?.toDate().toISOString(),
      data.is_v2,
      data.nodes,
      data.displayThumbnail
    );
  },
};
