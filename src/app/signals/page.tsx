import Navbar from "@/components/Navbar/Navbar";
import Signals from "@/components/Signals/Signals";
import { Signal, flattenQueryDataWithId } from "@/firebase/signal";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

export default async function SignalPage() {
  // const signals = await Signal.getAll({ _flatten: true });
  const signalsRef = collection(db, "signals");
  let _query = query(signalsRef, orderBy("timestamp", "desc"), limit(4));

  const docs = await getDocs(_query);

  const signals = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
  }));

  return (
    <main className="min-h-screen w-full max-w-[1440px] mx-auto px-3">
      <Navbar />
      <Signals signals={signals} />
    </main>
  );
}
