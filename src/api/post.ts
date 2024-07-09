import { API_QUERY } from "@/config/api-query";
import { Post } from "@/firebase/post-v2";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import {
  QueryFunctionContext,
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useCreatePost = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const createPost = async (post: Post) => {
    const newPostId = await post.saveToFirestore();
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
    onSuccess: async (data, ...rest) => {
      const sendEmailCallable = httpsCallable(
        functions,
        "sendEmailToSubscribersForSinglePost"
      );

      try {
        await sendEmailCallable(data);
      } catch (e) {
        console.error("Error in email - ", e);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      options?.onSuccess?.(data, ...rest);
    },
  });
};

export const useDeletePost = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const deletePost = async (postId: string) => {
    await Post.deleteFromFirestore(postId);
    return postId;
  };

  return useMutation({
    mutationFn: deletePost,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_POSTS,
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_POST_BY_ID(data),
      });
    },
    ...(options ?? {}),
  });
};

export const useUpdatePost = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const updatePost = async (post: Post) => {
    if (!post.id) {
      throw new Error("Post ID is required");
    }
    const id = await post.updateInFirestore();

    return id;
  };

  return useMutation({
    mutationFn: updatePost,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_POSTS,
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_POST_BY_ID(data),
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
    const posts = await Post.getRecentPosts(props?.limit ?? 5);
    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.GET_RECENT_POSTS,
    queryFn: getRecentPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
