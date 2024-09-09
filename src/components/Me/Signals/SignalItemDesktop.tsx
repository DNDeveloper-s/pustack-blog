import {
  useDeletePostDraft,
  usePublishPost,
  useUnPublishPost,
} from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";

import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import {
  getFirstImage,
  getSections,
} from "@/components/SlateEditor/utils/helpers";
import { Post } from "@/firebase/post-v2";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaExternalLinkAlt, FaEye } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdPublish, MdUnpublished } from "react-icons/md";
import { CustomElement } from "../../../../types/slate";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Tooltip } from "antd";
import { Signal } from "@/firebase/signal";
import { usePublishSignal, useUnPublishSignal } from "@/api/signal";
import AppImage from "@/components/shared/AppImage";
import { noImageUrl } from "./SignalItem";
import { useMediaQuery } from "react-responsive";
import { SignalComponent } from "@/components/Signals/Signals";
import Link from "next/link";

export const colorScheme = {
  draft: {
    bg: "#FFA500",
    text: "#CC7A00",
  },
  scheduled: {
    bg: "#1E90FF",
    text: "#0C5A9E",
  },
  published: {
    bg: "#32CD32",
    text: "#228B22",
  },
  unpublished: {
    bg: "#A9A9A9",
    text: "#ffffff",
  },
};

export function SignalItemDesktopHeader() {
  const isSmallDesktop = useMediaQuery({ maxWidth: 1025 });
  return (
    <div
      className={
        "grid grid-cols-[1fr_200px_120px_200px_150px] items-center py-3 px-6 bg-lightPrimary mb-2"
      }
      style={{
        zoom: isSmallDesktop ? 0.8 : 1,
      }}
    >
      {/* <div className="self-center">
          <Checkbox id={"item.key"} />
        </div> */}
      <div className="pl-1">Signal Title</div>
      <div className="text-center">Source</div>
      <div className="text-center">Status</div>
      <div className="text-center">Published At</div>
      <div className="text-center">Actions</div>
    </div>
  );
}

export function SignalPreview({
  disclosureOptions,
  signal,
}: {
  disclosureOptions: ReturnType<typeof useDisclosure>;
  signal: Signal;
}) {
  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50 !items-center",
        base: "!max-w-[900px] !w-[90vw]",
      }}
    >
      <ModalContent className="h-auto min-h-[400px] max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          Preview
        </ModalHeader>
        <ModalBody>
          <SignalComponent signal={signal} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function SignalItemDesktop({
  signal,
  handleSelectChange,
  isSelected,
}: {
  signal: Signal;
  handleSelectChange: (id: string, selected: boolean) => void;
  isSelected: boolean;
}) {
  const disclosureOptions = useDisclosure();
  const router = useRouter();

  const isSmallDesktop = useMediaQuery({ maxWidth: 1025 });

  const disclosureOptionsUnPublish = useDisclosure();
  const disclosureOptionsPublish = useDisclosure();
  const {
    mutate: postUnpublishSignal,
    isPending,
    error: unpublishError,
  } = useUnPublishSignal({
    onSuccess: () => {
      disclosureOptionsUnPublish.onClose();
    },
  });
  const {
    mutate: postPublishSignal,
    isPending: isPublishPending,
    error: publishError,
  } = usePublishSignal({
    onSuccess: () => {
      disclosureOptionsPublish.onClose();
    },
  });

  const isReadyToPublish =
    signal.status === "draft" || signal.status === "unpublished";

  return (
    <div
      className={
        "grid grid-cols-[1fr_200px_120px_200px_150px] items-center py-3 px-6 " +
        (isSelected ? "bg-primaryVariant1" : "bg-lightPrimary")
      }
      style={{
        zoom: isSmallDesktop ? 0.8 : 1,
      }}
    >
      {/* <div className="self-center">
          <Checkbox
            id={"item.key"}
            onChange={(checked) => handleSelectChange(post.id as string, checked)}
          />
        </div> */}
      <div className="flex items-start gap-3 overflow-hidden">
        <div className="mt-1 w-16 h-16 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <AppImage
            alt="sd"
            src={getFirstImage(signal.nodes ?? []) ?? noImageUrl}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-[4px] bg-gray-400"
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center justify-center overflow-hidden gap-2">
            <Link
              href={"/signals?id=" + signal.id}
              className="text-[16px] font-featureHeadline font-medium mt-0"
            >
              {signal.title}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span className="ml-4 text-[13px] text-[#53524c] font-helvetica leading-[16px] text-center">
          <Link
            href={signal.source}
            target="_blank"
            className="flex items-center gap-2 text-appBlue"
          >
            <span>Go to Link</span>
            <FaExternalLinkAlt />
          </Link>
        </span>
      </div>
      <div className="flex items-center justify-center">
        <span
          className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
          style={{
            backgroundColor: colorScheme[signal.status]?.bg ?? "#FFA500",
            fontVariationSettings: `'wght' 700`,
          }}
        >
          {signal.status}
        </span>
      </div>
      <div>
        <p className="leading-[120%] font-helvetica text-center text-tertiary text-xs">
          {/* {signal?.scheduledTime && signal?.status === "scheduled" ? (
            <>
              Scheduled for{" "}
              {dayjs(signal?.scheduledTime).format("MMM DD, YYYY, H:mm a")}
            </>
          ) : (
            <>{signal?.status === "published" ? "Published" : "Saved"} at </>
          )} */}
          {dayjs(signal?.timestamp).format("MMMM DD, YYYY")}
        </p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => {
            router.push("/signals/create?signal_id=" + signal.id);
          }}
        >
          <MdModeEdit />
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => disclosureOptions.onOpen()}
        >
          <FaEye />
        </div>
        <Tooltip title={isReadyToPublish ? "Publish" : "Unpublish"}>
          <div
            className={
              "flex items-center gap-1 cursor-pointer " +
              (isReadyToPublish
                ? " text-green-500 hover:text-green-700 text-lg"
                : " text-danger-500 hover:text-danger-700")
            }
            onClick={() => {
              isReadyToPublish
                ? disclosureOptionsPublish.onOpen()
                : disclosureOptionsUnPublish.onOpen();
            }}
          >
            {isReadyToPublish ? <MdPublish /> : <MdUnpublished />}
          </div>
        </Tooltip>
      </div>
      <SignalPreview disclosureOptions={disclosureOptions} signal={signal} />
      <PostActionModalBase
        disclosureOptions={disclosureOptionsUnPublish}
        isLoading={isPending}
        onConfirm={() => postUnpublishSignal(signal.id as string)}
        error={unpublishError}
        title={"Unpublish Post"}
        content={
          <p>
            Are you sure you want to unpublish the post &quot;
            <strong>{signal?.title}</strong>&quot;
          </p>
        }
        cancelButton={"Cancel"}
        confirmButton={"Unpublish"}
      />
      <PostActionModalBase
        disclosureOptions={disclosureOptionsPublish}
        isLoading={isPublishPending}
        onConfirm={() => postPublishSignal(signal.id as string)}
        error={publishError}
        title={"Publish Post"}
        content={
          <p>
            Are you sure you want to publish the post &quot;
            <strong>{signal?.title}</strong>&quot;
          </p>
        }
        cancelButton={"Cancel"}
        confirmButton={"Publish"}
      />
    </div>
  );
}
