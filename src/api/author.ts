import { API_QUERY } from "@/config/api-query";
import { transformUserData } from "@/context/UserContext";
import { Post } from "@/firebase/post-v2";
import { db } from "@/lib/firebase";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

interface UseGetAuthorByIdOptions {
  id?: string | null;
}
export const useGetAuthorById = ({ id }: UseGetAuthorByIdOptions) => {
  const getAuthorById = async ({ queryKey }: QueryFunctionContext) => {
    const [, id] = queryKey;
    if (typeof id !== "string") return;
    const user = await getDoc(doc(db, "users", id));

    return transformUserData(user);
  };
  const queryData = useQuery({
    queryKey: API_QUERY.AUTHOR(id),
    queryFn: getAuthorById,
    enabled: !!id,
  });

  return {
    author: queryData.data,
    ...queryData,
  };
};
