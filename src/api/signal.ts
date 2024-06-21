import { API_QUERY } from "@/config/api-query";
import { Signal } from "@/firebase/signal";
import {
  QueryKey,
  UseMutationOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    const posts = await Signal.getAll({ _limit: 1 });
    return posts.data.docs[0];
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
}: {
  // initialData: Signal[];
  initialPageParam?: string;
}) => {
  const querySignals = async (pageParam: any) => {
    console.log("pageParam - ", pageParam);
    const signals = await Signal.getAll({
      _flatten: true,
      _startAfter: pageParam,
      _limit: 10,
    });
    return signals;
  };

  const query = useInfiniteQuery({
    queryKey: API_QUERY.QUERY_SIGNALS,
    queryFn: ({ pageParam }: any) => querySignals(pageParam),
    // initialData: {
    //   pages: [{ data: initialData, lastDoc: undefined as any }],
    //   pageParams: [],
    // },
    initialPageParam,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.lastDoc) return undefined;
      return lastPage.lastDoc as any;
    },
  });

  const signals = useMemo(() => {
    return query.data?.pages.map((page) => page.data).flat();
  }, [query.data]);

  return {
    ...query,
    signals,
  };
};

export const useCreateSignal = (
  options?: UseMutationOptions<any, Error, Signal>
) => {
  const qc = useQueryClient();

  const createSignal = async (signal: Signal) => {
    const newSignalId = await signal.saveToFirestore();
    return newSignalId;
  };

  return useMutation({
    mutationFn: createSignal,
    onSettled: () => {
      qc.invalidateQueries({
        queryKey: API_QUERY.QUERY_SIGNALS,
      });
    },
    ...(options ?? {}),
  });
};
