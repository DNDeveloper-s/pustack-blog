import { useDeletePostDraft } from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";
import { DeletePostModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import { Post } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdModeEdit } from "react-icons/md";

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

export default function PostDraftItem({ post }: { post: Post }) {
  const disclosureOptions = useDisclosure();
  const router = useRouter();

  const disclosureOptionsDelete = useDisclosure();
  const {
    mutate: postDeleteDraft,
    isPending,
    error: deletionError,
  } = useDeletePostDraft();

  return (
    <div className="flex items-center justify-between bg-lightPrimary py-3 px-6">
      <div className="flex items-start gap-3 overflow-hidden">
        <div className="self-center">
          <Checkbox id={"item.key"} />
        </div>
        <div className="mt-1 w-16 h-16 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            src="https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-29%20at%204.28.09%E2%80%AFPM.png?alt=media&token=904dcade-3acf-4382-8506-990b4d683cd0"
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center justify-start overflow-hidden gap-2">
            <h2 className="text-[22px] font-featureHeadline font-medium mt-0 text-ellipsis whitespace-nowrap overflow-hidden">
              {post.displayTitle ?? post.title}
            </h2>
            <span
              className="flex-shrink-0 block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
              style={{
                backgroundColor: colorScheme[post.status]?.bg ?? "#FFA500",
                fontVariationSettings: `'wght' 700`,
              }}
            >
              {post.status}
            </span>
          </div>
          <p className="leading-[120%] text-sm line-clamp-3">
            <span className="text-tertiary">Sections:</span>{" "}
            <strong>{post.sections.length ?? 0}</strong>
          </p>
          <p className="leading-[120%] mt-2 font-helvetica text-tertiary text-xs">
            Updated at{" "}
            {dayjs(post?.timestamp).format("MMM DD, YYYY, H:mm a") +
              " " +
              " GMT " +
              dayjs(post?.timestamp).format("Z")}
            <span className="ml-4 text-[13px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
              {post.topic}
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => {
            router.push("/admin?draft_post_id=" + post.id);
          }}
        >
          <MdModeEdit />
          <p className="text-sm mb-[-1px]">Edit</p>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => disclosureOptions.onOpen()}
        >
          <FaEye />
          <p className="text-sm mb-[-1px]">View</p>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer text-danger-500 hover:text-danger-700"
          onClick={() => {
            disclosureOptionsDelete.onOpen();
          }}
        >
          <MdDelete />
          <p className="text-sm mb-[-1px]">Delete</p>
        </div>
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
