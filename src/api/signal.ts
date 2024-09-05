import { API_QUERY } from "@/config/api-query";
import { Signal } from "@/firebase/signal";
import {
  QueryFunctionContext,
  QueryKey,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getDocs, writeBatch } from "firebase/firestore";
import { useMemo } from "react";

// export const useGetMessages = ({
//   conversationId,
//   initialPageParam,
//   enabled = false,
// }: {
//   conversationId: string | null;
//   initialPageParam?: string | null;
//   enabled?: boolean;
// }) => {
//   const qc = useQueryClient();
//   const LIMIT = 10;
//   const fetchMessages = async (
//     pageParam: undefined | any,
//     queryKey: QueryKey,
//     direction: "forward" | "backward" = "forward"
//   ) => {
//     const [, conversationId] = queryKey;
//     if (!conversationId || typeof conversationId !== "string") {
//       throw new Error("Conversation ID is required");
//     }
//     const response = await axios.get(
//       ROUTES.CONVERSATION.GET_MESSAGES(conversationId),
//       {
//         params: {
//           cursor_id: pageParam?.cursorId,
//           limit:
//             LIMIT *
//             (pageParam?.initial ? -1 : direction === "forward" ? 1 : -1),
//           include_cursor: pageParam?.include_cursor,
//         },
//       }
//     );

//     return response.data.data;
//   };

//   return useInfiniteQuery<GetMessagesInifiniteResponse>({
//     queryKey: API_QUERIES.GET_MESSAGES(conversationId),
//     queryFn: ({ pageParam, queryKey, direction }: any) =>
//       fetchMessages(pageParam, queryKey, direction),
//     initialPageParam: initialPageParam
//       ? {
//           cursorId: initialPageParam,
//           initial: true,
//           include_cursor: true,
//         }
//       : undefined,
//     enabled: !!enabled && !!conversationId,
//     getNextPageParam: (lastPage, allPages) => {
//       if (lastPage.length === 0) return undefined;
//       return {
//         cursorId: lastPage[lastPage.length - 1]?.id,
//         include_cursor: false,
//       };
//     },
//     getPreviousPageParam: (firstPage, allPages) => {
//       if (firstPage.length === 0) return undefined;
//       return { cursorId: firstPage[0]?.id, include_cursor: false };
//     },
//   });
// };

export const useGetFlagshipSignal = () => {
  const getFlagshipSignal = async () => {
    const signal = await Signal.getTodayFlagship();
    return signal;
  };

  return useQuery({
    queryKey: API_QUERY.GET_FLAGSHIP_SIGNAL,
    queryFn: getFlagshipSignal,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useQuerySignals = ({
  // initialData,
  initialPageParam,
  startAt,
  limit = 10,
  userId,
  enabled = true,
  status,
}: {
  // initialData: Signal[];
  initialPageParam?: string;
  startAt?: string | string[];
  limit?: number;
  userId?: string;
  enabled?: boolean;
  status?: string;
}) => {
  const querySignals = async (
    pageParam: any,
    queryKey: QueryKey,
    direction: "forward" | "backward"
  ) => {
    const [, userId, limit, startAt] = queryKey;
    const signals = await Signal.getAll({
      _flatten: true,
      _startAfter: pageParam,
      _limit: limit as number,
      _startAt: startAt as string | string[],
      _direction: direction,
      _userId: userId as string,
      _status: status as string,
    });
    return signals;
  };

  const query = useInfiniteQuery({
    queryKey: API_QUERY.QUERY_SIGNALS(userId, limit, startAt, status),
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      querySignals(pageParam, queryKey, direction),
    // initialData: {
    //   pages: [{ data: initialData, lastDoc: undefined as any }],
    //   pageParams: [],
    // },
    initialPageParam,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.lastDoc || lastPage?.data?.length < limit) return undefined;
      return lastPage.lastDoc as any;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (!firstPage.firstDoc || firstPage?.data?.length < limit)
        return undefined;
      return firstPage.firstDoc as any;
    },
    enabled,
  });

  const signals = useMemo(() => {
    return query.data?.pages.map((page) => page.data).flat();
  }, [query.data]);

  return {
    ...query,
    signals,
  };
};

export const useGetSignalById = (signalId?: string | null) => {
  const getSignal = async ({ queryKey }: QueryFunctionContext) => {
    const [, signalId] = queryKey;
    if (!signalId || typeof signalId !== "string") {
      throw new Error("Signal ID is required");
    }
    const signal = await Signal.get(signalId, true);
    return signal;
  };

  return useQuery({
    queryKey: API_QUERY.GET_SIGNAL_BY_ID(signalId),
    queryFn: getSignal,
    enabled: !!signalId,
  });
};

export const useCreateSignal = (
  options?: UseMutationOptions<Signal, Error, Signal>
) => {
  const qc = useQueryClient();

  const createSignal = async (signal: Signal) => {
    const newSignal = await signal.saveToFirestore();
    return newSignal;
  };

  return useMutation({
    mutationFn: createSignal,
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_SIGNALS()[0];
        },
      });

      qc.invalidateQueries({
        queryKey: API_QUERY.GET_FLAGSHIP_SIGNAL,
      });
    },
    ...(options ?? {}),
  });
};

export const useUpdateSignal = (
  options?: UseMutationOptions<any, Error, Signal>
) => {
  const qc = useQueryClient();

  const updateSignal = async (signal: Signal) => {
    if (!signal.id) {
      throw new Error("Signal ID is required");
    }
    const updatedSignal = await signal.updateInFirestore();
    return updatedSignal;
  };

  return useMutation({
    mutationFn: updateSignal,
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_SIGNALS()[0];
        },
      });

      qc.invalidateQueries({
        queryKey: API_QUERY.GET_FLAGSHIP_SIGNAL,
      });
    },
    ...(options ?? {}),
  });
};

export const useDeleteSignal = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const deleteSignal = async (signalId: string) => {
    await Signal.deleteFromFirestore(signalId);
    return signalId;
  };

  return useMutation({
    mutationFn: deleteSignal,
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_SIGNALS()[0];
        },
      });
    },
    ...(options ?? {}),
  });
};

export const useUnPublishSignal = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const unPublishSignal = async (signalId: string) => {
    await Signal.updatePublishStatusInFirestore(signalId, false);
    return signalId;
  };

  return useMutation({
    mutationFn: unPublishSignal,
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_SIGNALS()[0];
        },
      });
    },
    ...(options ?? {}),
  });
};

export const usePublishSignal = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const qc = useQueryClient();

  const publishSignal = async (signalId: string) => {
    await Signal.updatePublishStatusInFirestore(signalId, true);
    return signalId;
  };

  return useMutation({
    mutationFn: publishSignal,
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_SIGNALS()[0];
        },
      });
    },
    ...(options ?? {}),
  });
};

export async function setAllSignalsToPublished() {
  const signalRef = Signal.collectionRef();
  const batch = writeBatch(signalRef.firestore);

  const docs = await getDocs(signalRef);

  docs.forEach((doc) => {
    batch.update(doc.ref, { status: "published", published: null });
  });

  await batch.commit();
}
