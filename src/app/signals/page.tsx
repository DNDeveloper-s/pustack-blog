import SignalsPage from "@/components/Signals/SignalsPage";
import { flattenQueryDataWithId } from "@/firebase/signal";
import { db } from "@/lib/firebase";
import {
  collection,
  getDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  endAt,
} from "firebase/firestore";

export default async function SignalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const signals = await Signal.getAll({ _flatten: true });
  const signalsRef = collection(db, "signals");

  let _query = query(signalsRef, orderBy("timestamp", "desc"), limit(10));

  console.log("searchParams - ", searchParams);

  if (searchParams.id) {
    const docRef = doc(db, "signals", searchParams.id as string);
    const _doc = await getDoc(docRef);
    _query = query(signalsRef, orderBy("timestamp", "desc"), endAt(_doc));
  }

  const docs = await getDocs(_query);

  const signals = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
  }));

  return <SignalsPage signals={signals} startAt={searchParams.startAt} />;
}
