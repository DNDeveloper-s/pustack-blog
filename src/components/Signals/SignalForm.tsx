"use client";

import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useRef } from "react";
import SignalJodit from "./SignalJodit";

export default function SignalForm() {
  const joditRef = useRef<any>(null);

  return (
    <main className="max-w-[1440px] h-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="flex items-center justify-between max-w-[1100px] mx-auto">
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          Create Signal
        </h2>
      </div>
      <div>
        <MathJaxContext>
          <SignalJodit ref={joditRef} />
        </MathJaxContext>
      </div>
      {/* <DraftEditor /> */}
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
