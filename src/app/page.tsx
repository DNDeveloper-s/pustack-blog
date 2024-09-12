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
import { Metadata, ResolvingMetadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import dynamic from "next/dynamic";
import Dashboard from "@/components/Dashboard/Dashboard";
// const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), {
//   ssr: false,
// });

function flattenQueryDataWithId<T>(data: QuerySnapshot<T>) {
  return compact(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  ) as (T & { id: string })[];
}

export const revalidate = 0;

type Props = {
  params: { postId: [string] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const title = "Minerva";
  const description = "This is a sample description of the web page.";

  const imageUrl = `https://minerva.news/minerva.svg`;

  const processedImageUrl = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}`;
  const processedImageUrl2 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=450&height=235&overlayWidth=200&overlayHeight=200`;
  const processedImageUrl3 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=400&height=400&overlayWidth=200&overlayHeight=200`;
  const processedImageUrl4 = `https://minerva.news/api/generate-image?imageUrl=${imageUrl}&width=514&height=269&overlayWidth=200&overlayHeight=200`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://minerva.news/",
      siteName: "Minerva",
      images: [
        {
          url: processedImageUrl2,
          width: 450,
          height: 235,
        },
        {
          url: processedImageUrl,
          width: 450,
          height: 300,
        },
        {
          url: processedImageUrl3,
          width: 400,
          height: 400,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Home() {
  // const posts = await Post.getAll({ _flatten: true });

  const postsRef = collection(db, "posts");

  let _query = query(
    postsRef,
    where("status", "==", "published"),
    orderBy("timestamp", "desc"),
    limit(40)
  );

  const docs = await getDocs(_query);

  const posts = flattenQueryDataWithId(docs).map((doc) => {
    return {
      ...doc,
      timestamp: doc.timestamp.toDate().toISOString(),
      flagged_at: doc.flagged_at?.toDate().toISOString(),
      unflagged_at: doc.unflagged_at?.toDate().toISOString(),
    };
  });

  // const promises = posts.map((post) => {
  //   return new Promise((resolve) => {
  //     // @ts-ignore
  //     getBase64(post.meta.image).then((base64) => {
  //       resolve({ base64, id: post.id });
  //     });
  //   });
  // });

  // const images = await Promise.all(promises);

  const signalsRef = collection(db, "signals");
  let _signals_query = query(
    signalsRef,
    where("status", "==", "published"),
    orderBy("timestamp", "desc"),
    limit(11)
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
      <div className="">
        <Dashboard posts={posts} signals={signals} />
        <LandingPageSections />
      </div>
    </ErrorBoundary>
  );
}
