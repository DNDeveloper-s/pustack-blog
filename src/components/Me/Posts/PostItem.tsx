import {
  useDeletePostDraft,
  usePublishPost,
  useUnPublishPost,
} from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import { Post, PostStatus } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "@/lib/dayjsConfig";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import {
  MdDelete,
  MdEdit,
  MdModeEdit,
  MdPublish,
  MdUnpublished,
} from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { IoIosEye } from "react-icons/io";
import { Tooltip } from "antd";
import { useMemo } from "react";
import { getSections } from "@/components/SlateEditor/utils/helpers";
import { CustomElement } from "../../../../types/slate";
import AppImage from "@/components/shared/AppImage";

export const noImageUrl =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

const colorScheme = {
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

function PostItemActions({
  disclosureOptions,
  disclosureOptionsPublish,
  disclosureOptionsUnPublish,
  postId,
  status,
}: {
  disclosureOptions: any;
  disclosureOptionsPublish: any;
  disclosureOptionsUnPublish: any;
  postId: string;
  status: PostStatus;
}) {
  const router = useRouter();
  // const disclosureOptions = useDisclosure();
  const isReadyToPublish = status === "draft" || status === "unpublished";

  return (
    <Dropdown
      classNames={{
        content: "!bg-primary !rounded-[4px] p-0 !min-w-[100px]",
        base: "!p-[0_4px]",
        arrow: "!bg-primary",
      }}
      style={{
        // @ts-ignore
        "--nextui-content1": "55 70% 91%",
        backgroundColor: "#f8f5d7",
        borderRadius: "4px",
      }}
      placement="bottom-end"
      showArrow={true}
    >
      <DropdownTrigger className="!scale-100 !opacity-100">
        <div className="relative">
          <SlOptionsVertical />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{
          list: "p-0 m-0 divide-y divide-dashed divide-[#fcfae4] !gap-0",
          base: "!p-[0_5px]",
        }}
      >
        <DropdownItem
          onClick={() => {
            router.push("/posts/create?post_id=" + postId);
          }}
          className="!p-[9px_9px_5px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            <MdEdit />
            <span>Edit</span>
          </p>
        </DropdownItem>
        <DropdownItem
          onClick={() => disclosureOptions.onOpen()}
          className="!p-[6px_9px_6px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            <IoIosEye />
            <span>View</span>
          </p>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            isReadyToPublish
              ? disclosureOptionsPublish.onOpen()
              : disclosureOptionsUnPublish.onOpen();
          }}
          className="!p-[6px_9px_9px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            {isReadyToPublish ? (
              <>
                <MdPublish />
                <span>Publish</span>
              </>
            ) : (
              <>
                <MdUnpublished />
                <span>Unpublish</span>
              </>
            )}
          </p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function PostItemHeader() {
  return null;
  return (
    <div className="text-[18px] py-2 px-3 font-featureBold">
      <p>Posts</p>
    </div>
  );
}

// function PostItem2({
//   post,
//   handleSelectChange,
//   isSelected,
// }: {
//   post: Post;
//   handleSelectChange: (id: string, selected: boolean) => void;
//   isSelected: boolean;
// }) {
//   const disclosureOptions = useDisclosure();
//   const router = useRouter();

//   const disclosureOptionsUnPublish = useDisclosure();
//   const disclosureOptionsPublish = useDisclosure();
//   const {
//     mutate: postUnpublishPost,
//     isPending,
//     error: unpublishError,
//   } = useUnPublishPost({
//     onSuccess: () => {
//       disclosureOptionsUnPublish.onClose();
//     },
//   });
//   const {
//     mutate: postPublishPost,
//     isPending: isPublishPending,
//     error: publishError,
//   } = usePublishPost({
//     onSuccess: () => {
//       disclosureOptionsPublish.onClose();
//     },
//   });

//   return (
//     <div
//       className={
//         "grid grid-cols-[1fr_90px_80px_30px] items-center py-2 px-3 " +
//         (isSelected ? "bg-primaryVariant1" : "bg-transparent")
//       }
//     >
//       {/* <div className="self-center">
//         <Checkbox
//           id={"item.key"}
//           onChange={(checked) => handleSelectChange(post.id as string, checked)}
//         />
//       </div> */}
//       <div className="flex items-start gap-3 overflow-hidden min-w-[120px]">
//         <div className="mt-1 w-8 h-8 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
//           <img
//             className="w-full h-full object-cover"
//             src={post.snippetData?.image ?? noImageUrl}
//           />
//         </div>
//         <div className="overflow-hidden">
//           <div className="flex items-center justify-start overflow-hidden gap-2">
//             <h2 className="text-[16px] font-featureHeadline font-medium mt-0 line-clamp-2 overflow-hidden">
//               {post.displayTitle ?? post.title}
//             </h2>
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center justify-center">
//         <Tooltip
//           title={post.status.toUpperCase()}
//           style={{ fontSize: "13px" }}
//           placement="top"
//         >
//           <span
//             className="w-1.5 h-1.5 rounded-full flex-shrink-0 block"
//             style={{ backgroundColor: colorScheme[post.status]?.bg }}
//           ></span>
//         </Tooltip>
//         <span className="ml-1 text-[10px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
//           {post.topic}
//         </span>
//       </div>
//       {/* <div className="flex items-center justify-center">
//         <span
//           className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
//           style={{
//             backgroundColor: colorScheme[post.status]?.bg ?? "#FFA500",
//             fontVariationSettings: `'wght' 700`,
//           }}
//         >
//           {post.status}
//         </span>
//       </div> */}
//       <div>
//         <p className="leading-[120%] font-helvetica text-center text-tertiary text-[10px]">
//           <span>{dayjs().to(dayjs(post?.timestamp))}</span>
//         </p>
//       </div>
//       <div className="flex items-center justify-center gap-5 text-xs">
//         <PostItemActions
//           disclosureOptions={disclosureOptions}
//           disclosureOptionsPublish={disclosureOptionsPublish}
//           disclosureOptionsUnPublish={disclosureOptionsUnPublish}
//           postId={post.id as string}
//           status={post.status}
//         />
//       </div>
//       <JoditPreview disclosureOptions={disclosureOptions} nodes={post.nodes} />
//       <PostActionModalBase
//         disclosureOptions={disclosureOptionsUnPublish}
//         isLoading={isPending}
//         onConfirm={() => postUnpublishPost(post.id as string)}
//         error={unpublishError}
//         post={post}
//         title={"Unpublish Post"}
//         content={
//           <p>
//             Are you sure you want to unpublish the post &quot;
//             <strong>{post?.displayTitle}</strong>&quot;
//           </p>
//         }
//         cancelButton={"Cancel"}
//         confirmButton={"Unpublish"}
//       />
//       <PostActionModalBase
//         disclosureOptions={disclosureOptionsPublish}
//         isLoading={isPublishPending}
//         onConfirm={() => postPublishPost(post.id as string)}
//         error={publishError}
//         post={post}
//         title={"Publish Post"}
//         content={
//           <p>
//             Are you sure you want to publish the post &quot;
//             <strong>{post?.displayTitle}</strong>&quot;
//           </p>
//         }
//         cancelButton={"Cancel"}
//         confirmButton={"Publish"}
//       />
//     </div>
//   );
// }

export default function PostItem({
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

  return (
    <div
      className={
        "grid grid-cols-[1fr_30px] items-start py-2 px-3 " +
        (isSelected ? "bg-primaryVariant1" : "bg-transparent")
      }
    >
      {/* <div className="self-center">
        <Checkbox
          id={"item.key"}
          onChange={(checked) => handleSelectChange(post.id as string, checked)}
        />
      </div> */}
      <div className="flex items-start gap-3 overflow-hidden min-w-[120px]">
        <div className="mt-1 w-[90px] h-[90px] overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <AppImage
            width={200}
            height={200}
            alt="Event Image"
            className="w-full h-full object-cover"
            src={post.snippetData?.image ?? noImageUrl}
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex flex-col items-start justify-start overflow-hidden">
            <h2 className="text-[15px] leading-[19px] font-featureHeadline font-medium mt-0 overflow-hidden">
              {post.title}
            </h2>
            <p className="flex items-center gap-1 mt-1.5">
              <Tooltip
                title={post.status.toUpperCase()}
                style={{ fontSize: "13px" }}
                placement="top"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 block"
                  style={{ backgroundColor: colorScheme[post.status]?.bg }}
                ></span>
              </Tooltip>
              <span className="text-[11px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
                {post.topic}
              </span>
            </p>
            <p className="leading-[120%] font-helvetica text-center text-tertiary text-xs mt-1">
              {post?.scheduledTime && post?.status === "scheduled" ? (
                <>
                  Scheduled for{" "}
                  {dayjs(post?.scheduledTime).format("MMM DD, YYYY, H:mm a")}
                </>
              ) : (
                <>
                  {post?.status === "published" ? "Published" : "Saved"} at{" "}
                  {dayjs(post?.timestamp).format("MMM DD, YYYY, H:mm a")}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-center">
        <Tooltip
          title={event.status.toUpperCase()}
          style={{ fontSize: "13px" }}
          placement="top"
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 block"
            style={{ backgroundColor: colorScheme[event.status]?.bg }}
          ></span>
        </Tooltip>
        <span className="ml-1 text-[10px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
          {event.title}
        </span>
      </div>
      <div>
        <p className="leading-[120%] font-helvetica text-center text-tertiary text-[10px]">
          <span>{dayjs().to(dayjs(event?.startTime?.toDate()))}</span>
        </p>
      </div> */}
      <div className="flex items-center py-2 justify-center gap-5 text-xs">
        <PostItemActions
          disclosureOptions={disclosureOptions}
          disclosureOptionsPublish={disclosureOptionsPublish}
          disclosureOptionsUnPublish={disclosureOptionsUnPublish}
          postId={post.id as string}
          status={post.status}
        />
      </div>
    </div>
  );
}
