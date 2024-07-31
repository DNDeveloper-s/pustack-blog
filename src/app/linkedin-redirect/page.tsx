"use client";

import { Suspense, useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { auth, linkedinProvider } from "@/lib/firebase"; // Ensure this points to your Firebase client initialization file
import { signInWithCredential } from "firebase/auth";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";

const LinkedInRedirectContent = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const query = useSearchParams();

  useEffect(() => {
    const accessToken = query.get("access_token");
    const idToken = query.get("id_token");

    if (accessToken || idToken) {
      window.opener.postMessage(
        { accessToken, idToken },
        window.location.origin
      );
      window.close();
    }
  }, [query]);

  // useEffect(() => {
  //   const handleSignIn = async () => {
    //   try {
    //     const accessToken = query.get("access_token");
    //     const idToken = query.get("id_token");

    //     if (accessToken && idToken) {
    //       const credential = linkedinProvider.credential({
    //         accessToken,
    //         idToken,
    //       });

    //       await signInWithCredential(auth, credential);
    //       router.push("/");
    //     } else {
    //       throw new Error("Custom token not found");
    //     }
    //   } catch (error: any) {
    //     console.error("Error signing in with LinkedIn:", error);
    //     setError(error.message);
    //   }
    // };

  //   handleSignIn();
  // }, [query, router]);

  if (error) {
    return redirect("/");
    // return (
    //   <div>
    //     <h1>There was an error signing you in.</h1>
    //     <p>{error}</p>
    //   </div>
    // );
  }

  return (
    <div>
      <h1>Signing you in...</h1>
    </div>
  );
};

const LinkedInRedirect = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="h-screen w-screen flex flex-col px-3">
        <Navbar />
        <div className="max-w-[1440px] flex-1 mx-auto w-full flex flex-col">
          <section className="flex-1 flex items-center justify-center">
            <LinkedInRedirectContent />
          </section>
          <Footer />
        </div>
      </main>
    </Suspense>
  );
};

export default LinkedInRedirect;
