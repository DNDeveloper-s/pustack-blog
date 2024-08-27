"use client";

import Navbar from "../Navbar/Navbar";
import JoditWrapper from "./JoditWrapper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Post, SnippetDesign, SnippetPosition } from "@/firebase/post-v2";
import { Button } from "@nextui-org/button";
import { useCreatePost, useGetPostById, useUpdatePost } from "@/api/post";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
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
import { useConfirmPageLeave } from "@/hooks/usePreventRouteChange";
import LeavePageModal from "../shared/LeavePageModal";

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

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const isDraftSavingRef = useRef<boolean>(false);

  const [step, setStep] = useState(1);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const disclosureOptions = useDisclosure();
  const joditRef = useRef<any>(null);
  const router = useRouter();
  const leavePageModalRef = useRef<any>(null);
  const snippetRef = useRef<{
    selectedPosition: SnippetPosition;
    selectedSnippet: SnippetDesign;
    title: () => string;
    content: () => string;
  }>(null);
  const [shouldConfirm, setShouldConfirm] = useState(false);
  const newlySavedDraftRef = useRef<Post | null>(null);
  const intervalSaveDraftRef = useRef<boolean>(false);

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

  useEffect(() => {
    if (requestedPost) {
      if (requestedPost.author.uid !== user?.uid)
        return router.push("/" + postId);
      setCurrentPost(requestedPost);
    }
  }, [requestedPost, user?.uid, postId]);

  useEffect(() => {
    if (!user) return;
    if (user.is_author) return;
    router.push("/");
  }, [user]);

  const {
    mutate: postCreatePost,
    isPending: isCreatePending,
    error: createPostError,
    reset: createPostReset,
  } = useCreatePost({
    onSuccess: (data: Post) => {
      window.localStorage.removeItem("editor_state");
      isDraftSavingRef.current = false;

      if (data.status === "draft") {
        newlySavedDraftRef.current = data;

        if (intervalSaveDraftRef.current) {
          intervalSaveDraftRef.current = false;
          return;
        }

        joditRef.current.reset();
        if (leavePageModalRef.current?.isOpen?.()) {
          return leavePageModalRef.current?.close?.();
        }
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Your draft has been saved."} />,
            closable: true,
            showProgress: true,
            closeIcon: (
              <Link
                href="/me/posts?status=draft"
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
        joditRef.current.reset();
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

        // @ts-ignore
        window.location = "/";
      }

      // @ts-ignore
      // window.location = "/";
    },
    onError: (error) => {
      console.log("error - ", error);
      isDraftSavingRef.current = false;
      openNotification(
        NotificationPlacements[5],
        {
          message: (
            <SnackbarContent label={"Something went wrong, Try again!"} />
          ),
          closable: true,
          duration: 5,
          // showProgress: true,
          // closeIcon: (
          //   <Link
          //     href="/me/posts?status=draft"
          //     className="underline text-appBlue cursor-pointer whitespace-nowrap"
          //   >
          //     View Drafts
          //   </Link>
          // ),
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
      if (leavePageModalRef.current?.isOpen?.()) {
        return leavePageModalRef.current?.closeWithoutProceeding?.();
      }
    },
  });

  const {
    mutate: postUpdatePost,
    isPending: isUpdatePending,
    error: updatePostError,
    reset: updatePostReset,
  } = useUpdatePost({
    onSuccess: (data: Post) => {
      window.localStorage.removeItem("editor_state");
      isDraftSavingRef.current = false;

      if (data.status === "draft") {
        newlySavedDraftRef.current = data;

        if (intervalSaveDraftRef.current) {
          intervalSaveDraftRef.current = false;
          return;
        }

        joditRef.current.reset();
        if (leavePageModalRef.current?.isOpen?.()) {
          return leavePageModalRef.current?.close?.();
        }
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Your draft has been saved."} />,
            closable: true,
            showProgress: true,
            closeIcon: (
              <Link
                href="/me/posts?status=draft"
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

        // @ts-ignore
        window.location = "/" + data.id;
      }

      // @ts-ignore
      // window.location = "/" + data;
    },
    onError: (error) => {
      isDraftSavingRef.current = false;
      openNotification(
        NotificationPlacements[5],
        {
          message: (
            <SnackbarContent label={"Something went wrong, Try again!"} />
          ),
          closable: true,
          duration: 5,
          // showProgress: true,
          // closeIcon: (
          //   <Link
          //     href="/me/posts?status=draft"
          //     className="underline text-appBlue cursor-pointer whitespace-nowrap"
          //   >
          //     View Drafts
          //   </Link>
          // ),
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
      if (leavePageModalRef.current?.isOpen?.()) {
        return leavePageModalRef.current?.closeWithoutProceeding?.();
      }
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

  const handleSavePost = async (isDraft: boolean = false) => {
    const currentPost = await handleContinuePost();
    if (!currentPost) return;

    // const selectedPosition = snippetRef.current?.selectedPosition;
    // const selectedSnippet = snippetRef.current?.selectedSnippet;

    // if (!selectedPosition || !selectedSnippet) return;

    // currentPost.snippetPosition = selectedPosition;
    // currentPost.snippetDesign = selectedSnippet;

    currentPost.displayTitle = snippetRef.current?.title();
    currentPost.displayContent = snippetRef.current?.content();

    currentPost.livePost();

    isDraftSavingRef.current = false;

    requestedPost
      ? postUpdatePost(currentPost)
      : postCreatePost({
          post: currentPost,
        });
  };

  const handleSchedulePost = async (scheduledTime: Dayjs) => {
    const currentPost = await handleContinuePost();
    if (!currentPost) return;

    // const selectedPosition = snippetRef.current?.selectedPosition;
    // const selectedSnippet = snippetRef.current?.selectedSnippet;

    // if (!selectedPosition || !selectedSnippet) return;

    // currentPost.snippetPosition = selectedPosition;
    // currentPost.snippetDesign = selectedSnippet;

    currentPost.displayTitle = snippetRef.current?.title();
    currentPost.displayContent = snippetRef.current?.content();

    currentPost.schedulePost(scheduledTime.toISOString());

    setCurrentPost(currentPost);

    isDraftSavingRef.current = false;

    requestedPost
      ? postUpdatePost(currentPost)
      : postCreatePost({
          post: currentPost,
        });
  };

  const handleSaveDraft = useCallback(
    (_post?: Post) => {
      let post = _post;

      if (!post && currentPost) {
        // const selectedPosition = snippetRef.current?.selectedPosition;
        // const selectedSnippet = snippetRef.current?.selectedSnippet;

        // if (selectedPosition) currentPost.snippetPosition = selectedPosition;
        // if (selectedSnippet) currentPost.snippetDesign = selectedSnippet;

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

      isDraftSavingRef.current = true;

      requestedPost
        ? postUpdatePost(post)
        : postCreatePost({
            post,
          });
    },
    [currentPost, requestedPost, postUpdatePost, postCreatePost]
  );

  const [haveTakenGuideTour, setHaveTakenGuideTour] = useState(false);

  useEffect(() => {
    setHaveTakenGuideTour(!!window.localStorage.getItem("haveTakenGuideTour"));
  }, []);

  useEffect(() => {
    if (haveTakenGuideTour) {
      window.localStorage.setItem("haveTakenGuideTour", "true");
    }
  }, [haveTakenGuideTour]);

  const isDraftSaving = isPending && isDraftSavingRef.current;

  async function handleContinuePost() {
    if (!user) return;
    setShouldConfirm(false);

    // const sections = postSectionsRef.current?.getSections();
    // sections?.forEach((section) => {
    //   section.updateContent(section.trimContent(section.content));
    // });

    const inputValue = joditRef.current?.getTitleValue() ?? "";
    const topic = joditRef.current?.getTopicValue() ?? "";

    const _isValid = joditRef.current?.isValid(inputValue, topic);

    if (!_isValid.isValid) {
      openNotification(
        "bottomRight",
        {
          message: _isValid.message,
          closable: true,
          duration: 2,
          closeIcon: (
            <p className="underline text-danger cursor-pointer whitespace-nowrap">
              Close
            </p>
          ),
          className: "drafts-notification",
        },
        "error"
      );
      return;
    }

    let post = new Post(
      inputValue || "Untitled",
      {
        name: user?.name,
        email: user?.email,
        photoURL: user?.image_url,
        uid: user?.uid,
      },
      topic,
      undefined,
      undefined,
      newlySavedDraftRef.current?.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      joditRef.current?.getSlateValue()
    );

    if (requestedPost) {
      post = new Post(
        inputValue || "Untitled",
        {
          name: user?.name,
          email: user?.email,
          photoURL: user?.image_url,
          uid: user?.uid,
        },
        topic,
        [],
        requestedPost.status ?? "published",
        requestedPost.id,
        requestedPost.timestamp,
        requestedPost.snippetPosition,
        requestedPost.snippetDesign,
        requestedPost.displayTitle,
        requestedPost.displayContent,
        requestedPost.scheduledTime,
        true,
        joditRef.current?.getSlateValue()
      );
    }

    // postCreatePost(post);
    return post;
  }

  const handleSaveAsDraft = useCallback(
    async (silent: boolean = false, id?: string) => {
      if (!user) return router.push("/");

      const isDraft = requestedPost?.status === "draft";

      if (!isDraft && requestedPost) {
        leavePageModalRef.current?.closeWithoutProceeding();
        return;
      }

      const inputValue = joditRef.current?.getTitleValue() ?? "";
      const topic = joditRef.current?.getTopicValue() ?? "";

      const _isValid = joditRef.current?.isValid(inputValue, topic, silent);

      if (!_isValid.isValid) {
        leavePageModalRef.current?.closeWithoutProceeding();
        if (!silent) {
          openNotification(
            "bottomRight",
            {
              message: _isValid.message,
              closable: true,
              duration: 2,
              showProgress: true,
              closeIcon: (
                <p className="underline text-danger cursor-pointer whitespace-nowrap">
                  Close
                </p>
              ),
              className: "drafts-notification",
            },
            "error"
          );
        }
        return;
      }

      let post = new Post(
        inputValue || "Untitled",
        {
          name: user?.name,
          email: user?.email,
          uid: user?.uid,
          photoURL: user?.image_url,
        },
        topic,
        [],
        "draft",
        id,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        joditRef.current?.getSlateValue()
      );

      if (isDraft && requestedPost) {
        post = new Post(
          inputValue || "Untitled",
          {
            name: user?.name,
            email: user?.email,
            uid: user?.uid,
            photoURL: user?.image_url,
          },
          topic,
          [],
          requestedPost?.status ?? "published",
          requestedPost?.id,
          requestedPost?.timestamp,
          requestedPost?.snippetPosition,
          requestedPost?.snippetDesign,
          requestedPost?.displayTitle,
          requestedPost?.displayContent,
          undefined,
          true,
          joditRef.current?.getSlateValue()
        );
      }

      handleSaveDraft(post);
    },
    [requestedPost, user, openNotification, handleSaveDraft]
  );

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (requestedPost && requestedPost?.status !== "draft") return;
    intervalIdRef.current = setInterval(() => {
      intervalSaveDraftRef.current = true;
      handleSaveAsDraft(true, newlySavedDraftRef.current?.id);
    }, 1000 * 60 * 5);

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [handleSaveAsDraft, requestedPost]);

  const handleChangeEditor = () => {
    setShouldConfirm(true);
  };

  return (
    isAuthInitialized && (
      <div className="w-full max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mt-8 admin-heading-button-container ">
          <h2
            className="text-appBlack text-[30px] font-featureBold"
            style={{
              fontWeight: 700,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            {requestedPost ? "Edit Post" : "Create Post"}
          </h2>

          <div className="flex justify-end gap-4">
            {(!requestedPost || requestedPost?.status === "draft") && (
              <Button
                isDisabled={isPending}
                className="font-featureHeadline email_button flex items-center justify-center"
                onClick={() => {
                  setShouldConfirm(false);
                  intervalSaveDraftRef.current = false;
                  handleSaveAsDraft();
                }}
                variant="flat"
                color="primary"
                // isLoading={isPending}
                isLoading={isDraftSaving}
              >
                Save as Draft
              </Button>
            )}
            <Dropdown
              // disabled={isPending}
              disabled={requestedPost?.status === "published" || isPending}
              classNames={{
                content: "!bg-appBlue p-0 !rounded-none !min-w-[150px]",
                base: "!p-[0_4px] !rounded-none",
                arrow: "!bg-appBlue",
              }}
              style={{
                // @ts-ignore
                "--nextui-content1": "230 67% 43%",
                backgroundColor: "#243bb5",
              }}
              placement="bottom-end"
              showArrow={true}
              isDisabled={requestedPost?.status === "published" || isPending}
            >
              <div className="flex items-start">
                <Button
                  isDisabled={isPending}
                  className="font-featureHeadline email_button flex items-center justify-center !bg-appBlue !text-primary"
                  onClick={() => handleSavePost()}
                  variant="flat"
                  color="primary"
                  isLoading={isPending && !isDraftSaving}
                >
                  <IoIosCreate />
                  <span>
                    {isPending && !isDraftSaving
                      ? "Saving..."
                      : getButtonLabel(requestedPost)}
                  </span>
                </Button>
                <DropdownTrigger
                  className={
                    "!scale-100 " +
                    (requestedPost?.status === "published" ? " !hidden" : "")
                  }
                >
                  <div className="font-featureHeadline !h-[40px] !min-w-[unset] !border-l-0 email_button flex items-center justify-center !bg-appBlue !text-primary">
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
                    className="text-[13px] grid grid-cols-[13px_1fr] items-center gap-3 bg-appBlue text-primary uppercase"
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
                {/* <DropdownItem
                    onClick={() => {
                      handleSaveAsDraft();
                    }}
                    className="!p-[10px_9px_12px] !pl-1 !rounded-none !bg-transparent"
                  >
                    <p
                      className="text-[13px] grid grid-cols-[13px_1fr] items-center gap-3 bg-appBlue text-primary uppercase"
                      style={{
                        fontWeight: 600,
                        fontVariationSettings: '"wght" 700,"opsz" 10',
                      }}
                    >
                      <MdDrafts />
                      <span>SAVE AS DRAFT</span>
                    </p>
                  </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div
          className="w-full "
          style={{ display: step === 1 ? "block" : "none" }}
        >
          {error && (
            <p className="text-danger-500 text-sm my-2">{error.message}</p>
          )}
          <JoditWrapper
            onChange={handleChangeEditor}
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
        {/* <div
            className="w-full max-w-[900px] mx-auto py-2 mt-4"
            style={{ display: step === 2 ? "block" : "none" }}
          >
            {error && (
              <p className="text-danger-500 text-sm my-2">{error.message}</p>
            )}
            <hr className=" border-dashed border-[#1f1d1a4d] mt-6 mb-4" />
            <SnippetForm ref={snippetRef} post={currentPost} />
          </div> */}
        {/* <DraftEditor /> */}
        {/* <button onClick={() => copyIt()}>Copy it</button> */}
        {(currentPost || requestedPost) && (
          <PostScheduleModal
            disclosureOptions={disclosureOptions}
            handlePostNow={handleSavePost}
            handleSchedulePost={handleSchedulePost}
            // @ts-ignore
            post={currentPost || requestedPost}
            isPending={isPending}
          />
        )}
        <LeavePageModal
          ref={leavePageModalRef}
          handleConfirm={() => {
            intervalSaveDraftRef.current = false;
            handleSaveAsDraft();
          }}
          isPending={isDraftSaving}
          shouldConfirm={shouldConfirm}
        />
      </div>
    )
  );
}
