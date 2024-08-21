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

  return <Signals ref={signalRef} signals={signals} startAt={startAt} />;
}
