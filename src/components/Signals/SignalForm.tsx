"use client";

import Navbar from "../Navbar/Navbar";
import { MathJaxContext } from "better-react-mathjax";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { SignalPreview } from "../Me/Signals/SignalItemDesktop";
import { useDisclosure } from "@nextui-org/modal";

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

  const previewDisclosureOptions = useDisclosure();

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
  }, [router]);

  useEffect(() => {
    if (!user) return;
    if (user.is_author || user.is_admin) return;
    router.push("/");
  }, [router, user]);

  useEffect(() => {
    if (requestedSignal) {
      if (requestedSignal.author.uid !== user?.uid && !user?.is_admin)
        return router.push("/" + signalId);
      setCurrentSignal(requestedSignal);
    }
  }, [requestedSignal, user?.uid, signalId, router, user?.is_admin]);

  const handleContinueSignal = useCallback(() => {
    if (!user) return;

    // const sections = postSectionsRef.current?.getSections();
    // sections?.forEach((section) => {
    //   section.updateContent(section.trimContent(section.content));
    // });

    const inputValue = joditRef.current?.getTitleValue() ?? "";
    const source = joditRef.current?.getSourceValue() ?? "";
    const sourceURL = joditRef.current?.getSourceURLValue() ?? "";

    console.log("inputValue - ", inputValue, source, sourceURL);

    const _isValid = joditRef.current?.isValid(inputValue, source, sourceURL);

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
      source || "Unknown",
      sourceURL
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
        sourceURL,
        requestedSignal.id,
        requestedSignal.timestamp,
        requestedSignal.status ?? "draft"
      );
    }

    signal.setFlagshipDate(markAsFlagshipButtonRef.current?.getFlagshipDate());

    // TODO:

    return signal;
  }, [openNotification, requestedSignal, user]);

  async function handleSaveDraftSignal() {
    const currentSignal = handleContinueSignal();
    if (!currentSignal) return;

    currentSignal.draft();

    isDraftSavingRef.current = true;

    requestedSignal
      ? postUpdateSignal(currentSignal)
      : postCreateSignal(currentSignal);
  }

  const handleSaveSignal = useCallback(
    async function () {
      const currentSignal = handleContinueSignal();
      if (!currentSignal) return;

      currentSignal.live();

      isDraftSavingRef.current = false;

      requestedSignal
        ? postUpdateSignal(currentSignal)
        : postCreateSignal(currentSignal);
    },
    [handleContinueSignal, postCreateSignal, postUpdateSignal, requestedSignal]
  );

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
                  // saveSignalGenerator.next();
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
            <Button
              isDisabled={isPending}
              className="font-featureHeadline email_button flex items-center justify-center !bg-appBlack !text-primary"
              onClick={async () => {
                const currentSignal = handleContinueSignal();

                if (currentSignal) {
                  setCurrentSignal(currentSignal);
                  previewDisclosureOptions.onOpen();
                }
              }}
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
          </div>
        </div>
        <div>
          <SignalJodit
            openPreview={() => {
              previewDisclosureOptions.onOpen();
            }}
            preSignal={requestedSignal}
            ref={joditRef}
          />
        </div>
        {currentSignal && (
          <SignalPreview
            disclosureOptions={previewDisclosureOptions}
            signal={currentSignal}
            Footer={
              <>
                <Button
                  isDisabled={isPending}
                  className="font-featureHeadline email_button flex items-center justify-center"
                  onClick={() => {
                    // setShouldConfirm(false);
                    // intervalSaveDraftRef.current = false;
                    // saveSignalGenerator.next();
                    previewDisclosureOptions.onClose();
                    // setAllSignalsToPublished();
                  }}
                  variant="flat"
                  color="primary"
                  // isLoading={isPending}
                  isLoading={isDraftSaving}
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={isPending}
                  className="font-featureHeadline email_button flex items-center justify-center !bg-appBlack !text-primary"
                  onClick={() => {
                    handleSaveSignal();
                  }}
                  variant="flat"
                  color="primary"
                  isLoading={isPending}
                  // isLoading={isPending && !isDraftSaving}
                >
                  Approve
                </Button>
              </>
            }
          />
        )}
      </div>
    )
  );
}
