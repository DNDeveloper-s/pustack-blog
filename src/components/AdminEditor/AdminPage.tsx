"use client";

import { useMediaQuery } from "react-responsive";
import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";
import SnippetForm from "../SnippetForm/SnippetForm";
import { useRef, useState } from "react";
import { Post, SnippetDesign, SnippetPosition } from "@/firebase/post";
import { Button } from "@nextui-org/button";
import { useCreatePost } from "@/api/post";
import { useRouter } from "next/navigation";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";

export default function AdminPage() {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const [step, setStep] = useState(1);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const joditRef = useRef<any>(null);
  const router = useRouter();
  const snippetRef = useRef<{
    selectedPosition: SnippetPosition;
    selectedSnippet: SnippetDesign;
  }>(null);
  const checkBoxRef = useRef<{ isChecked: boolean }>(null);

  const {
    mutate: postCreatePost,
    isPending,
    error,
  } = useCreatePost({
    onSuccess: () => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      router.push("/");
    },
  });

  console.log("error - ", error);

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

    const selectedPosition = snippetRef.current?.selectedPosition;
    const selectedSnippet = snippetRef.current?.selectedSnippet;

    if (!selectedPosition || !selectedSnippet) return;

    currentPost.snippetPosition = selectedPosition;
    currentPost.snippetDesign = selectedSnippet;

    if (checkBoxRef.current?.isChecked) {
      currentPost.markAsFlagship();
    } else {
      currentPost.unMarkAsFlagship();
    }

    postCreatePost(currentPost);
  };

  const handleFalshipChange = () => {};

  return (
    <main className="max-w-[1440px] h-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="flex items-center justify-between max-w-[1100px] mx-auto">
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          {step === 1 ? "Create Post" : "Choose Design and Position"}
        </h2>
        <label
          htmlFor={"today-flagship"}
          className="flex gap-2 py-1 cursor-pointer group"
        >
          <div>
            <Checkbox id={"today-flagship"} ref={checkBoxRef} />
          </div>
          <div>
            <p className="text-[16px] text-[#1f1d1a]">
              Mark it as Today&apos;s Flagship
            </p>
          </div>
        </label>
      </div>
      <div style={{ display: step === 1 ? "block" : "none" }}>
        <MathJaxContext>
          <JoditWrapper ref={joditRef} handleContinue={handleContinue} />
        </MathJaxContext>
      </div>
      <div
        className="w-full max-w-[1100px] mx-auto py-2 mt-4"
        style={{ display: step === 2 ? "block" : "none" }}
      >
        <hr className=" border-dashed border-[#1f1d1a4d] mt-6 mb-4" />
        <SnippetForm ref={snippetRef} post={currentPost} />
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
