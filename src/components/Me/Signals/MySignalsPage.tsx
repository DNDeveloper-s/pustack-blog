"use client";

import { Signal } from "@/firebase/signal";
import { useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Signals from "./MySignals";

export default function MySignalsPage() {
  const signalRef = useRef(null);

  return (
    <div className="flex-1">
      <Signals ref={signalRef} />
    </div>
  );
}
