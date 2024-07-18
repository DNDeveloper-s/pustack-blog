"use client";

import { useMediaQuery } from "react-responsive";
import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import JoditWrapper from "./JoditWrapper";
import SnippetForm from "../SnippetForm/SnippetForm";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Post, SnippetDesign, SnippetPosition } from "@/firebase/post-v2";
import { Button } from "@nextui-org/button";
import {
  useCreateDraftPost,
  useCreatePost,
  useGetDraftPostById,
  useGetPostById,
  useUpdatePost,
  useUpdatePostDraft,
} from "@/api/post";
import { useRouter } from "next/navigation";
import { Checkbox } from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useUser } from "@/context/UserContext";
import { Tour, TourProps, notification } from "antd";
import {
  codeTutorial,
  colorPicker,
  createMathsFormula,
  iconImage,
  insertImage,
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
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";
import { NotificationPlacements } from "antd/es/notification/interface";
import { FaCaretDown } from "react-icons/fa";
import { MdDrafts, MdScheduleSend } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import PostScheduleModal from "./PostScheduleModal";
import { useDisclosure } from "@nextui-org/modal";
import { Dayjs } from "dayjs";
import useScreenSize from "@/hooks/useScreenSize";
import SlateEditor from "../SlateEditor/SlateEditor";

const getButtonLabel = (requestedPost?: Post) => {
  if (requestedPost?.status === "draft") return "Create Post";

  return requestedPost ? "Update Post" : "Create Post";
};

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

export function SnackbarContent({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <p>{label}</p>
    </div>
  );
}

export default function AdminPage({ postId }: { postId?: string }) {
  const { data: requestedPost, isLoading: isActualLoading } =
    useGetPostById(postId);

  const { user } = useUser();

  const ref = useRef(null);

  const [open, setOpen] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  const [step, setStep] = useState(1);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const disclosureOptions = useDisclosure();
  const joditRef = useRef<any>(null);
  const router = useRouter();
  const snippetRef = useRef<{
    selectedPosition: SnippetPosition;
    selectedSnippet: SnippetDesign;
    title: () => string;
    content: () => string;
  }>(null);

  const { openNotification, destroy } = useNotification();

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

  console.log("requestedPost - ", requestedPost, currentPost);

  const {
    mutate: postCreatePost,
    isPending: isCreatePending,
    error: createPostError,
    reset: createPostReset,
  } = useCreatePost({
    onSuccess: (data: Post) => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");

      if (data.status === "draft") {
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Your draft has been saved."} />,
            closable: true,
            showProgress: true,
            closeIcon: (
              <Link
                href="/admin/drafts?status=draft"
                className="underline text-appBlue cursor-pointer whitespace-nowrap"
              >
                View Drafts
              </Link>
            ),
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
      } else {
        openNotification(
          NotificationPlacements[5],
          {
            message: (
              <SnackbarContent
                label={
                  "Your post has been " +
                  (data.status === "scheduled" ? "scheduled" : "created") +
                  "."
                }
              />
            ),
            closable: false,
            showProgress: true,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
        router.push("/");
      }

      // @ts-ignore
      // window.location = "/";
    },
  });

  const {
    mutate: postUpdatePost,
    isPending: isUpdatePending,
    error: updatePostError,
    reset: updatePostReset,
  } = useUpdatePost({
    onSuccess: (data: Post) => {
      joditRef.current.reset();
      window.localStorage.removeItem("editor_state");

      if (data.status === "draft") {
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Your draft has been saved."} />,
            closable: true,
            showProgress: true,
            closeIcon: (
              <Link
                href="/admin/drafts?status=draft"
                className="underline text-appBlue cursor-pointer whitespace-nowrap"
              >
                View Drafts
              </Link>
            ),
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
      } else {
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Your post has been updated."} />,
            closable: false,
            showProgress: true,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
        router.push("/" + data.id);
      }

      // @ts-ignore
      // window.location = "/" + data;
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

  const handleSavePost = (isDraft: boolean = false) => {
    if (!currentPost) return;

    const selectedPosition = snippetRef.current?.selectedPosition;
    const selectedSnippet = snippetRef.current?.selectedSnippet;

    if (!selectedPosition || !selectedSnippet) return;

    currentPost.snippetPosition = selectedPosition;
    currentPost.snippetDesign = selectedSnippet;

    currentPost.displayTitle = snippetRef.current?.title();
    currentPost.displayContent = snippetRef.current?.content();

    currentPost.livePost();

    requestedPost
      ? postUpdatePost(currentPost)
      : postCreatePost({
          post: currentPost,
        });
  };

  const handleSchedulePost = (scheduledTime: Dayjs) => {
    if (!currentPost) return;

    const selectedPosition = snippetRef.current?.selectedPosition;
    const selectedSnippet = snippetRef.current?.selectedSnippet;

    if (!selectedPosition || !selectedSnippet) return;

    currentPost.snippetPosition = selectedPosition;
    currentPost.snippetDesign = selectedSnippet;

    currentPost.displayTitle = snippetRef.current?.title();
    currentPost.displayContent = snippetRef.current?.content();

    currentPost.schedulePost(scheduledTime.toISOString());

    setCurrentPost(currentPost);

    requestedPost
      ? postUpdatePost(currentPost)
      : postCreatePost({
          post: currentPost,
        });
  };

  const handleSaveDraft = (_post?: Post) => {
    let post = _post;

    if (!post && currentPost) {
      const selectedPosition = snippetRef.current?.selectedPosition;
      const selectedSnippet = snippetRef.current?.selectedSnippet;

      if (selectedPosition) currentPost.snippetPosition = selectedPosition;
      if (selectedSnippet) currentPost.snippetDesign = selectedSnippet;

      currentPost.displayTitle = snippetRef.current?.title();
      currentPost.displayContent = snippetRef.current?.content();

      post = currentPost;
    }

    if (!post) {
      console.error("No post to save");
      return;
    }

    post.draftPost();

    setCurrentPost(post);

    requestedPost
      ? postUpdatePost(post)
      : postCreatePost({
          post,
        });
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
        <div
          className={
            isTabletScreen
              ? "h-[calc(100vh-220px)]"
              : isMobileScreen
              ? ""
              : "h-[calc(100vh-150px)]" + " overflow-auto"
          }
        >
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
            <JoditWrapper
              prePost={requestedPost}
              ref={joditRef}
              handleContinue={handleContinue}
              handleSaveDraft={handleSaveDraft}
              isDraftSaving={
                isPending &&
                (requestedPost?.status === "draft" ||
                  currentPost?.status === "draft")
              }
              isDraft={requestedPost?.status === "draft"}
            />
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
                isDisabled={isPending}
                className="h-9 px-5 rounded text-xs uppercase font-featureRegular"
                // onClick={handleCreatePost}
                variant="flat"
                color="default"
                // isLoading={isPending}
                onClick={() => {
                  if (isPending) return;
                  setStep(1);
                }}
              >
                Back
              </Button>
              <Dropdown
                // disabled={isPending}
                disabled={requestedPost?.status === "published" || isPending}
                classNames={{
                  content: "!bg-appBlue !rounded-[4px] p-0 !min-w-[150px]",
                  base: "!p-[0_4px]",
                  arrow: "!bg-appBlue",
                }}
                style={{
                  // @ts-ignore
                  "--nextui-content1": "230 67% 43%",
                  backgroundColor: "#243bb5",
                  borderRadius: "4px",
                }}
                placement="bottom-end"
                showArrow={true}
                isDisabled={requestedPost?.status === "published" || isPending}
              >
                <div className="flex items-start">
                  <Button
                    isDisabled={isPending}
                    className="h-9 px-3 rounded-tl rounded-bl flex items-center justify-center gap-2 rounded-tr-none rounded-br-none bg-appBlue font-featureBold text-primary border-2 border-appBlue text-xs uppercase"
                    onClick={() => handleSavePost()}
                    variant="flat"
                    color="primary"
                    isLoading={isPending}
                  >
                    <IoIosCreate />
                    <span>
                      {isPending ? "Saving..." : getButtonLabel(requestedPost)}
                    </span>
                  </Button>
                  <DropdownTrigger
                    className={
                      "!scale-100 " +
                      (requestedPost?.status === "published"
                        ? " !opacity-20"
                        : " !opacity-100")
                    }
                  >
                    <div className="h-9 w-6 border-l border-primary  cursor-pointer flex rounded-tr rounded-br items-center justify-center bg-appBlue text-primary">
                      <FaCaretDown />
                    </div>
                  </DropdownTrigger>
                </div>
                <DropdownMenu
                  classNames={{
                    list: "p-0 m-0 divide-y divide-dashed divide-[#f9f9f95e] !gap-0",
                    base: "!p-[0_5px]",
                  }}
                >
                  <DropdownItem
                    onClick={() => {
                      disclosureOptions.onOpen();
                    }}
                    className="!p-[12px_9px_9px] !pl-1 !rounded-none !bg-transparent"
                  >
                    <p
                      className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 bg-appBlue text-primary text-xs uppercase"
                      style={{
                        fontWeight: 600,
                        fontVariationSettings: '"wght" 700,"opsz" 10',
                      }}
                    >
                      <MdScheduleSend />
                      <span>
                        {currentPost?.status === "scheduled"
                          ? "UPDATE SCHEDULE"
                          : "SCHEDULE POST"}
                      </span>
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handleSaveDraft();
                    }}
                    className="!p-[10px_9px_12px] !pl-1 !rounded-none !bg-transparent"
                  >
                    <p
                      className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 bg-appBlue text-primary text-xs uppercase"
                      style={{
                        fontWeight: 600,
                        fontVariationSettings: '"wght" 700,"opsz" 10',
                      }}
                    >
                      <MdDrafts />
                      <span>SAVE AS DRAFT</span>
                    </p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {currentPost && (
                <PostScheduleModal
                  disclosureOptions={disclosureOptions}
                  handleSchedulePost={handleSchedulePost}
                  isPending={isPending}
                  post={currentPost ?? requestedPost}
                  handlePostNow={() => {
                    handleSavePost();
                  }}
                />
              )}
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
        </div>
      </main>
    )
  );
}
