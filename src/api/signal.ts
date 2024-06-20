import { API_QUERY } from "@/config/api-query";
import { Signal } from "@/firebase/signal";
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useQuerySignals = ({ initialData }: { initialData: any }) => {
  const querySignals = async () => {
    const signals = await Signal.getAll({ _flatten: true });

    return signals;
  };

  return useQuery({
    queryKey: API_QUERY.QUERY_SIGNALS,
    queryFn: querySignals,
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialData,
  });
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
