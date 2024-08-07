import { Dayjs } from "dayjs";

export const API_QUERY = {
  QUERY_POSTS: (
    userId?: string | null | undefined,
    status?: string[],
    sort?: { field: string; order: "asc" | "desc" }[],
    dateRange?: [Dayjs | null, Dayjs | null],
    topics?: string[]
  ) => ["query-posts", userId, status?.join(","), sort, dateRange, topics],
  GET_CLOSEST_EVENT: ["get-closest-event"],
  QUERY_EVENTS: () => ["query-events"],
  QUERY_SAVED_POSTS: (userId?: string | null | undefined) => [
    "query-saved-posts",
    userId,
  ],
  QUERY_DRAFT_POSTS: (...status: string[]) => [
    "query-draft-posts",
    status.join(","),
  ],
  GET_POST_BY_ID: (postId?: string | null) => ["get-post-by-id", postId],
  GET_DRAFT_POST_BY_ID: (draftPostId?: string | null) => [
    "get-draft-post-by-id",
    draftPostId,
  ],
  GET_FLAGSHIP_POST: ["get-flagship-post"],
  GET_POSTS_BY_CATEGORY: (category?: string | null) => [
    "get-posts-by-category",
    category,
  ],
  QUERY_SIGNALS: (
    userId?: string,
    limit?: number,
    startAt?: string | string[],
    status?: string
  ) => ["query-signals", userId, limit, startAt, status],
  GET_SIGNAL_BY_ID: (signalId?: string | null) => [
    "get-signal-by-id",
    signalId,
  ],
  GET_EVENTS_FOR_DATE_RANGE: ["get-events-for-date-range"],
  GET_EVENT_BY_ID: (eventId?: string | null) => ["get-event-by-id", eventId],
  GET_RECENT_POSTS: ["get-recent-posts"],
  GET_FLAGSHIP_SIGNAL: ["get-flagship-signal"],
  NOUN_PROJECT_ICONS: (query?: string | null) => ["noun-project-icons", query],
};
