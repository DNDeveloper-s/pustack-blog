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
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdPublish, MdUnpublished } from "react-icons/md";
import { CustomElement } from "../../../../types/slate";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Tooltip } from "antd";
import { Signal } from "@/firebase/signal";
import { usePublishSignal, useUnPublishSignal } from "@/api/signal";
import AppImage from "@/components/shared/AppImage";
import { noImageUrl } from "./SignalItem";

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
  return (
    <div
      className={
        "grid grid-cols-[1fr_100px_150px_200px_200px] items-center py-3 px-6 bg-lightPrimary mb-2"
      }
    >
      {/* <div className="self-center">
          <Checkbox id={"item.key"} />
        </div> */}
      <div className="pl-1">Signal Title</div>
      <div className="text-center">Source</div>
      <div className="text-center">Status</div>
      <div className="text-center">Timestamp</div>
      <div className="text-center">Actions</div>
    </div>
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
        "grid grid-cols-[1fr_100px_150px_200px_200px] items-center py-3 px-6 " +
        (isSelected ? "bg-primaryVariant1" : "bg-lightPrimary")
      }
    >
      {/* <div className="self-center">
          <Checkbox
            id={"item.key"}
            onChange={(checked) => handleSelectChange(post.id as string, checked)}
          />
        </div> */}
      <div className="flex items-start gap-3 overflow-hidden">
        <div className="mt-1 w-16 h-16 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          {getFirstImage(signal.nodes ?? []) && (
            <AppImage
              alt="sd"
              src={getFirstImage(signal.nodes ?? []) ?? noImageUrl}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-[4px] bg-gray-400"
            />
          )}
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center justify-center overflow-hidden gap-2">
            <h2 className="text-[22px] font-featureHeadline font-medium mt-0 text-ellipsis whitespace-nowrap overflow-hidden">
              {signal.title}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span className="ml-4 text-[13px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
          {signal.source}
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
          {signal?.scheduledTime && signal?.status === "scheduled" ? (
            <>
              Scheduled for{" "}
              {dayjs(signal?.scheduledTime).format("MMM DD, YYYY, H:mm a")}
            </>
          ) : (
            <>
              {signal?.status === "published" ? "Published" : "Saved"} at{" "}
              {dayjs(signal?.timestamp).format("MMM DD, YYYY, H:mm a")}
            </>
          )}
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
      <JoditPreview
        disclosureOptions={disclosureOptions}
        nodes={signal.nodes}
      />
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
