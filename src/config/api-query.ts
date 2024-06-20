export const API_QUERY = {
  QUERY_POSTS: ["query-posts"],
  GET_POST_BY_ID: (postId?: string | null) => ["get-post-by-id", postId],
  GET_FLAGSHIP_POST: ["get-flagship-post"],
  GET_POSTS_BY_CATEGORY: (category?: string | null) => [
    "get-posts-by-category",
    category,
  ],
  QUERY_SIGNALS: ["query-signals"],
  GET_SIGNAL_BY_ID: (signalId?: string | null) => [
    "get-signal-by-id",
    signalId,
  ],
};
