"use client";

import dynamic from "next/dynamic";
// import SignalForm from "@/components/Signals/SignalForm";
const SignalForm = dynamic(() => import("@/components/Signals/SignalForm"), {
  ssr: false,
});

export default function CreateSignal() {
  // const user = await getAuthenticatedAppForUser();

  // if (!user.currentUser?.uid) return redirect("/");
  // console.log("user.currentUser?.uid - ", user.currentUser?.uid);

  return <SignalForm />;
}
