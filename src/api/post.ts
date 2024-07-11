import { API_QUERY } from "@/config/api-query";
import { Post } from "@/firebase/post-v2";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import {
  DefinedUseQueryResult,
  QueryFunctionContext,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { WriteBatch, writeBatch } from "firebase/firestore";

export const useQueryPosts = ({
  initialData,
  status = ["published"],
}: {
  initialData: any;
  status: string[];
}) => {
  const queryPosts = async ({ queryKey }: QueryFunctionContext) => {
    const [, status] = queryKey;

    console.log('status.split(",") - ', status);

    if (typeof status !== "string") {
      throw new Error("Status is required");
    }

    const posts = await Post.getAll({
      _flatten: true,
      _status: status.split(","),
    });

    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.QUERY_POSTS(status),
    queryFn: queryPosts,
    enabled: true,
    staleTime: 0, // 5 minutes
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

interface UseCreatePostOptions {
  post: Post;
  draftPostId?: string;
}
export const useCreatePost = (
  options?: UseMutationOptions<any, Error, UseCreatePostOptions>
) => {
  const qc = useQueryClient();

  const createPost = async ({ post, draftPostId }: UseCreatePostOptions) => {
    let batch: boolean | WriteBatch = false;
    if (draftPostId) {
      batch = (await Post.deleteDraftFromFirestore(
        draftPostId,
        true
      )) as WriteBatch;
    }

    const returnedType = await post.saveToFirestore(batch);

    if (returnedType instanceof WriteBatch) {
      await returnedType.commit();
    }

    return returnedType;
  };

  return useMutation({
    mutationFn: createPost,
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_POSTS([]),
      });
    },
    ...(options ?? {}),
    onSuccess: async (data, ...rest) => {
      const sendEmailCallable = httpsCallable(
        functions,
        "sendEmailToSubscribersForSinglePost"
      );

      try {
        await sendEmailCallable({ postId: data });
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
        queryKey: API_QUERY.QUERY_POSTS([]),
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
        queryKey: API_QUERY.QUERY_POSTS([]),
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

export const useCreateDraftPost = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const saveDraftPost = async (post: Post) => {
    const newPostId = await post.saveDraftToFirestore();
    return newPostId;
  };

  return useMutation({
    mutationFn: saveDraftPost,
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_DRAFT_POSTS(),
      });
    },
    ...(options ?? {}),
  });
};

export const useGetDraftPostById = (
  draftPostId?: string | null,
  options?: { enabled?: boolean }
) => {
  const getDraftPostById = async ({ queryKey }: QueryFunctionContext) => {
    const [, draftPostId] = queryKey;
    if (!draftPostId || typeof draftPostId !== "string") {
      throw new Error("Draft Post ID is required");
    }
    const post = await Post.get(draftPostId, true);
    return post;
  };

  return useQuery({
    queryKey: API_QUERY.GET_DRAFT_POST_BY_ID(draftPostId),
    queryFn: getDraftPostById,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled:
      !!draftPostId &&
      (options?.enabled !== undefined ? options.enabled : true),
  });
};

export const useQueryDraftPosts = ({
  initialData,
}: {
  initialData: Post[];
}): DefinedUseQueryResult<Post[], Error> => {
  const queryDraftPosts = async () => {
    const posts = await Post.getAllDrafts({ _flatten: true });
    return posts;
  };

  return useQuery({
    queryKey: API_QUERY.QUERY_DRAFT_POSTS(),
    queryFn: queryDraftPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData,
  });
};

export const useDeletePostDraft = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const deletePostDraft = async (postId: string) => {
    await Post.deleteDraftFromFirestore(postId);
    return postId;
  };

  return useMutation({
    mutationFn: deletePostDraft,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_DRAFT_POSTS(),
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_DRAFT_POST_BY_ID(data),
      });
    },
    ...(options ?? {}),
  });
};

export const useUpdatePostDraft = (
  options?: UseMutationOptions<any, Error, Post>
) => {
  const qc = useQueryClient();

  const updatePostDraft = async (post: Post) => {
    if (!post.id) {
      throw new Error("Post ID is required");
    }
    const id = await post.updateDraftInFirestore();

    return id;
  };

  return useMutation({
    mutationFn: updatePostDraft,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_DRAFT_POSTS(),
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_DRAFT_POST_BY_ID(data),
      });
    },
    ...(options ?? {}),
  });
};
