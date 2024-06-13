import Dashboard from "@/components/Dashboard/Dashboard";
import LandingPageSections from "@/components/LandingPage/LandingPageSections";
import Navbar from "@/components/Navbar/Navbar";
import { flattenQueryData, flattenQueryDataWithId } from "@/firebase/post";
import { db } from "@/lib/firebase";
import { collection, limit, query, orderBy, getDocs } from "firebase/firestore";

export default async function Home() {
  // const posts = await Post.getAll({ _flatten: true });

  const postsRef = collection(db, "posts");
  let _query = query(postsRef, orderBy("timestamp", "desc"), limit(50));

  const docs = await getDocs(_query);

  const posts = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
  }));

  // const docRef = doc(db, "posts", props.params.postId[0]);
  // const data = await getDoc(docRef);
  // const post = flattenDocumentData(data);
  // const doc1 = await getAuthenticatedAppForUser();

  return (
    <main className="w-full max-w-[1440px] mx-auto px-0 md:px-3">
      <Navbar />
      <div className="">
        <Dashboard posts={posts} />
        <LandingPageSections />
      </div>
    </main>
  );
}
