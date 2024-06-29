import SignalForm from "@/components/Signals/SignalForm";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { redirect } from "next/navigation";

export default async function CreateSignal() {
  const user = await getAuthenticatedAppForUser();

  if (!user.currentUser?.uid) return redirect("/");
  // console.log("user.currentUser?.uid - ", user.currentUser?.uid);

  return <SignalForm />;
}
