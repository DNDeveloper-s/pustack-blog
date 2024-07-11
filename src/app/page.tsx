import LandingPageSections from "@/components/LandingPage/LandingPageSections";
import Navbar from "@/components/Navbar/Navbar";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { db } from "@/lib/firebase";
import {
  collection,
  limit,
  query,
  orderBy,
  getDocs,
  QuerySnapshot,
  where,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { compact } from "lodash";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import dynamic from "next/dynamic";
// const Dashboard from "@/components/Dashboard/Dashboard";
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), {
  ssr: false,
});

function flattenQueryDataWithId<T>(data: QuerySnapshot<T>) {
  return compact(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  ) as (T & { id: string })[];
}

export const revalidate = 0;

export default async function Home() {
  // const posts = await Post.getAll({ _flatten: true });

  const postsRef = collection(db, "posts");

  // Set all posts to be published
  const _docs = await getDocs(postsRef);

  const batch = writeBatch(db);

  for (let doc of _docs.docs) {
    if (!doc.data().sections) {
      batch.delete(doc.ref);
    }
  }

  await batch.commit();

  let _query = query(
    postsRef,
    where("status", "==", "published"),
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

  const signalsRef = collection(db, "signals");
  let _signals_query = query(
    signalsRef,
    orderBy("timestamp", "desc"),
    limit(10)
  );

  const signal_docs = await getDocs(_signals_query);

  const signals = flattenQueryDataWithId(signal_docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
    flagged_at: doc.flagged_at?.toDate().toISOString(),
    unflagged_at: doc.unflagged_at?.toDate().toISOString(),
  }));

  // const docRef = doc(db, "posts", props.params.postId[0]);
  // const data = await getDoc(docRef);
  // const post = flattenDocumentData(data);
  // const doc1 = await getAuthenticatedAppForUser();

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <main className="w-full max-w-[1440px] mx-auto px-3">
        <Navbar />
        <div className="">
          <Dashboard posts={posts} signals={signals} />
          <LandingPageSections />
        </div>
      </main>
    </ErrorBoundary>
  );
}
