export const API_QUERY = {
  QUERY_POSTS: ["query-posts"],
  GET_POST_BY_ID: (postId?: string | null) => ["get-post-by-id", postId],
  GET_FLAGSHIP_POST: ["get-flagship-post"],
};
