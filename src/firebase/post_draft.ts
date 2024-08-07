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
} from "firebase/firestore";
import { compact, keysIn } from "lodash";
import { toDashCase } from "./signal";
import { Section } from "@/components/AdminEditor/Sections/Section";
import readingTime from "reading-time";

export interface Author {
  name: string;
  email: string;
  photoURL: string;
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
  PostDraft | undefined,
  ReturnType<typeof postConverter.toFirestore>
>;

type PostQuerySnapshot = QuerySnapshot<
  PostDraft | undefined,
  ReturnType<typeof postConverter.toFirestore>
>;

interface QueryParams {
  _startAfter?: string;
  _limit?: number;
  _flatten?: boolean;
}

const headings = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
};

export class PostDraft {
  _id: string | undefined = undefined;
  readonly title: string;
  readonly topic: string;
  readonly author: Author;
  readonly html: Document;
  readonly images: string[];
  readonly quotes: string[];
  readonly timestamp: string | undefined = undefined;
  private _position: PostPosition | undefined = undefined;
  snippetPosition: SnippetPosition = SnippetPosition.MID_CONTENT;
  snippetDesign: SnippetDesign = SnippetDesign.CLASSIC_CARD;
  displayTitle: string | undefined = undefined;
  displayContent: string | undefined = undefined;
  private _sections: Section[] = [];
  readonly is_v2: boolean;

  private _snippetData: {
    title?: string;
    content?: string;
    image?: string;
    quote?: string;
    iframe?: string;
  } | null = null;

  get sections() {
    return this._sections;
  }

  get id(): string | undefined {
    if (this._id) return this._id;
    console.warn(
      "PostDraft id is not set, Try calling generateUniqueId() first"
    );
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
    author: Author,
    topic: string,
    sections: Section[] = [],
    id?: string,
    timestamp?: string,
    position?: SnippetPosition,
    design?: SnippetDesign,
    displayTitle?: string,
    displayContent?: string,
    is_v2: boolean = true
  ) {
    this.title = title;
    this.displayTitle = displayTitle ?? title;
    this.displayContent = displayContent;
    this._sections = Section.createFactory(sections);
    this.author = author;
    this.topic = topic;
    this.html = this.parseContent();
    this.images = this.extractElements<string>("img", srcReducer);
    this.quotes = this.extractElements<string>(
      "blockquote",
      textContentReducer
    );
    this.preparePostSnippetData();
    this._id = id;
    this.timestamp = timestamp;
    this.snippetDesign = design ?? SnippetDesign.CLASSIC_CARD;
    this.snippetPosition = position ?? SnippetPosition.MID_CONTENT;
    this.is_v2 = !!is_v2;
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

  preparePostSnippetData() {
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

  private async generateUniqueId() {
    let id = toDashCase(this.title);
    let count = 1;
    while (await this.idExistsinFirestore(id)) {
      id = `${toDashCase(this.title)}-${count}`;
      count++;
    }
    this.id = id;
    return id;
  }

  private async idExistsinFirestore(id: string) {
    const docRef = doc(db, "post_drafts", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  }

  async saveToFirestore() {
    const postId = await this.generateUniqueId();

    const postRef = doc(db, "post_drafts", postId).withConverter(postConverter);

    await setDoc(postRef, this);

    return postId;
  }

  async updateInFirestore() {
    if (!this.id) {
      throw new Error("PostDraft id is missing");
    }

    const postRef = doc(db, "post_drafts", this.id).withConverter(
      postConverter
    );
    await setDoc(postRef, this);

    return this.id;
  }

  static async deleteFromFirestore(id: string) {
    if (!id) {
      throw new Error("PostDraft id is missing");
    }

    const postRef = doc(db, "post_drafts", id).withConverter(postConverter);

    await deleteDoc(postRef);

    return id;
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
   * @returns {Promise<PostDraft>} A promise that resolves to the flattened post data.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   *
   * @param {string} id - The ID of the post to fetch.
   * @param {boolean} [flatten=false] - A boolean flag indicating whether to flatten the document data.
   * @returns {Promise<PostDocumentSnapshot | PostDraft>} A promise that resolves to the post document snapshot or flattened post data.
   * @throws Will throw an error if the post cannot be fetched or doesn't exist.
   */
  static async get(id: string): Promise<PostDocumentSnapshot>;
  static async get(id: string, flatten: false): Promise<PostDocumentSnapshot>;
  static async get(id: string, flatten: true): Promise<PostDraft>;
  static async get(id: string, flatten: boolean = false) {
    const docRef = doc(db, "post_drafts", id).withConverter(postConverter);
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
      ? collection(db, "post_drafts")
      : collection(db, "post_drafts").withConverter(postConverter);
    const _query = query(postsRef, where("isFlagship", "==", true), limit(1));

    const docs = await getDocs(_query);

    return docs;
  }

  static async getByCategory(
    category: string,
    _limit: QueryParams["_limit"] = 4
  ): Promise<PostDraft[]> {
    const postsRef = collection(db, "post_drafts").withConverter(postConverter);
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
  ): Promise<PostDraft[]> {
    const postsRef = collection(db, "post_drafts").withConverter(postConverter);
    const _query = query(
      postsRef,
      where("hasTextMeta", "==", true),
      orderBy("timestamp", "desc"),
      limit(_limit)
    );

    const docs = await getDocs(_query);

    return compact(flattenQueryData(docs));
  }

  static async getAll(): Promise<PostQuerySnapshot>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<PostQuerySnapshot>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<PostQuerySnapshot>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  }): Promise<PostDraft[]>;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<PostQuerySnapshot>;
  static async getAll(queryParams?: QueryParams) {
    const { _startAfter, _limit = 50, _flatten } = queryParams ?? {};
    const postsRef = collection(db, "post_drafts").withConverter(postConverter);
    let _query = query(postsRef, orderBy("timestamp", "desc"), limit(_limit));

    if (_startAfter) {
      _query = query(
        postsRef,
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
  toFirestore: (post: PostDraft) => {
    return {
      title: post.title,
      author: post.author,
      topic: post.topic,
      timestamp: serverTimestamp(),
      position: post.snippetPosition,
      design: post.snippetDesign,
      displayTitle: post.displayTitle,
      displayContent: post.displayContent,
      read_time: readingTime(Section.mergedContent(post.sections)).text,
      sections: Section.toPlainObject(post.sections),
      meta: {
        description: post.snippetData?.content ?? null,
        image: post.snippetData?.image ?? null,
        quote: post.snippetData?.quote ?? null,
      },
      hasTextMeta: !!post.snippetData?.content && !!post.topic,
      hasImageMeta:
        !!post.topic &&
        !!post.snippetData?.image &&
        !!post.snippetData?.content,
      is_v2: true,
    };
  },
  fromFirestore: (snapshot: any) => {
    if (!snapshot.exists) return undefined;
    const data = snapshot.data();

    return new PostDraft(
      data.title,
      data.author,
      data.topic,
      data.sections,
      snapshot.id,
      data.timestamp.toDate().toISOString(),
      data.position,
      data.design,
      data.displayTitle,
      data.displayContent,
      data.is_v2
    );
  },
};
