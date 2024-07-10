"use client";

import { useMediaQuery } from "react-responsive";
import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";
import SnippetForm from "../SnippetForm/SnippetForm";
import { useEffect, useMemo, useRef, useState } from "react";
import { Post, SnippetDesign, SnippetPosition } from "@/firebase/post-v2";
import { Button } from "@nextui-org/button";
import { useCreatePost, useGetPostById, useUpdatePost } from "@/api/post";
import { useRouter } from "next/navigation";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useUser } from "@/context/UserContext";
import { Tour, TourProps } from "antd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  codeTutorial,
  colorPicker,
  createMathsFormula,
  iconImage,
  insertImage,
  insertLink,
  insertSection,
  insertYoutubeVideo,
  textFormatting,
} from "@/assets";
import BlogImage from "../shared/BlogImage";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@nextui-org/dropdown";
import { auth } from "@/lib/firebase";
import PostSections, { PostSectionsRef } from "./PostSections";
import { DndProvider } from "react-dnd";

const classes = {
  textFormatGroup:
    ".jodit-ui-group.jodit-ui-group_separated_true.jodit-ui-group_group_font-style.jodit-ui-group_size_middle",
  insertImageIcon:
    ".jodit-toolbar-button.jodit-toolbar-button_size_middle.jodit-toolbar-button_variant_initial.jodit-toolbar-button_Insert_Image.jodit-ui-group__Insert-Image",
  insertSection:
    ".jodit-toolbar-button.jodit-toolbar-button_size_middle.jodit-toolbar-button_variant_initial.jodit-toolbar-button_Insert_Section.jodit-toolbar-button_text-icons_true.jodit-ui-group__Insert-Section",
  insertIcon:
    ".jodit-toolbar-button.jodit-toolbar-button_size_middle.jodit-toolbar-button_variant_initial.jodit-toolbar-button_Insert_Icon.jodit-toolbar-button_text-icons_true.jodit-ui-group__Insert-Icon",
  linkIcon:
    ".jodit-toolbar-button.jodit-toolbar-button_size_middle.jodit-toolbar-button_variant_initial.jodit-toolbar-button_link.jodit-ui-group__link",
  colorPickerIcon:
    ".jodit-ui-group.jodit-ui-group_separated_true.jodit-ui-group_group_color.jodit-ui-group_before-spacer_true.jodit-ui-group_size_middle > button",
  insertCode:
    ".jodit-toolbar-button.jodit-toolbar-button_size_middle.jodit-toolbar-button_variant_initial.jodit-toolbar-button_paragraph.jodit-toolbar-button_with-trigger_true.jodit-ui-group__paragraph",
  createMathsFormula: ".create-maths-formula-button",
  previewEditorButton: ".preview-editor-button",
};

export default function AdminPage({ postId }: { postId?: string }) {
  const { data: requestedPost, isLoading } = useGetPostById(postId);
  const { user } = useUser();

  const ref = useRef(null);

  const [open, setOpen] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

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
    async function checkUser() {
      await auth.authStateReady();

      if (auth.currentUser) {
        return setIsAuthInitialized(true);
      }

      return router.push("/");
    }

    checkUser();
  }, []);

  const steps: TourProps["steps"] = useMemo(
    () => [
      {
        title: "Text Formatting",
        description: (
          <>
            <div>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={textFormatting.src}
              />
              <p className="mt-2 max-w-[460px]">
                These are the text formatting options to make the selected text{" "}
                <strong>bold</strong>, <i>italic</i>,{" "}
                <span style={{ textDecoration: "underline" }}>underline</span>,
                <s>strike through</s> and using the last option, you can undo
                the formatting on the selected text.
              </p>
            </div>
          </>
        ),
        placement: "center",
        target: () =>
          document.querySelector(classes.textFormatGroup) as HTMLElement,
      },
      {
        title: "Color Picker",
        description: (
          <div>
            <BlogImage
              style={{ aspectRatio: "unset" }}
              className="w-[500px] h-auto"
              src={colorPicker.src}
            />
          </div>
        ),
        placement: "center",
        target: () =>
          document.querySelector(classes.colorPickerIcon) as HTMLElement,
      },
      {
        title: "Insert Link",
        description: (
          <div>
            <p className="max-w-[460px]">
              Create links to other pages or websites.
            </p>
          </div>
        ),
        placement: "bottom",
        target: () => {
          const el = document.querySelector(classes.linkIcon) as HTMLElement;

          // el.querySelector("button")?.click();

          return el as HTMLElement;
        },
      },
      {
        title: "Insert Section",
        description: (
          <>
            <div>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={insertSection.src}
              />
            </div>
          </>
        ),
        placement: "right",
        target: () =>
          document.querySelector(classes.insertSection) as HTMLElement,
      },
      {
        title: "Insert Icon",
        description: (
          <>
            <div>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[200px] h-auto"
                src={iconImage.src}
              />
            </div>
          </>
        ),
        placement: "right",
        target: () => document.querySelector(classes.insertIcon) as HTMLElement,
      },
      {
        title: "Insert Image",
        description: (
          <>
            <div>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={insertImage.src}
              />
            </div>
          </>
        ),
        placement: "right",
        target: () =>
          document.querySelector(classes.insertImageIcon) as HTMLElement,
      },
      {
        title: "Insert Youtube Video",
        description: (
          <>
            <div>
              <p className="mb-2 max-w-[460px]">
                Copy a youtube link and paste it in the editor to see the magic.
              </p>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={insertYoutubeVideo.src}
              />
            </div>
          </>
        ),
        target: null,
      },
      {
        title: "Insert Mathematics Formula",
        description: (
          <>
            <div>
              <p className="max-w-[460px]">
                Create a formula using the formula editor and then copy the{" "}
                <strong>MATH ML</strong> and paste it in the editor using the{" "}
                <strong>Keep</strong> option.
              </p>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={createMathsFormula.src}
              />
            </div>
          </>
        ),
        placement: "right",
        target: () =>
          document.querySelector(classes.createMathsFormula) as HTMLElement,
      },
      {
        title: "Insert Code Snippet",
        description: (
          <>
            <div>
              <p className="mb-2 max-w-[460px]">
                Try to paste it with &quot;<strong>Insert Only Text</strong>
                &quot; option.
              </p>
              <BlogImage
                style={{ aspectRatio: "unset" }}
                className="w-[500px] h-auto"
                src={codeTutorial.src}
              />
            </div>
          </>
        ),
        placement: "top",
        target: () => {
          const el = document.querySelector(classes.insertCode) as HTMLElement;

          // el.querySelector("button")?.click();

          return el as HTMLElement;
        },
      },
      {
        title: "Preview Editor",
        description: (
          <>
            <p className="max-w-[460px]">
              Clicking this button will open a preview of the content you have
              written in the editor.
            </p>
          </>
        ),
        placement: "top",
        target: () =>
          document.querySelector(classes.previewEditorButton) as HTMLElement,
      },
    ],
    []
  );

  useEffect(() => {
    if (requestedPost) {
      if (requestedPost.author.email !== user?.email)
        return router.push("/" + postId);
      setCurrentPost(requestedPost);
    }
  }, [requestedPost, user?.email]);

  const {
    mutate: postCreatePost,
    isPending: isCreatePending,
    error: createPostError,
    reset: createPostReset,
  } = useCreatePost({
    onSuccess: () => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      // @ts-ignore
      // window.location = "/";
      router.push("/");
    },
  });

  const {
    mutate: postUpdatePost,
    isPending: isUpdatePending,
    error: updatePostError,
    reset: updatePostReset,
  } = useUpdatePost({
    onSuccess: (data: any) => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");
      // @ts-ignore
      window.location = "/" + data;
    },
  });

  const error = createPostError || updatePostError;

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

  useEffect(() => {
    createPostReset();
    updatePostReset();
  }, [step]);

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

  const showTutorial = (step: number) => () => {
    setCurrentTourStep(step);
    setOpen(true);
  };

  const [haveTakenGuideTour, setHaveTakenGuideTour] = useState(false);

  useEffect(() => {
    setHaveTakenGuideTour(!!window.localStorage.getItem("haveTakenGuideTour"));
  }, []);

  useEffect(() => {
    if (haveTakenGuideTour) {
      window.localStorage.setItem("haveTakenGuideTour", "true");
    }
  }, [haveTakenGuideTour]);

  return (
    isAuthInitialized && (
      <main className="max-w-[1440px] h-screen overflow-auto px-3 mx-auto">
        <Navbar />
        <div className="flex items-center justify-between mt-8 max-w-[1100px] mx-auto">
          <h2 className="text-appBlack text-[30px] font-larkenExtraBold">
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
          {step === 1 && !haveTakenGuideTour && (
            <p
              className="text-appBlue underline cursor-pointer"
              onClick={() => {
                setCurrentTourStep(0);
                setOpen(true);
              }}
            >
              Take Quick Tour?
            </p>
          )}
          {step === 1 && haveTakenGuideTour && (
            <Dropdown
              classNames={{
                content: "!bg-primary !rounded-[4px] !min-w-[100px]",
              }}
            >
              <DropdownTrigger>
                <p className="text-appBlue underline cursor-pointer">
                  Need help?
                </p>
              </DropdownTrigger>
              <DropdownMenu
                classNames={{
                  list: "p-0 m-0",
                }}
              >
                <DropdownItem onClick={showTutorial(8)}>
                  Insert Code Snippet
                </DropdownItem>
                <DropdownItem onClick={showTutorial(5)}>
                  Insert Image
                </DropdownItem>
                <DropdownItem onClick={showTutorial(6)}>
                  Insert Youtube Video
                </DropdownItem>
                <DropdownItem onClick={showTutorial(2)}>
                  Insert Link
                </DropdownItem>
                <DropdownItem onClick={showTutorial(3)}>
                  Insert Section
                </DropdownItem>
                <DropdownItem onClick={showTutorial(1)}>
                  Color Formatting
                </DropdownItem>
                <DropdownItem onClick={showTutorial(7)}>
                  Insert Maths Formula
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <div
          className="w-full max-w-[1100px] mx-auto"
          style={{ display: step === 1 ? "block" : "none" }}
        >
          {error && (
            <p className="text-danger-500 text-sm my-2">{error.message}</p>
          )}
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
          {error && (
            <p className="text-danger-500 text-sm my-2">{error.message}</p>
          )}
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
        <Tour
          current={currentTourStep}
          onChange={setCurrentTourStep}
          onFinish={() => {
            setOpen(false);
            setCurrentTourStep(0);
            setHaveTakenGuideTour(true);
          }}
          open={open}
          onClose={() => {
            setOpen(false);
            setHaveTakenGuideTour(true);
          }}
          steps={steps}
        />
      </main>
    )
  );
}
