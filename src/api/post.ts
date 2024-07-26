import { API_QUERY } from "@/config/api-query";
import { Post } from "@/firebase/post-v2";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import {
  DefinedUseQueryResult,
  Query,
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { WriteBatch, writeBatch } from "firebase/firestore";
import { useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { PostFilters } from "@/components/Drafts/PostDrafts/PostDraftsEntry";

export const useQueryPosts = ({
  initialData,
  status = ["published"],
  sort = [{ field: "timestamp", order: "desc" }],
  userEmail,
  enabled = true,
  dateRange,
  topics,
  limit = 10,
}: {
  userEmail?: string;
  initialData: any;
  enabled?: boolean;
  limit?: number;
} & Partial<PostFilters>) => {
  const queryPosts = async (
    pageParam: any,
    queryKey: QueryKey,
    direction: "forward" | "backward"
  ) => {
    const [, userEmail, status, sort, dateRange, topics] = queryKey;
    if (typeof status !== "string") {
      throw new Error("Status is required");
    }

    try {
      const posts = await Post.getAll({
        _userEmail: userEmail as string,
        _flatten: true,
        _startAfter: pageParam,
        status: status ? status.split(",") : [],
        _limit: limit as number,
        sort: sort as { field: string; order: "asc" | "desc" }[],
        dateRange: dateRange as PostFilters["dateRange"],
        topics: topics as PostFilters["topics"],
      });
      return posts;
    } catch (e) {
      console.log("Error in queryPosts - ", e);
      return { lastDoc: undefined, data: [] };
    }
  };

  const query = useInfiniteQuery({
    queryKey: API_QUERY.QUERY_POSTS(userEmail, status, sort, dateRange, topics),
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      queryPosts(pageParam, queryKey, direction),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.lastDoc || lastPage?.data?.length < limit) return undefined;
      return lastPage.lastDoc as any;
    },
    enabled,
  });

  const posts = useMemo(() => {
    return query.data?.pages.map((page) => page.data).flat() ?? initialData;
  }, [query.data]);

  return {
    ...query,
    posts,
  };
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
    const _post = await post.saveToFirestore();

    return _post;
  };

  return useMutation({
    mutationFn: createPost,
    onSettled: () => {
      qc.invalidateQueries({
        // queryKey: API_QUERY.QUERY_POSTS(),
      });
    },
    ...(options ?? {}),
    onSuccess: async (data, ...rest) => {
      // const sendEmailCallable = httpsCallable(
      //   functions,
      //   "sendEmailToSubscribersForSinglePost"
      // );

      // try {
      //   await sendEmailCallable({ postId: data });
      // } catch (e) {
      //   console.error("Error in email - ", e);
      // }

      // await new Promise((resolve) => setTimeout(resolve, 1000));

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
        // queryKey: API_QUERY.QUERY_POSTS([]),
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
    const _post = await post.updateInFirestore();

    return _post;
  };

  return useMutation({
    mutationFn: updatePost,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        // queryKey: API_QUERY.QUERY_POSTS([]),
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
    // await Post.deleteDraftFromFirestore(postId);
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

export const useUnPublishPost = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const unpublishPost = async (postId: string) => {
    await Post.unpublishPostInFirestore(postId);
    return postId;
  };

  return useMutation({
    mutationFn: unpublishPost,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        predicate: (query: Query) =>
          // @ts-ignore
          query.queryKey[0].includes(API_QUERY.QUERY_POSTS()[0]),
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_POST_BY_ID(data),
      });
    },
    ...(options ?? {}),
  });
};

export const usePublishPost = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const publishPost = async (postId: string) => {
    await Post.publishPostInFirestore(postId);
    return postId;
  };

  return useMutation({
    mutationFn: publishPost,
    onSettled: (data: any) => {
      qc.invalidateQueries({
        predicate: (query: Query) =>
          // @ts-ignore
          query.queryKey[0].includes(API_QUERY.QUERY_POSTS()[0]),
      });
      qc.invalidateQueries({
        queryKey: API_QUERY.GET_POST_BY_ID(data),
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
