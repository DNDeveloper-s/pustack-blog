"use client";

import { useMediaQuery } from "react-responsive";
import Navbar, { NavbarMobile } from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";
import SnippetForm from "../SnippetForm/SnippetForm";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/firebase/post";
import { Button } from "@nextui-org/button";
import { useCreatePost } from "@/api/post";
import { useRouter } from "next/navigation";
import WorldClock2 from "../shared/WorldClock2";

export default function AdminPage() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const [step, setStep] = useState(1);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const joditRef = useRef<any>(null);
  const router = useRouter();

  const { mutate: postCreatePost, isPending } = useCreatePost({
    onSuccess: () => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      router.push("/");
    },
  });

  const handleContinue = (post: Post) => {
    setStep(2);
    setCurrentPost(post);
  };

  // useEffect(() => {
  //   // Ask the user before leaving
  //   window.onbeforeunload = function () {
  //     return "Are you sure you want to leave? Your changes will be lost.";
  //   };
  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);

  const handleCreatePost = () => {
    if (!currentPost) return;
    postCreatePost(currentPost);
  };

  return (
    <main className="h-screen overflow-auto">
      {isTabletScreen ? <NavbarMobile /> : <Navbar />}
      <div style={{ display: step === 1 ? "block" : "none" }}>
        <MathJaxContext>
          <JoditWrapper ref={joditRef} handleContinue={handleContinue} />
        </MathJaxContext>
      </div>
      <div
        className="w-full max-w-[1100px] mx-auto py-2 px-3 mt-4"
        style={{ display: step === 2 ? "block" : "none" }}
      >
        <div>
          <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
            Choose Design and Position
          </h2>
        </div>
        <hr className=" border-dashed border-[#1f1d1a4d] mt-6 mb-4" />
        <SnippetForm post={currentPost} />
        <div className="flex gap-4 justify-end items-center">
          <Button
            // isDisabled={isPending}
            className="h-9 px-5 rounded text-xs uppercase font-featureRegular"
            // onClick={handleCreatePost}
            variant="flat"
            color="default"
            // isLoading={isPending}
            onClick={() => {
              setStep(1);
            }}
          >
            Back
          </Button>
          <Button
            isDisabled={isPending}
            className="h-9 px-5 rounded bg-appBlue text-primary text-xs uppercase font-featureRegular"
            onClick={handleCreatePost}
            variant="flat"
            color="primary"
            isLoading={isPending}
          >
            Create Post
          </Button>
        </div>
      </div>
      {/* <DraftEditor /> */}
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
