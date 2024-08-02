"use client";

import { Signal } from "@/firebase/signal";
import { useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Signals from "./MySignals";

export default function MySignalsPage() {
  const signalRef = useRef(null);

  return (
    <main className="min-h-screen flex flex-col w-full max-w-[1440px] px-3 mx-auto">
      <Navbar scrollRef={signalRef} />
      <div className="flex-1">
        <Signals ref={signalRef} />
      </div>
    </main>
  );
}
