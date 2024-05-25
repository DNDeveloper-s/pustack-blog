import { API_QUERY } from "@/config/api-query";
import { Post } from "@/firebase/post";
import {
  QueryFunctionContext,
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useQueryPosts = () => {
  const queryPosts = async () => {
    const posts = await Post.getAll({ _flatten: true });

    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.QUERY_POSTS,
    queryFn: queryPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetPostById = (postId?: string | null) => {
  const getPostById = async ({ queryKey }: QueryFunctionContext) => {
    const [, postId] = queryKey;
    if (!postId || typeof postId !== "string") {
      throw new Error("Post ID is required");
    }
    const post = await Post.get(postId, true);
    return post;
  };

  return useQuery({
    queryKey: API_QUERY.GET_POST_BY_ID(postId),
    queryFn: getPostById,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!postId,
  });
};

export const useCreatePost = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const createPost = async (post: Post) => {
    const newPost = await post.saveToFirestore();
    return newPost;
  };

  return useMutation({
    mutationFn: createPost,
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_POSTS,
      });
    },
    ...(options ?? {}),
  });
};
