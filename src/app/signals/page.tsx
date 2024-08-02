import SignalsPage from "@/components/Signals/SignalsPage";
import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
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
  where,
} from "firebase/firestore";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default async function SignalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // const signals = await Signal.getAll({ _flatten: true });
  const signalsRef = collection(db, "signals");

  let _query = query(
    signalsRef,
    where("status", "==", "published"),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  if (searchParams.id) {
    const docRef = doc(db, "signals", searchParams.id as string);
    const _doc = await getDoc(docRef);
    _query = query(
      signalsRef,
      where("status", "==", "published"),
      orderBy("timestamp", "desc"),
      endAt(_doc)
    );
  }

  const docs = await getDocs(_query);

  const signals = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
  }));

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <SignalsPage signals={signals} startAt={searchParams.id} />
    </ErrorBoundary>
  );
}
