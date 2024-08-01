"use client";

import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useEffect, useRef, useState } from "react";
import SignalJodit from "./SignalJodit";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignalForm() {
  const joditRef = useRef<any>(null);
  const router = useRouter();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    async function checkUser() {
      await auth.authStateReady();

      if (auth.currentUser) return setIsAuthInitialized(true);

      return router.push("/");
    }

    checkUser();
  }, []);

  return (
    isAuthInitialized && (
      <main className="max-w-[1440px] h-screen overflow-auto px-3 mx-auto">
        <Navbar />
        <div className="flex items-center justify-between max-w-[1100px] mx-auto">
          <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
            Create Signal
          </h2>
          <div>
            
          </div>
        </div>
        <div>
          <MathJaxContext>
            <SignalJodit ref={joditRef} />
          </MathJaxContext>
        </div>
        {/* <DraftEditor /> */}
        {/* <button onClick={() => copyIt()}>Copy it</button> */}
      </main>
    )
  );
}
