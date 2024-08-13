import { API_QUERY } from "@/config/api-query";
import { db } from "@/lib/firebase";
import { QueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import {
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
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
  writeBatch,
} from "firebase/firestore";
import { compact } from "lodash";

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

type EventDocumentSnapshot = DocumentSnapshot<
  Event | undefined,
  ReturnType<typeof eventConverter.toFirestore>
>;

type EventQuerySnapshot = QuerySnapshot<
  Event | undefined,
  ReturnType<typeof eventConverter.toFirestore>
>;

type GetAllReturnType<T> = {
  firstDoc: EventDocumentSnapshot;
  data: T;
  lastDoc: EventDocumentSnapshot;
};

interface EventParams {
  id?: string | null | undefined;
  title: string;
  description: string;
  status?: PostStatus;
  startTime: Timestamp;
  endTime: Timestamp;
  organizer: {
    name: string;
    photoURL: string;
    description: string;
    email: string;
    contact: string;
  };
  venue: EventVenueType;
  displayImage: string;
  isAllDay: boolean;
  background: string;
  timestamp?: string;
  author: Author;
}

interface QueryParams {
  _startAfter?: any;
  _limit?: number;
  _flatten?: boolean;
  _startAt?: string | string[];
  _direction?: "forward" | "backward";
  _userId?: string;
  _occur_in?: "upcoming" | "past";
}

const headings = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
};

export type EventVenue = "online" | "offline";

export type EventOnlineType = {
  type: "online";
  meetingLink: string;
};

export type EventOfflineType = {
  type: "offline";
  name: string;
  image: string;
  mapsLink: string;
};

export type EventVenueType = EventOnlineType | EventOfflineType;

export type PostStatus = "draft" | "published" | "scheduled" | "unpublished";

export class Event {
  _id: string | undefined | null = undefined;
  title: string;
  description: string;
  _status: PostStatus;
  startTime: Timestamp;
  endTime: Timestamp;
  organizer: {
    name: string;
    photoURL: string;
    description: string;
    email: string;
    contact: string;
  };
  venue: EventVenueType;
  displayImage: string;
  isAllDay: boolean;
  background: string;
  timestamp?: string | undefined;
  readonly author: Author;

  get id(): string | undefined {
    if (this._id) return this._id;
    console.warn("Event id is not set, Try calling generateUniqueId() first");
    return undefined;
  }

  set id(id: string) {
    this._id = id;
  }

  get status() {
    return this._status;
  }

  constructor(params: EventParams) {
    this._id = params.id;
    this.title = params.title;
    this.description = params.description;
    this._status = params.status ?? "draft";
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.organizer = params.organizer;
    this.venue = params.venue;
    this.displayImage = params.displayImage;
    this.isAllDay = params.isAllDay;
    this.background = params.background;
    this.timestamp = params.timestamp;
    this.author = params.author;
  }

  static collectionRef() {
    return collection(db, "events", "collections", "all_events");
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
    const docRef = doc(db, "events", "collections", "all_events", id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  }

  async saveToFirestore() {
    const eventId = this.id ?? (await this.generateUniqueId());

    const eventRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      eventId
    ).withConverter(eventConverter);

    await setDoc(eventRef, this, { merge: true });

    return this;
  }

  async updateInFirestore() {
    if (!this.id) {
      throw new Error("Event ID is required to update the document");
    }

    const eventRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      this.id
    ).withConverter(eventConverter);

    await setDoc(eventRef, this, { merge: true });

    return this;
  }

  static async deleteFromFirestore(id: string) {
    if (!id) {
      throw new Error("Event id is missing");
    }

    const eventRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      id
    ).withConverter(eventConverter);

    await deleteDoc(eventRef);

    return id;
  }

  /**
   * Publishes the post.
   */
  live() {
    this._status = "published";
    // this._scheduledTime = undefined;
  }

  /**
   *
   * @param scheduledTime - The time to schedule the post in ISO string format.
   */
  //   schedule(scheduledTime: string) {
  //     // Check if the input time is valid ISO string
  //     if (!new Date(scheduledTime).toISOString()) {
  //       throw new Error("Invalid Scheduled Time");
  //     }

  //     this._status = "scheduled";
  //     this._scheduledTime = scheduledTime;
  //   }

  //   /**
  //    * Publishes the post.
  //    */
  //   draft() {
  //     this._status = "draft";
  //   }

  //   unpublish() {
  //     this._status = "unpublished";
  //   }

  //   setFlagshipDate(date: Dayjs | null) {
  //     this._flagshipDate = date ? date.format("DD-MM-YYYY") : null;
  //   }

  static async getClosestEvent() {
    const now = Timestamp.fromDate(dayjs().toDate());

    const eventsRef = collection(
      db,
      "events",
      "collections",
      "all_events"
    ).withConverter(eventConverter);

    // Query for upcoming events
    const upcomingQuery = query(
      eventsRef,
      where("startTime", ">=", now),
      orderBy("startTime", "asc"),
      limit(1)
    );
    const upcomingSnapshot = await getDocs(upcomingQuery);

    if (!upcomingSnapshot.empty) {
      const closestUpcomingEvent = flattenQueryData(upcomingSnapshot)[0];
      return closestUpcomingEvent;
    } else {
      // If no upcoming events, query for past events
      const pastQuery = query(
        eventsRef,
        where("startTime", "<", now),
        orderBy("startTime", "desc"),
        limit(1)
      );
      const pastSnapshot = await getDocs(pastQuery);

      if (!pastSnapshot.empty) {
        const closestPastEvent = flattenQueryData(pastSnapshot)[0];
        return closestPastEvent;
      }
    }

    return null;
  }

  static async fetchEventsForDateRange() {
    const now = dayjs();
    const startDate = Timestamp.fromDate(now.toDate());
    const endDate = Timestamp.fromDate(now.add(1, "month").toDate());

    const eventsRef = collection(
      db,
      "events",
      "collections",
      "all_events"
    ).withConverter(eventConverter);
    const eventsQuery = query(
      eventsRef,
      where("startTime", ">=", startDate),
      where("startTime", "<=", endDate),
      orderBy("startTime", "asc")
    );

    const querySnapshot = await getDocs(eventsQuery);
    return flattenQueryData(querySnapshot);
  }

  static async updatePublishStatusInFirestore(
    id: string,
    isPublished: boolean
  ) {
    if (!id) {
      throw new Error("Event id is missing");
    }

    const eventRef = doc(db, "events", "collections", "all_events", id);

    await setDoc(
      eventRef,
      {
        status: isPublished ? "published" : "unpublished",
      },
      { merge: true }
    );

    return id;
  }

  /**
   * Fetches a event document from Firestore.
   *
   * Overload 1: Fetches the document snapshot.
   * @param {string} id - The ID of the event to fetch.
   * @returns {Promise<EventDocumentSnapshot>} A promise that resolves to the event document snapshot.
   * @throws Will throw an error if the event cannot be fetched or doesn't exist.
   *
   * Overload 2: Fetches the document snapshot without flattening.
   * @param {string} id - The ID of the event to fetch.
   * @param {false} flatten - A boolean flag set to false indicating the document data should not be flattened.
   * @returns {Promise<EventDocumentSnapshot>} A promise that resolves to the event document snapshot.
   * @throws Will throw an error if the event cannot be fetched or doesn't exist.
   *
   * Overload 3: Fetches the document data with flattening.
   * @param {string} id - The ID of the event to fetch.
   * @param {true} flatten - A boolean flag set to true indicating the document data should be flattened.
   * @returns {Promise<Event>} A promise that resolves to the flattened event data.
   * @throws Will throw an error if the event cannot be fetched or doesn't exist.
   *
   * @param {string} id - The ID of the event to fetch.
   * @param {boolean} [flatten=false] - A boolean flag indicating whether to flatten the document data.
   * @returns {Promise<EventDocumentSnapshot | Event>} A promise that resolves to the event document snapshot or flattened event data.
   * @throws Will throw an error if the event cannot be fetched or doesn't exist.
   */
  static async get(id: string): Promise<EventDocumentSnapshot>;
  static async get(id: string, flatten: false): Promise<EventDocumentSnapshot>;
  static async get(id: string, flatten: true): Promise<Event>;
  static async get(id: string, flatten: boolean = false) {
    const docRef = doc(
      db,
      "events",
      "collections",
      "all_events",
      id
    ).withConverter(eventConverter);
    const data = await getDoc(docRef);
    return flatten ? flattenDocumentData(data) : data;
  }

  static async getAll(): Promise<GetAllReturnType<EventQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
  }): Promise<GetAllReturnType<EventQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: false;
  }): Promise<GetAllReturnType<EventQuerySnapshot>>;
  static async getAll({
    _startAfter,
    _limit,
  }: {
    _startAfter?: QueryParams["_startAfter"];
    _limit?: QueryParams["_limit"];
    _flatten: true;
  }): Promise<GetAllReturnType<Event[]>>;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
  }: QueryParams & { _flatten: false }): Promise<
    GetAllReturnType<EventQuerySnapshot>
  >;
  static async getAll({
    _startAfter,
    _limit,
    _flatten,
    _startAt,
    _direction,
    _userId,
    _occur_in,
  }: QueryParams & { _flatten: true }): Promise<GetAllReturnType<Event[]>>;
  static async getAll(queryParams?: QueryParams) {
    const {
      _startAfter,
      _limit = 50,
      _flatten,
      _startAt,
      _direction = "forward",
      _occur_in,
      _userId,
    } = queryParams ?? {};

    console.log("queryParams - ", queryParams);

    const eventsRef = collection(
      db,
      "events",
      "collections",
      "all_events"
    ).withConverter(eventConverter);
    let _query = query(eventsRef, orderBy("timestamp", "desc"), limit(_limit));

    if (_userId) {
      _query = query(_query, where("author.uid", "==", _userId));
    }

    const currentDate = Timestamp.fromDate(dayjs().toDate());
    // occur_in = past | upcoming
    if (_occur_in === "past") {
      _query = query(_query, where("startTime", "<", currentDate));
    } else if (_occur_in === "upcoming") {
      _query = query(_query, where("startTime", ">=", currentDate));
    }

    if (_direction === "forward") {
      if (_startAfter) {
        _query = query(_query, startAfter(_startAfter));
      }
      if (_startAt) {
        const _doc = await getDoc(doc(eventsRef, _startAt as string));
        _query = query(_query, startAt(_doc));
      }
    } else if (_direction === "backward") {
      if (_startAfter) {
        _query = query(_query, endBefore(_startAfter), limitToLast(_limit));
      }
      if (_startAt) {
        const _doc = await getDoc(doc(eventsRef, _startAt as string));
        _query = query(_query, endAt(_doc));
      }
    }

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
    const eventRef = doc(db, "events", "collections", "all_events", id);
    const metadataRef = doc(db, "metadata", "flagshipDates");

    // Use a transaction to ensure consistency
    await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists) {
        throw new Error("Event does not exist!");
      }

      // Update event document
      transaction.update(eventRef, {
        isFlagship: true,
        flagshipDate: date,
      });

      // Update metadata document
      const metadataDoc = await transaction.get(metadataRef);
      const flagshipDates = metadataDoc.data()?.dates || {};
      flagshipDates[Event.flaggedDateFormat(date)] = id;
      transaction.update(metadataRef, { dates: flagshipDates });
    });
  }

  static async getRsvpedEventsForUser(
    userId: string,
    occurIn?: "upcoming" | "past"
  ) {
    // Step 1: Query the RSVP collection for events the user has RSVP'ed to
    const rsvpRef = collection(db, "events", "collections", "rsvp");
    const rsvpQuery = query(rsvpRef, where("uid", "==", userId));
    const rsvpDocs = await getDocs(rsvpQuery);

    // Step 2: Extract the event IDs from the RSVP documents
    const eventIds = rsvpDocs.docs.map((doc) => doc.data().eventId);

    if (eventIds.length === 0) {
      return []; // No RSVP'ed events found for this user
    }

    // Step 3: Fetch the event details for each eventId
    const eventsRef = collection(
      db,
      "events",
      "collections",
      "all_events"
    ).withConverter(eventConverter);
    const currentTimestamp = dayjs().toDate(); // Use dayjs to get the current timestamp

    let eventPromises = eventIds.map((eventId) =>
      getDoc(doc(eventsRef, eventId))
    );

    const eventDocs = await Promise.all(eventPromises);

    // Step 4: Filter events based on the occur_in parameter
    const filteredEvents = eventDocs
      .map((eventDoc) => eventDoc.data())
      .filter((event) => {
        if (!event) return false;
        if (occurIn === "upcoming") {
          return event.startTime.toDate() >= currentTimestamp;
        } else if (occurIn === "past") {
          return event.startTime.toDate() < currentTimestamp;
        }
        return true; // If no filtering is needed
      });

    return filteredEvents;
  }

  static async rsvpEvent(eventId: string, userEmail: string, userId?: string) {
    const rsvpRef = collection(db, "events", "collections", "rsvp");
    await setDoc(doc(rsvpRef), {
      eventId,
      uid: userId ?? null,
      email: userEmail,
      timestamp: serverTimestamp(),
    });
  }

  static async unRsvpEvent(
    eventId: string,
    userEmail: string,
    userId?: string
  ) {
    const rsvpRef = collection(db, "events", "collections", "rsvp");
    const rsvpQuery = query(rsvpRef, where("eventId", "==", eventId));
    const rsvpDocs = await getDocs(rsvpQuery);

    let rsvpDocList = rsvpDocs.docs.filter(
      (doc) => doc.data().email === userEmail
    );
    if (userId) {
      rsvpDocList = rsvpDocs.docs.filter((doc) => doc.data().uid === userId);
    }
    const batch = writeBatch(db);
    if (rsvpDocList) {
      for (const doc of rsvpDocList) {
        batch.delete(doc.ref);
      }
      await batch.commit();
    }
  }

  static async checkUserRSVP(
    eventId: string,
    userEmail?: string,
    userId?: string
  ) {
    console.log("checUserRSVP - ", eventId, userEmail, userId);
    const rsvpRef = collection(db, "events", "collections", "rsvp");
    const rsvpQuery = query(rsvpRef, where("eventId", "==", eventId));
    const rsvpDocs = await getDocs(rsvpQuery);

    if (userId) {
      return rsvpDocs.docs.some((doc) => doc.data().uid === userId);
    }

    if (userEmail) {
      return rsvpDocs.docs.some((doc) => doc.data().email === userEmail);
    }

    return false;
  }

  // static async getTodaysFlagship(): Promise<Event> {
  //   const metadataRef = doc(db, "metadata", "flagshipDates");

  //   const metadataDoc = await getDoc(metadataRef);
  //   const today = new Date().toISOString().split("T")[0];
  //   const flagshipDates = metadataDoc.data()?.dates ?? {};

  //   if (flagshipDates && flagshipDates[today]) {
  //     const eventId = flagshipDates[today];
  //     return Event.get(eventId, true);
  //   } else {
  //     const events = await Event.getAll({ _limit: 1, _flatten: true });
  //     return events.data[0];
  //   }
  // }
}

export const eventConverter = {
  toFirestore: (event: Event) => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      organizer: {
        name: event.organizer.name,
        photoURL: event.organizer.photoURL,
        description: event.organizer.description,
        email: event.organizer.email,
        contact: event.organizer.contact,
      },
      venue: event.venue,
      displayImage: event.displayImage,
      isAllDay: event.isAllDay,
      background: event.background,
      timestamp: serverTimestamp(),
      author: event.author,
    };
  },
  fromFirestore: (snapshot: any) => {
    if (!snapshot.exists) return undefined;
    const data = snapshot.data();
    return new Event({
      id: snapshot.id,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      organizer: data.organizer,
      venue: data.venue,
      displayImage: data.displayImage,
      isAllDay: data.isAllDay,
      background: data.background,
      timestamp: data.timestamp.toDate().toISOString(),
      author: data.author,
    });
  },
};
