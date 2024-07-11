import dynamic from "next/dynamic";
const PostDraftsEntry = dynamic(
  () => import("@/components/Drafts/PostDrafts/PostDraftsEntry"),
  {
    ssr: false,
  }
);
import { flattenQueryDataWithId } from "@/firebase/post-v2";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const revalidate = 0;

export default async function PostDrafts() {
  const postsRef = collection(db, "posts");
  let _query = query(
    postsRef,
    where("status", "==", "draft"),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  const docs = await getDocs(_query);

  const posts = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
    flagged_at: doc.flagged_at?.toDate().toISOString(),
    unflagged_at: doc.unflagged_at?.toDate().toISOString(),
  }));

  return <PostDraftsEntry _serverPosts={posts} />;
}
