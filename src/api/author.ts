import { API_QUERY } from "@/config/api-query";
import { transformUserData } from "@/context/UserContext";
import { Post } from "@/firebase/post-v2";
import { db } from "@/lib/firebase";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  where,
} from "firebase/firestore";

interface UseGetAuthorByIdOptions {
  id?: string | null;
}
export const useGetAuthorById = ({ id }: UseGetAuthorByIdOptions) => {
  const getAuthorById = async ({ queryKey }: QueryFunctionContext) => {
    const [, id] = queryKey;
    if (typeof id !== "string") return;
    const user = await getDoc(doc(db, "users", id));

    const postRef = collection(db, "posts");
    const postQuery = query(postRef, where("author.uid", "==", id));
    const articleCount = await getCountFromServer(postQuery);

    const signalRef = collection(db, "signals");
    const signalQuery = query(signalRef, where("author.uid", "==", id));
    const signalCount = await getCountFromServer(signalQuery);

    const eventRef = collection(db, "events");
    const eventQuery = query(eventRef, where("author.uid", "==", id));
    const eventCount = await getCountFromServer(eventQuery);

    const author = transformUserData(user);

    return {
      ...author,
      articleCount: articleCount.data().count,
      signalCount: signalCount.data().count,
      eventCount: eventCount.data().count,
    };
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
