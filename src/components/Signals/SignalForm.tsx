"use client";

import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useEffect, useRef, useState } from "react";
import SignalJodit from "./SignalJodit";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { IoIosCreate } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa6";
import { MdScheduleSend } from "react-icons/md";
import useScreenSize from "@/hooks/useScreenSize";
import { useUser } from "@/context/UserContext";
import { useNotification } from "@/context/NotificationContext";
import { Signal } from "@/firebase/signal";
import {
  setAllSignalsToPublished,
  useCreateSignal,
  useGetSignalById,
  useUpdateSignal,
} from "@/api/signal";
import { NotificationPlacements } from "antd/es/notification/interface";
import { SnackbarContent } from "../AdminEditor/AdminPage";
import MarkAsFlagshipButton from "./MarkAsFlagshipButton";

const getButtonLabel = (requestedSignal?: Signal) => {
  if (requestedSignal?.status === "draft") return "Create Signal";

  return requestedSignal ? "Update Signal" : "Create Signal";
};

export default function SignalForm({ signalId }: { signalId?: string | null }) {
  // Local State
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);

  // Third-Party Hooks
  const router = useRouter();

  // Contexts
  const { user } = useUser();
  const { openNotification } = useNotification();

  // Custom Hooks
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  // Refs
  const joditRef = useRef<any>(null);
  const isDraftSavingRef = useRef<boolean>(false);
  const markAsFlagshipButtonRef = useRef<any>(null);

  // React Query hooks
  const { data: requestedSignal } = useGetSignalById(signalId);
  const {
    mutate: postCreateSignal,
    isPending: isCreatePending,
    error: createPostError,
  } = useCreateSignal({
    onSuccess: (data: Signal) => {
      // Resets
      isDraftSavingRef.current = false;
      joditRef.current.reset();

      let label = "Your signal has been created";
      if (data.status === "draft")
        label = "Your signal has been saved as draft";

      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={label} />,
          closable: false,
          showProgress: true,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "success"
      );

      // @ts-ignore
      window.location = "/signals";
    },
    onError: (error) => {
      // Resets
      isDraftSavingRef.current = false;

      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={error.message} />,
          closable: false,
          showProgress: true,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
    },
  });
  const {
    mutate: postUpdateSignal,
    isPending: isUpdatePending,
    error: updatePostError,
  } = useUpdateSignal({
    onSuccess: (data: Signal) => {
      // Resets
      isDraftSavingRef.current = false;
      joditRef.current.reset();

      let label = "Your signal has been updated";
      if (data.status === "draft")
        label = "Your signal has been saved as draft";

      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={label} />,
          closable: false,
          showProgress: true,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "success"
      );

      // @ts-ignore
      window.location = "/signals";
    },
    onError: (error) => {
      // Resets
      isDraftSavingRef.current = false;

      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={error.message} />,
          closable: false,
          showProgress: true,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
    },
  });

  // Variables
  const error = createPostError || updatePostError;
  const isPending = isCreatePending || isUpdatePending;
  const isDraftSaving = isDraftSavingRef.current && isPending;

  // Use Effects
  useEffect(() => {
    async function checkUser() {
      await auth.authStateReady();

      if (auth.currentUser) return setIsAuthInitialized(true);

      return router.push("/");
    }

    checkUser();
  }, []);

  useEffect(() => {
    if (requestedSignal) {
      if (requestedSignal.author.uid !== user?.uid)
        return router.push("/" + signalId);
      setCurrentSignal(requestedSignal);
    }
  }, [requestedSignal, user?.uid, signalId]);

  async function handleContinueSignal() {
    if (!user) return;

    // const sections = postSectionsRef.current?.getSections();
    // sections?.forEach((section) => {
    //   section.updateContent(section.trimContent(section.content));
    // });

    const inputValue = joditRef.current?.getTitleValue() ?? "";
    const source = joditRef.current?.getSourceValue() ?? "";

    const _isValid = joditRef.current?.isValid(inputValue, source);

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

    let signal = new Signal(
      inputValue || "Untitled",
      joditRef.current?.getSlateValue(),
      {
        name: user.name,
        email: user.email,
        photoURL: user.image_url,
        uid: user.uid,
      },
      source || "Unknown"
    );

    if (requestedSignal) {
      signal = new Signal(
        inputValue || "Untitled",
        joditRef.current?.getSlateValue(),
        {
          name: user.name,
          email: user.email,
          photoURL: user.image_url,
          uid: user.uid,
        },
        source || "Unknown",
        requestedSignal.id,
        requestedSignal.timestamp,
        requestedSignal.status ?? "draft"
      );
    }

    signal.setFlagshipDate(markAsFlagshipButtonRef.current?.getFlagshipDate());

    // TODO:

    return signal;

    // // postCreatePost(post);
    // handleContinue(post);
    // postCreateSignal(signal);
  }

  async function handleSaveDraftSignal() {
    const currentSignal = await handleContinueSignal();
    if (!currentSignal) return;

    currentSignal.draft();

    isDraftSavingRef.current = true;

    requestedSignal
      ? postUpdateSignal(currentSignal)
      : postCreateSignal(currentSignal);
  }

  async function handleSaveSignal() {
    const currentSignal = await handleContinueSignal();
    if (!currentSignal) return;

    currentSignal.live();

    isDraftSavingRef.current = false;

    requestedSignal
      ? postUpdateSignal(currentSignal)
      : postCreateSignal(currentSignal);
  }

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
          {/* <div className="flex items-center justify-between max-w-[1100px] mx-auto">
          <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
            Create Signal
          </h2>
          <div>
            
          </div>
        </div> */}
          <div className="w-full max-w-[900px] mx-auto">
            <div className="flex items-center justify-between mt-8 admin-heading-button-container ">
              <h2 className="text-appBlack text-[30px] font-featureBold">
                {requestedSignal ? "Edit Signal" : "Create Signal"}
              </h2>

              <div className="flex justify-end gap-4">
                <MarkAsFlagshipButton
                  value={requestedSignal?.flagshipDate}
                  ref={markAsFlagshipButtonRef}
                />
                {(!requestedSignal || requestedSignal?.status === "draft") && (
                  <Button
                    isDisabled={isPending}
                    className="font-featureHeadline email_button flex items-center justify-center"
                    onClick={() => {
                      // setShouldConfirm(false);
                      // intervalSaveDraftRef.current = false;
                      handleSaveDraftSignal();
                      // setAllSignalsToPublished();
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
                  disabled={
                    requestedSignal?.status === "published" || isPending
                  }
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
                  // isDisabled={true}
                  isDisabled={
                    requestedSignal?.status === "published" || isPending
                  }
                >
                  <div className="flex items-start">
                    <Button
                      isDisabled={isPending}
                      className="font-featureHeadline email_button flex items-center justify-center !bg-appBlue !text-primary"
                      onClick={() => handleSaveSignal()}
                      variant="flat"
                      color="primary"
                      isLoading={isPending}
                      // isLoading={isPending && !isDraftSaving}
                    >
                      <IoIosCreate />
                      <span>
                        {isPending && !isDraftSaving
                          ? "Saving..."
                          : getButtonLabel(requestedSignal)}
                      </span>
                    </Button>
                    <DropdownTrigger
                      className={
                        "!scale-100 " +
                        (requestedSignal?.status === "published"
                          ? " !hidden"
                          : "")
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
                        // disclosureOptions.onOpen();
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
                          {/* {currentPost?.status === "scheduled" */}
                          {/* ? "UPDATE SCHEDULE" */}
                          SCHEDULE POST
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
            <div>
              <SignalJodit preSignal={requestedSignal} ref={joditRef} />
            </div>
          </div>
        </div>
        {/* <DraftEditor /> */}
        {/* <button onClick={() => copyIt()}>Copy it</button> */}
      </main>
    )
  );
}
