import Link from "next/link";
import AppImage, { noImageUrl } from "../shared/AppImage";
import { Post } from "@/firebase/post-v2";
import dayjs from "dayjs";
import Image from "next/image";
import { FaShare, FaStar } from "react-icons/fa6";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";

const VerifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#5ECBF1"
      d="M13.93 5.78a.56.56 0 0 1-.17-.4V3.8a1.562 1.562 0 0 0-1.56-1.56h-1.58a.561.561 0 0 1-.4-.17L9.11.96a1.575 1.575 0 0 0-2.22 0L5.78 2.07a.561.561 0 0 1-.4.17H3.8A1.562 1.562 0 0 0 2.24 3.8v1.58a.56.56 0 0 1-.17.4L.96 6.89a1.575 1.575 0 0 0 0 2.22l1.11 1.11a.56.56 0 0 1 .17.4v1.58a1.562 1.562 0 0 0 1.56 1.56h1.58a.561.561 0 0 1 .4.17l1.11 1.11a1.57 1.57 0 0 0 2.22 0l1.11-1.11a.561.561 0 0 1 .4-.17h1.58a1.562 1.562 0 0 0 1.56-1.56v-1.58a.56.56 0 0 1 .17-.4l1.11-1.11a1.575 1.575 0 0 0 0-2.22zm-3.58 1.24L7.69 9.69a.52.52 0 0 1-.71 0L5.65 8.35a.495.495 0 0 1 .7-.7l.98.98 2.32-2.32a.501.501 0 0 1 .7 0 .495.495 0 0 1 0 .71z"
      data-original="#5ecbf1"
    />
    <path
      fill="#4793FF"
      d="M13.93 5.78a.56.56 0 0 1-.17-.4V3.8a1.562 1.562 0 0 0-1.56-1.56h-1.58a.561.561 0 0 1-.4-.17L9.11.96A1.565 1.565 0 0 0 8 .502V7.96l1.65-1.65a.501.501 0 0 1 .7 0 .495.495 0 0 1 0 .71L8 9.379V15.5a1.559 1.559 0 0 0 1.11-.46l1.11-1.11a.561.561 0 0 1 .4-.17h1.58a1.562 1.562 0 0 0 1.56-1.56v-1.58a.56.56 0 0 1 .17-.4l1.11-1.11a1.575 1.575 0 0 0 0-2.22z"
      data-original="#4793ff"
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
  return (
    <Link href={"/posts/" + post?.id}>
      <div className="flex gap-2 bg-[#f7f1ae] p-[4px_8px] items-stretch rounded-md">
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
            className="mb-0 lg:mb-1 text-[17px] lg:text-lg font-featureHeadline"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            {post?.snippetData?.title ?? "Missing Post Title"}
          </h3>
          <p className="font-featureRegular line-clamp-4 text-[11px] lg:text-[14px] leading-[1.2] mb-1 flex-1">
            {post?.snippetData?.content}
          </p>
          <div className="flex items-center gap-2">
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
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex-1 flex justify-end items-center flex-shrink-0 relative">
              <FaStar
                className={
                  "text-[#d9c503] cursor-pointer " +
                  (isPending ? "opacity-0" : "opacity-100")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleBookMark?.(false);
                }}
              />
              {isPending && (
                <Spinner
                  size="sm"
                  classNames={{
                    circle1: "!border-b-appBlack",
                    circle2: "!border-b-appBlack",
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              )}
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
