import {
  useDeletePostDraft,
  usePublishPost,
  useUnPublishPost,
} from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";

import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import { getSections } from "@/components/SlateEditor/utils/helpers";
import { Post } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdPublish, MdUnpublished } from "react-icons/md";
import { CustomElement } from "../../../../types/slate";
import { noImageUrl } from "./PostItem";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Tooltip } from "antd";
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

export function PostItemDesktopHeader() {
  return (
    <div
      className={
        "grid grid-cols-[1fr_100px_150px_200px_200px] items-center py-3 px-6 bg-lightPrimary mb-2"
      }
    >
      {/* <div className="self-center">
        <Checkbox id={"item.key"} />
      </div> */}
      <div className="pl-1">Post Title</div>
      <div className="text-center">Topic</div>
      <div className="text-center">Status</div>
      <div className="text-center">Published At</div>
      <div className="text-center">Actions</div>
    </div>
  );
}

export default function PostItemDesktop({
  post,
  handleSelectChange,
  isSelected,
}: {
  post: Post;
  handleSelectChange: (id: string, selected: boolean) => void;
  isSelected: boolean;
}) {
  const disclosureOptions = useDisclosure();
  const router = useRouter();

  const disclosureOptionsUnPublish = useDisclosure();
  const disclosureOptionsPublish = useDisclosure();
  const {
    mutate: postUnpublishPost,
    isPending,
    error: unpublishError,
  } = useUnPublishPost({
    onSuccess: () => {
      disclosureOptionsUnPublish.onClose();
    },
  });
  const {
    mutate: postPublishPost,
    isPending: isPublishPending,
    error: publishError,
  } = usePublishPost({
    onSuccess: () => {
      disclosureOptionsPublish.onClose();
    },
  });

  const sections = useMemo(() => {
    if (!post) return [];
    if (post.nodes) {
      return getSections(post.nodes as CustomElement[]);
    }
    return post.sections;
  }, [post?.sections, post?.nodes]);

  const isReadyToPublish =
    post.status === "draft" || post.status === "unpublished";

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
          <img
            className="w-full h-full object-cover"
            src={post.snippetData?.image ?? noImageUrl}
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center justify-start overflow-hidden gap-2">
            <Link
              href={"/posts/" + post.id}
              prefetch={true}
              className="text-[16px] font-featureHeadline font-medium mt-0"
            >
              {post.displayTitle ?? post.title}
            </Link>
          </div>
          <p className="leading-[120%] text-sm line-clamp-3">
            <span className="text-tertiary">Sections:</span>{" "}
            <strong>{sections.length ?? 0}</strong>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Tooltip title={post.formatArticleTopic()}>
          <span className="ml-4 text-[13px] text-[#53524c] text-center font-helvetica uppercase leading-[14px]">
            {post.formatArticleTopic(true)}
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center justify-center">
        <span
          className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
          style={{
            backgroundColor: colorScheme[post.status]?.bg ?? "#FFA500",
            fontVariationSettings: `'wght' 700`,
          }}
        >
          {post.status}
        </span>
      </div>
      <div>
        <p className="leading-[120%] font-helvetica text-center text-tertiary text-xs">
          {/* {post?.scheduledTime && post?.status === "scheduled" ? (
            <>
              Scheduled for{" "}
              {dayjs(post?.scheduledTime).format("MMM DD, YYYY, H:mm a")}
            </>
          ) : (
            <>
              {post?.status === "published" ? "Published" : "Saved"} at{" "}
              {dayjs(post?.timestamp).format("MMM DD, YYYY, H:mm a")}
            </>
          )} */}
          {dayjs(post?.timestamp).format("MMMM DD, YYYY")}
        </p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => {
            router.push("/posts/create?post_id=" + post.id);
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
      <JoditPreview disclosureOptions={disclosureOptions} nodes={post.nodes} />
      <PostActionModalBase
        disclosureOptions={disclosureOptionsUnPublish}
        isLoading={isPending}
        onConfirm={() => postUnpublishPost(post.id as string)}
        error={unpublishError}
        post={post}
        title={"Unpublish Post"}
        content={
          <p>
            Are you sure you want to unpublish the post &quot;
            <strong>{post?.displayTitle}</strong>&quot;
          </p>
        }
        cancelButton={"Cancel"}
        confirmButton={"Unpublish"}
      />
      <PostActionModalBase
        disclosureOptions={disclosureOptionsPublish}
        isLoading={isPublishPending}
        onConfirm={() => postPublishPost(post.id as string)}
        error={publishError}
        post={post}
        title={"Publish Post"}
        content={
          <p>
            Are you sure you want to publish the post &quot;
            <strong>{post?.displayTitle}</strong>&quot;
          </p>
        }
        cancelButton={"Cancel"}
        confirmButton={"Publish"}
      />
    </div>
  );
}
