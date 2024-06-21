import { API_QUERY } from "@/config/api-query";
import { Post } from "@/firebase/post";
import { db } from "@/lib/firebase";
import {
  QueryFunctionContext,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";

export const useQueryPosts = ({ initialData }: { initialData: any }) => {
  const queryPosts = async () => {
    const posts = await Post.getAll({ _flatten: true });

    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.QUERY_POSTS,
    queryFn: queryPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData,
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

const handleFlagshipPost = async (postId: string, isFlagship: boolean) => {
  const posts = await Post.getFlagship(true);

  const batch = writeBatch(db);

  posts.forEach((post) => {
    if (post.id !== postId)
      batch.update(post.ref, {
        isFlagship: false,
        unflagged_at: serverTimestamp(),
      });
  });

  const newFlagshipPostRef = doc(db, "posts", postId);
  batch.update(newFlagshipPostRef, {
    isFlagship: isFlagship,
    flagged_at: serverTimestamp(),
  });

  await batch.commit();
};

export const useCreatePost = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const createPost = async (post: Post) => {
    const newPostId = await post.saveToFirestore();
    if (post.isFlagship) {
      await handleFlagshipPost(newPostId, true);
    }
    return newPostId;
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

export const useGetFlagshipPost = () => {
  const getFlagshipPost = async () => {
    const posts = await Post.getFlagship();
    return posts.docs[0];
  };

  return useQuery({
    queryKey: API_QUERY.GET_FLAGSHIP_POST,
    queryFn: getFlagshipPost,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UseGetPostsByCategoryOptions {
  category?: string | null;
}
export const useGetPostsByCategory = ({
  category,
}: UseGetPostsByCategoryOptions) => {
  const getPostsByCategory = async ({ queryKey }: QueryFunctionContext) => {
    const [, category] = queryKey as [string, string];
    if (!category || typeof category !== "string") {
      throw new Error("Category is required");
    }
    const posts = await Post.getByCategory(category);
    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.GET_POSTS_BY_CATEGORY(category),
    queryFn: getPostsByCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UseGetRecentPostsOptions {
  limit?: number;
}
export const useGetRecentPosts = (props?: UseGetRecentPostsOptions) => {
  const getRecentPosts = async () => {
    const posts = await Post.getRecentPosts(props?.limit ?? 4);
    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.GET_RECENT_POSTS,
    queryFn: getRecentPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
