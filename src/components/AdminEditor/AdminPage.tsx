"use client";

import { useMediaQuery } from "react-responsive";
import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";
import SnippetForm from "../SnippetForm/SnippetForm";
import { useEffect, useRef, useState } from "react";
import { Post, SnippetDesign, SnippetPosition } from "@/firebase/post";
import { Button } from "@nextui-org/button";
import { useCreatePost, useGetPostById, useUpdatePost } from "@/api/post";
import { useRouter } from "next/navigation";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";

export default function AdminPage({ postId }: { postId?: string }) {
  const { data: requestedPost, isLoading } = useGetPostById(postId);

  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const [step, setStep] = useState(1);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const joditRef = useRef<any>(null);
  const router = useRouter();
  const snippetRef = useRef<{
    selectedPosition: SnippetPosition;
    selectedSnippet: SnippetDesign;
    title: () => string;
    content: () => string;
  }>(null);

  useEffect(() => {
    if (requestedPost) {
      setCurrentPost(requestedPost);
    }
  }, [requestedPost]);

  const { mutate: postCreatePost, isPending: isCreatePending } = useCreatePost({
    onSuccess: () => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      // @ts-ignore
      window.location = "/";
    },
  });

  const { mutate: postUpdatePost, isPending: isUpdatePending } = useUpdatePost({
    onSuccess: (data: any) => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      // @ts-ignore
      window.location = "/" + data;
    },
  });

  const isPending = isCreatePending || isUpdatePending;

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

  const handleSavePost = () => {
    if (!currentPost) return;

    const selectedPosition = snippetRef.current?.selectedPosition;
    const selectedSnippet = snippetRef.current?.selectedSnippet;

    if (!selectedPosition || !selectedSnippet) return;

    currentPost.snippetPosition = selectedPosition;
    currentPost.snippetDesign = selectedSnippet;

    currentPost.displayTitle = snippetRef.current?.title();
    currentPost.displayContent = snippetRef.current?.content();

    console.log("snippetRef.current?.title - ", snippetRef.current?.title);

    requestedPost ? postUpdatePost(currentPost) : postCreatePost(currentPost);
  };

  return (
    <main className="max-w-[1440px] h-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="flex items-center justify-between max-w-[1100px] mx-auto">
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          {step === 1
            ? requestedPost
              ? "Edit Post"
              : "Create Post"
            : "Choose Design and Position"}
        </h2>
        {/* <label
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
        </label> */}
      </div>
      <div style={{ display: step === 1 ? "block" : "none" }}>
        <MathJaxContext>
          <JoditWrapper
            prePost={requestedPost}
            ref={joditRef}
            handleContinue={handleContinue}
          />
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
            onClick={handleSavePost}
            variant="flat"
            color="primary"
            isLoading={isPending}
          >
            {requestedPost ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
      {/* <DraftEditor /> */}
      {/* <button onClick={() => copyIt()}>Copy it</button> */}
    </main>
  );
}
