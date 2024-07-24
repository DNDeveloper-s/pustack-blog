import { useDeletePostDraft } from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";
import { DeletePostModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import { Post } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "@/lib/dayjsConfig";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit, MdModeEdit } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { IoIosEye } from "react-icons/io";
import { Tooltip } from "antd";

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
};

function PostItemActions({
  disclosureOptions,
  disclosureOptionsDelete,
  postId,
}: {
  disclosureOptions: any;
  disclosureOptionsDelete: any;
  postId: string;
}) {
  const router = useRouter();
  // const disclosureOptions = useDisclosure();
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
            router.push("/admin?post_id=" + postId);
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
            disclosureOptionsDelete.onOpen();
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
            <MdDelete />
            <span>Delete</span>
          </p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function PostDraftItemHeader() {
  return (
    <div
      className={
        "grid grid-cols-[1fr_90px_80px_30px] items-center py-3 pt-4 px-3 bg-lightPrimary mb-2 text-[11px]"
      }
    >
      {/* <div className="self-center">
        <Checkbox id={"item.key"} />
      </div> */}
      <div className="min-w-[120px]">Post Title</div>
      <div className="text-center">Topic</div>
      <div className="text-center">Timestamp</div>
      <div className="text-center">Act.</div>
    </div>
  );
}

export default function PostDraftItem({
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

  const disclosureOptionsDelete = useDisclosure();
  const {
    mutate: postDeleteDraft,
    isPending,
    error: deletionError,
  } = useDeletePostDraft();

  return (
    <div
      className={
        "grid grid-cols-[1fr_90px_80px_30px] items-center py-2 px-3 " +
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
        <div className="mt-1 w-8 h-8 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            src={post.snippetData?.image ?? "/images/placeholder.png"}
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center justify-start overflow-hidden gap-2">
            <h2 className="text-[16px] font-featureHeadline font-medium mt-0 line-clamp-2 overflow-hidden">
              {post.displayTitle ?? post.title}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
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
        <span className="ml-1 text-[10px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
          {post.topic}
        </span>
      </div>
      {/* <div className="flex items-center justify-center">
        <span
          className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
          style={{
            backgroundColor: colorScheme[post.status]?.bg ?? "#FFA500",
            fontVariationSettings: `'wght' 700`,
          }}
        >
          {post.status}
        </span>
      </div> */}
      <div>
        <p className="leading-[120%] font-helvetica text-center text-tertiary text-[10px]">
          <span>{dayjs().to(dayjs(post?.timestamp))}</span>
        </p>
      </div>
      <div className="flex items-center justify-center gap-5 text-xs">
        <PostItemActions
          disclosureOptions={disclosureOptions}
          disclosureOptionsDelete={disclosureOptionsDelete}
          postId={post.id as string}
        />
      </div>
      <JoditPreview
        disclosureOptions={disclosureOptions}
        sections={post.sections}
      />
      <DeletePostModalBase
        disclosureOptions={disclosureOptionsDelete}
        isLoading={isPending}
        onDelete={postDeleteDraft}
        error={deletionError}
        post={post}
      />
    </div>
  );
}
