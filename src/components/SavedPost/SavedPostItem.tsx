import Link from "next/link";
import AppImage, { noImageUrl } from "../shared/AppImage";
import { Post } from "@/firebase/post-v2";
import dayjs from "dayjs";
import Image from "next/image";
import { FaShare, FaStar } from "react-icons/fa6";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import useScreenSize from "@/hooks/useScreenSize";

export const VerifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={20}
    height={20}
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="#1976D2"
      d="M30 16a2.041 2.041 0 0 0-.76-1.592l-1.803-1.502.826-2.148a2.059 2.059 0 0 0-1.592-2.756l-2.313-.4-.36-2.273a2.06 2.06 0 0 0-2.756-1.592l-2.202.812-1.448-1.79a2.11 2.11 0 0 0-3.184 0l-1.502 1.804-2.148-.826A2.06 2.06 0 0 0 8.001 5.33l-.398 2.314L5.33 8a2.06 2.06 0 0 0-1.593 2.757l.812 2.203-1.79 1.447a2.06 2.06 0 0 0 0 3.184l1.804 1.502-.826 2.148a2.06 2.06 0 0 0 1.592 2.756l2.313.4.36 2.273a2.06 2.06 0 0 0 2.756 1.592l2.202-.812 1.448 1.79a2.06 2.06 0 0 0 3.184 0l1.502-1.804 2.148.826a2.06 2.06 0 0 0 2.757-1.592l.399-2.314L26.67 24a2.06 2.06 0 0 0 1.593-2.757l-.812-2.203 1.79-1.447A2.043 2.043 0 0 0 30 16z"
      data-original="#1976d2"
    />
    <path
      fill="#F5F5F5"
      d="M14.12 20.716a2.973 2.973 0 0 1-1.792-.595L9.9 18.3a1 1 0 1 1 1.2-1.6l2.428 1.821a1.007 1.007 0 0 0 1.39-.186l5.792-7.45a1 1 0 0 1 1.58 1.23l-5.794 7.448a3.008 3.008 0 0 1-2.376 1.153z"
      data-original="#f5f5f5"
    />
  </svg>
);

interface SavedPostItemProps {
  post: Post;
  isPending?: boolean;
  handleBookMark?: (bookmarked: boolean) => void;
}
export default function SavedPostItem({
  post,
  isPending,
  handleBookMark,
}: SavedPostItemProps) {
  const { isSmallScreen } = useScreenSize();
  return (
    <Link
      href={
        isSmallScreen ? "/?post_drawer_id=" + post?.id : "/posts/" + post?.id
      }
    >
      <div className="bg-[#f7f1ae] p-[4px_8px] md:p-[6px_10px] rounded-md h-full flex gap-2 flex-col">
        <div className="flex gap-2 items-stretch">
          <div className="h-full w-auto aspect-square rounded-md overflow-hidden basis-[25%] lg:basis-[30%]">
            <AppImage
              src={post?.snippetData?.image ?? noImageUrl}
              alt="No Image"
              className="object-cover w-full h-full"
              width={200}
              height={200}
            />
          </div>
          <div className="flex flex-col flex-1">
            <h3
              className="mb-1 lg:mb-1 text-[14px] lg:text-[17px] font-featureHeadline !leading-[120%]"
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              {post?.snippetData?.title ?? "Missing Post Title"}
            </h3>
            <p className="font-featureRegular text-[11px] lg:text-[14px] leading-[1.2] mb-1 flex-1 text-black text-opacity-70">
              {post.snippetData?.subTextVariants?.very_short ??
                post.snippetData?.content ??
                "No Content"}
            </p>
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-2 text-[11px] lg:text-[14px]">
                <AppImage
                  width={50}
                  height={50}
                  src={post?.author?.photoURL ?? noImageUrl}
                  alt="dp"
                  className="rounded-md w-[16px] h-[16px] lg:w-[23px] lg:h-[23px] object-cover"
                />
                <span>{post?.author?.name}</span>
                <VerifyIcon className="!w-[15px] !h-[15px]" />
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div>
                <span className=" text-[11px] lg:text-[14px]">
                  {dayjs(post?.timestamp).format("MMMM D, YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SavedPostItemV2({ post }: SavedPostItemProps) {
  const [removed, setRemoved] = useState(false);

  const handleRemove = () => {
    setRemoved(true);
  };

  return (
    <div
      className="font-featureRegular overflow-hidden"
      style={{
        maxHeight: removed ? "0px" : "450px",
        opacity: removed ? 0 : 1,
        transition: "opacity 300ms, max-height 300ms 300ms",
      }}
    >
      {/* Author */}
      <div className="flex items-center gap-3 mb-[16px] mt-[32px]">
        <div className="w-[20px] h-[20px]">
          <AppImage
            alt="sd"
            src={post.author?.photoURL ?? noImageUrl}
            className="w-full h-full object-cover rounded-full"
            width={20}
            height={20}
          />
        </div>
        <div>
          <span>{post.author.name}</span>
        </div>
      </div>
      {/* Post Content */}
      <div className="flex">
        {/* Post Text Content */}
        <div className="flex-1">
          <h2 className="text-[24px] leading-[30px] line-clamp-3 font-bold font-featureBold">
            {post.snippetData?.title}
          </h2>
          <div className="pt-[8px]">
            <p className="max-h-[40px] leading-[20px] line-clamp-2 text-[16px] text-[#6B6B6B] font-normal">
              {post.snippetData?.content}
            </p>
          </div>
          <div className="pt-[10px] flex items-center justify-between h-[48px]">
            <div className="flex items-center gap-3 text-xs text-appBlack">
              <span className="flex items-center gap-1">
                <FaStar className="text-[#d9c503] mb-0.5" />{" "}
                <span>5 min read</span>
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="uppercase">{post.topic}</span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span>2d ago</span>
            </div>
            <div className="flex items-center gap-3 text-base text-appBlack text-opacity-60">
              <span className="cursor-pointer" onClick={handleRemove}>
                <IoMdRemoveCircleOutline />
              </span>
              <span className="cursor-pointer">
                <FaShare />
              </span>
            </div>
          </div>
        </div>
        {/* Post Image */}
        <div className="ml-[50px] h-[107px] w-[160px] ">
          <AppImage
            alt="sd"
            src={post.snippetData?.image ?? noImageUrl}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-[4px] bg-gray-400"
          />
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a1f] mt-[20px]" />
    </div>
  );
}

export function SavedPostItemV3({ post }: SavedPostItemProps) {
  const handleRemove = () => {};
  return (
    <div className="w-[324px] h-[425px] flex flex-col pb-[50px]">
      <div
        className="w-full rounded-[4px] overflow-hidden"
        style={{ aspectRatio: 2 / 1 }}
      >
        <AppImage
          src={post.snippetData?.image ?? noImageUrl}
          alt="sdf"
          className="w-full h-full object-cover"
          width={350}
          height={200}
        />
      </div>
      {/* Author */}
      <div className="flex items-center gap-3 mb-[16px] mt-[24px]">
        <div className="w-[20px] h-[20px]">
          <AppImage
            alt="sd"
            src={post.author.photoURL}
            className="w-full h-full object-cover rounded-full"
            width={20}
            height={20}
          />
        </div>
        <div className="text-[13px] text-[#242424] flex items-center mb-[-4px]">
          <span>{post.author.name}</span>
        </div>
      </div>
      {/* Post Content */}
      {/* Post Text Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <h2 className="text-[20px] leading-[24px] line-clamp-3 font-bold font-featureBold">
            {post.snippetData?.title}
          </h2>
          <div className="pt-[8px]">
            <p className="max-h-[40px] line-clamp-2 text-[16px] leading-[20px] text-[#6B6B6B] font-normal">
              {post.snippetData?.content}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between h-[48px]">
          <div className="flex items-center gap-3 text-xs text-appBlack">
            <span className="flex items-center gap-1">
              <FaStar className="text-[#d9c503] mb-0.5" />{" "}
              <span>5 min read</span>
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <span className="uppercase">{post.topic}</span>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <span>2d ago</span>
          </div>
          <div className="flex items-center gap-3 text-base text-appBlack text-opacity-60">
            <span className="cursor-pointer" onClick={handleRemove}>
              <IoMdRemoveCircleOutline />
            </span>
            <span className="cursor-pointer">
              <FaShare />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
