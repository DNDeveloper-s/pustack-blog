import { TheNounProjectIconResponse } from "@/app/api/the-noun-project/route";
import { API_QUERY } from "@/config/api-query";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export const useFetchNounProjectIcon = ({
  query,
  enabled = true,
}: {
  query?: string;
  enabled?: boolean;
}) => {
  const fetchIcons = async ({ queryKey }: QueryFunctionContext) => {
    const [, query] = queryKey;
    const data = await fetch(`/api/the-noun-project?query=${query}`).then(
      (res) => res.json()
    );

    return data as TheNounProjectIconResponse;
  };
  return useQuery({
    queryKey: API_QUERY.NOUN_PROJECT_ICONS(query),
    queryFn: fetchIcons,
    enabled: !!enabled && !!query && query?.trim().length > 0,
  });
};
