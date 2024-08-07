"use client";

import { Signal } from "@/firebase/signal";
import { useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Signals from "./Signals";

export default function SignalsPage({
  signals,
  startAt,
}: {
  signals: any;
  startAt: string | string[] | undefined;
}) {
  const signalRef = useRef(null);

  return (
    <main className="min-h-screen flex flex-col w-full max-w-[1440px] px-3 mx-auto">
      <Navbar scrollRef={signalRef} />
      <Signals ref={signalRef} signals={signals} startAt={startAt} />
    </main>
  );
}
