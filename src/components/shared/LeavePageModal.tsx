import { Post } from "@/firebase/post-v2";
import { useInterceptAppRouter } from "@/hooks/usePreventRouteChange";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface LeavePageModalProps {
  shouldConfirm?: boolean;
  handleConfirm?: () => void;
  isPending?: boolean;
  onClose?: () => void;
}
function LeavePageModalRef(
  {
    shouldConfirm = true,
    handleConfirm: _handleConfirm,
    isPending,
    onClose,
  }: LeavePageModalProps,
  ref: any
) {
  const router = useRouter();
  const disclosureOptions = useDisclosure();
  const proceedRef = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    close: () => {
      proceedRef.current();
      disclosureOptions.onClose();
    },
    closeWithoutProceeding: () => {
      disclosureOptions.onClose();
    },
    isOpen: () => disclosureOptions.isOpen,
  }));

  useEffect(() => {
    const handlePageLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handlePopState = (e: any) => {
      if (shouldConfirm) {
        const shouldProceed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!shouldProceed) {
          // window.history.pushState(null, "", window.location.href + "admin");
          router.push("/posts/create");
        }

        // disclosureOptions.onOpen();
      }
    };

    if (shouldConfirm) {
      window.addEventListener("beforeunload", handlePageLeave);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, [shouldConfirm]);

  const handleIntercept = (proceed: () => void) => {
    if (!shouldConfirm) {
      return proceed();
    }
    // const shouldProceed = window.confirm(
    //   "You have unsaved changes. Are you sure you want to leave?"
    // );
    // if (shouldProceed) {
    //   proceed();
    // }
    disclosureOptions.onOpen();
    proceedRef.current = proceed;
  };

  useInterceptAppRouter("push", (original, ...args) => {
    if (args[0] === "/posts/create") {
      original(...args);
      return;
    }
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("replace", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("replace", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("back", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("forward", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
  useInterceptAppRouter("refresh", (original, ...args) => {
    handleIntercept(() => original(...args));
  });

  const handleLeave = () => {
    proceedRef.current();
    disclosureOptions.onClose();
  };

  const handleConfirm = () => {
    _handleConfirm && _handleConfirm();
  };

  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50 !z-[9999]",
        base: "!max-w-[500px] !w-[90vw]",
        backdrop: "!z-[999]",
      }}
      isDismissable={false}
      onClose={onClose}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          <span className="font-featureBold">Leave Page?</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-1 mt-2">
            <label htmlFor="" className="text-[13px] ml-1 font-helvetica">
              You have unsaved changes that will be lost if you leave the page.
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-4">
            <Button
              isDisabled={isPending}
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-transparent border-none font-featureBold text-appBlue text-xs uppercase"
              variant="flat"
              onClick={handleLeave}
            >
              {/* <IoIosCreate /> */}
              <span>Leave</span>
            </Button>
            <Button
              isDisabled={isPending}
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-appBlue font-featureBold  text-primary text-xs uppercase"
              variant="flat"
              color="primary"
              onClick={handleConfirm}
              isLoading={isPending}
            >
              {/* <IoIosCreate /> */}
              <span>Save as Draft</span>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(LeavePageModalRef);
