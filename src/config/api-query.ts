export const API_QUERY = {
  QUERY_POSTS: ["query-posts"],
  QUERY_DRAFT_POSTS: ["query-draft-posts"],
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
  QUERY_SIGNALS: (limit: number, startAt?: string | string[]) => [
    "query-signals",
    limit,
    startAt,
  ],
  GET_SIGNAL_BY_ID: (signalId?: string | null) => [
    "get-signal-by-id",
    signalId,
  ],
  GET_RECENT_POSTS: ["get-recent-posts"],
  GET_FLAGSHIP_SIGNAL: ["get-flagship-signal"],
  NOUN_PROJECT_ICONS: (query?: string | null) => ["noun-project-icons", query],
};
