"use client";

import { ErrorMasterComponent } from "@/components/shared/ErrorComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import dynamic from "next/dynamic";
// import SignalForm from "@/components/Signals/SignalForm";
const SignalForm = dynamic(() => import("@/components/Signals/SignalForm"), {
  ssr: false,
});

export default function CreateSignal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const signalId = searchParams.signal_id;

  return (
    <ErrorBoundary errorComponent={ErrorMasterComponent}>
      <SignalForm signalId={signalId as string} />
    </ErrorBoundary>
  );
}
