import { API_QUERY } from "@/config/api-query";
import { db } from "@/lib/firebase";
import { QueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import {
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  endAt,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { compact } from "lodash";
import { Descendant } from "slate";

export interface Author {
  name: string;
  email: string;
  photoURL: string;
  uid: string;
}

export function toDashCase(str: string) {
  // Convert title to lowercase
  str = str.toLowerCase();
  // Replace special characters with an empty string
  str = str.replace(/[^a-z0-9\s-]/g, "");
  // Replace spaces and consecutive hyphens with a single hyphen
  str = str.replace(/[\s]+/g, "-");
  return str.trim();
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

type SignalDocumentSnapshot = DocumentSnapshot<
  Signal | undefined,
  ReturnType<typeof signalConverter.toFirestore>
>;

type SignalQuerySnapshot = QuerySnapshot<
  Signal | undefined,
  ReturnType<typeof signalConverter.toFirestore>
>;

type GetAllReturnType<T> = {
  firstDoc: SignalDocumentSnapshot;
  data: T;
  lastDoc: SignalDocumentSnapshot;
};

interface QueryParams {
  _startAfter?: any;
  _limit?: number;
  _flatten?: boolean;
  _startAt?: string | string[];
  _direction?: "forward" | "backward";
  _userId?: string;
  _status?: string;
}

const headings = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
};

export type PostStatus = "draft" | "published" | "scheduled" | "unpublished";

export class Signal {
  _id: string | undefined = undefined;
  readonly title: string;
  readonly source: string;
  readonly author: Author;
  private _status: PostStatus = "draft";
  private _scheduledTime: string | undefined = undefined;
  readonly _nodes: Descendant[] | undefined = undefined;
  readonly timestamp: string | undefined = undefined;
  private _flagshipDate: string | undefined | null = undefined;

  get id(): string | undefined {
    if (this._id) return this._id;
    console.warn("Signal id is not set, Try calling generateUniqueId() first");
    return undefined;
  }

  set id(id: string) {
    this._id = id;
  }

  get status() {
    return this._status;
  }

  get scheduledTime() {
    return this._scheduledTime;
  }

  get nodes() {
    return this._nodes;
  }

  get flagshipDate() {
    return this._flagshipDate;
  }

  constructor(
    title: string,
    nodes: Descendant[] | undefined,
    author: Author,
    source: string,
    id?: string,
    timestamp?: string,
    status?: PostStatus,
    _flagshipDate?: string
  ) {
    this.title = title;
    this._nodes = nodes;
    this.author = author;
    this.source = source;
    this._id = id;
    this.timestamp = timestamp;
    this._status = status ?? "draft";
    this._flagshipDate = _flagshipDate;
  }

  static collectionRef() {
    return collection(db, "signals");
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
    const docRef = doc(db, "signals", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  }

  async saveToFirestore() {
    const signalId = this.id ?? (await this.generateUniqueId());

    const signalRef = doc(db, "signals", signalId).withConverter(
      signalConverter
    );

    await setDoc(signalRef, this, { merge: true });

    return this;
  }

  async updateInFirestore() {
    if (!this.id) {
      throw new Error("Signal ID is required to update the document");
    }

    const signalRef = doc(db, "signals", this.id).withConverter(
      signalConverter
    );

    await setDoc(signalRef, this, { merge: true });

    return this;
  }

  static async deleteFromFirestore(id: string) {
    if (!id) {
      throw new Error("Signal id is missing");
    }

    const signalRef = doc(db, "signals", id).withConverter(signalConverter);

    await deleteDoc(signalRef);

    return id;
  }

  /**
   * Publishes the post.
   */
  live() {
    this._status = "published";
    this._scheduledTime = undefined;
  }

  /**
   *
   * @param scheduledTime - The time to schedule the post in ISO string format.
   */
  schedule(scheduledTime: string) {
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
  draft() {
    this._status = "draft";
  }

  unpublish() {
    this._status = "unpublished";
  }

  setFlagshipDate(date: Dayjs | null) {
    this._flagshipDate = date ? date.format("DD-MM-YYYY") : null;
  }

  static async getTodayFlagship(): Promise<Signal | undefined> {
    const signalRef = collection(db, "signals").withConverter(signalConverter);
    const _query = query(
      signalRef,
      where("flagshipDate", "==", dayjs().format("DD-MM-YYYY")),
      where("status", "==", "published"),
      limit(1),
      orderBy("timestamp", "desc")
    );

    const docs = await getDocs(_query);

    const signals = flattenQueryData(docs);

    const flagship = signals[0];

    if (!flagship) {
      return (await Signal.getAll({ _limit: 1, _flatten: true })).data[0];
    }

    return signals[0];
  }

  static async updatePublishStatusInFirestore(
    id: string,
    isPublished: boolean
  ) {
    if (!id) {
      throw new Error("Signal id is missing");
    }

    const signalRef = doc(db, "signals", id);

    await setDoc(
      signalRef,
      {
        status: isPublished ? "published" : "unpublished",
      },
      { merge: true }
    );

    return id;
  }

  /**
   * Fetches a signal document from Firestore.
   *
   * Overload 1: Fetches the document snapshot.
   * @param {string} id - The ID of the signal to fetch.
   * @returns {Promise<SignalDocumentSnapshot>} A promise that resolves to the signal document snapshot.
   * @throws Will throw an error if the signal cannot be fetched or doesn't exist.
   *
   * Overload 2: Fetches the document snapshot without flattening.
   * @param {string} id - The ID of the signal to fetch.
   * @param {false} flatten - A boolean flag set to false indicating the document data should not be flattened.
   * @returns {Promise<SignalDocumentSnapshot>} A promise that resolves to the signal document snapshot.
   * @throws Will throw an error if the signal cannot be fetched or doesn't exist.
   *
   * Overload 3: Fetches the document data with flattening.
   * @param {string} id - The ID of the signal to fetch.
   * @param {true} flatten - A boolean flag set to true indicating the document data should be flattened.
   * @returns {Promise<Signal>} A promise that resolves to the flattened signal data.
   * @throws Will throw an error if the signal cannot be fetched or doesn't exist.
   *
   * @param {string} id - The ID of the signal to fetch.
   * @param {boolean} [flatten=false] - A boolean flag indicating whether to flatten the document data.
   * @returns {Promise<SignalDocumentSnapshot | Signal>} A promise that resolves to the signal document snapshot or flattened signal data.
   * @throws Will throw an error if the signal cannot be fetched or doesn't exist.
   */
  static async get(id: string): Promise<SignalDocumentSnapshot>;
  static async get(id: string, flatten: false): Promise<SignalDocumentSnapshot>;
  static async get(id: string, flatten: true): Promise<Signal>;
  static async get(id: string, flatten: boolean = false) {
    const docRef = doc(db, "signals", id).withConverter(signalConverter);
    const data = await getDoc(docRef);
    return flatten ? flattenDocumentData(data) : data;
  }

  static async getAll(): Promise<GetAllReturnType<SignalQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<GetAllReturnType<SignalQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<GetAllReturnType<SignalQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  }): Promise<GetAllReturnType<Signal[]>>;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<
    GetAllReturnType<SignalQuerySnapshot>
  >;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
    _startAt,
    _direction,
    _userId,
    _status,
  }: QueryParams & { _flatten: true }): Promise<GetAllReturnType<Signal[]>>;
  static async getAll(queryParams?: QueryParams) {
    const {
      _startAfter,
      _limit = 50,
      _flatten,
      _startAt,
      _direction = "forward",
      _userId,
      _status,
    } = queryParams ?? {};
    const signalsRef = collection(db, "signals").withConverter(signalConverter);
    let _query = query(signalsRef, orderBy("timestamp", "desc"), limit(_limit));

    if (_userId) {
      _query = query(_query, where("author.uid", "==", _userId));
    }

    if (_status) {
      _query = query(_query, where("status", "==", _status));
    }

    if (_direction === "forward") {
      if (_startAfter) {
        _query = query(_query, startAfter(_startAfter));
      }
      if (_startAt) {
        const _doc = await getDoc(doc(signalsRef, _startAt as string));
        _query = query(_query, startAt(_doc));
      }
    } else if (_direction === "backward") {
      if (_startAfter) {
        _query = query(_query, endBefore(_startAfter), limitToLast(_limit));
      }
      if (_startAt) {
        const _doc = await getDoc(doc(signalsRef, _startAt as string));
        _query = query(_query, endAt(_doc));
      }
    }

    console.log("query - ", _query);

    // if (_direction === "forward") {
    //   if (_startAfter) {
    //     _query = query(
    //       signalsRef,
    //       orderBy("timestamp", "desc"),
    //       startAfter(_startAfter),
    //       limit(_limit)
    //     );
    //   } else if (_startAt) {
    //     const _doc = await getDoc(doc(signalsRef, _startAt as string));
    //     _query = query(
    //       signalsRef,
    //       orderBy("timestamp", "desc"),
    //       startAt(_doc),
    //       limit(_limit)
    //     );
    //   }
    // } else if (_direction === "backward") {
    //   if (_startAfter) {
    //     _query = query(
    //       signalsRef,
    //       orderBy("timestamp", "desc"),
    //       endBefore(_startAfter),
    //       limitToLast(_limit)
    //     );
    //   } else if (_startAt) {
    //     const _doc = await getDoc(doc(signalsRef, _startAt as string));
    //     _query = query(
    //       signalsRef,
    //       orderBy("timestamp", "desc"),
    //       endAt(_doc),
    //       limit(_limit)
    //     );
    //   }
    // }

    const docs = await getDocs(_query);

    return {
      firstDoc: docs.docs[0],
      data: _flatten ? flattenQueryData(docs) : docs,
      lastDoc: docs.docs[docs.docs.length - 1],
    };
  }

  static flaggedDateFormat(date: Dayjs) {
    return date.format("YYYY-MM-DD");
  }

  static async markAsFlagship(id: string, date: Dayjs) {
    const signalRef = doc(db, "signals", id);
    const metadataRef = doc(db, "metadata", "flagshipDates");

    // Use a transaction to ensure consistency
    await runTransaction(db, async (transaction) => {
      const signalDoc = await transaction.get(signalRef);

      if (!signalDoc.exists) {
        throw new Error("Signal does not exist!");
      }

      // Update signal document
      transaction.update(signalRef, {
        isFlagship: true,
        flagshipDate: date,
      });

      // Update metadata document
      const metadataDoc = await transaction.get(metadataRef);
      const flagshipDates = metadataDoc.data()?.dates || {};
      flagshipDates[Signal.flaggedDateFormat(date)] = id;
      transaction.update(metadataRef, { dates: flagshipDates });
    });
  }

  // static async getTodaysFlagship(): Promise<Signal> {
  //   const metadataRef = doc(db, "metadata", "flagshipDates");

  //   const metadataDoc = await getDoc(metadataRef);
  //   const today = new Date().toISOString().split("T")[0];
  //   const flagshipDates = metadataDoc.data()?.dates ?? {};

  //   if (flagshipDates && flagshipDates[today]) {
  //     const signalId = flagshipDates[today];
  //     return Signal.get(signalId, true);
  //   } else {
  //     const signals = await Signal.getAll({ _limit: 1, _flatten: true });
  //     return signals.data[0];
  //   }
  // }
}

export const signalConverter = {
  toFirestore: (signal: Signal) => {
    return {
      title: signal.title,
      nodes: signal.nodes,
      author: signal.author,
      source: signal.source,
      timestamp: serverTimestamp(),
      id: signal.id,
      status: signal.status,
      flagshipDate: signal.flagshipDate,
    };
  },
  fromFirestore: (snapshot: any) => {
    if (!snapshot.exists) return undefined;
    const data = snapshot.data();
    return new Signal(
      data.title,
      data.nodes,
      data.author,
      data.source,
      snapshot.id,
      data.timestamp.toDate().toISOString(),
      data.status,
      data.flagshipDate
    );
  },
};
