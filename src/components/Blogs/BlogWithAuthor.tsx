import { arrowSignalBlue, avatar, circlesBlue, imageOne } from "@/assets";
import { Post } from "@/firebase/post-v2";
import Image from "next/image";
import Link from "next/link";
import TrimmedPara from "../shared/TrimmedPara";
import BlogImage from "../shared/BlogImage";
import "react-medium-image-zoom/dist/styles.css";
import { FaStar } from "react-icons/fa6";
import { Tooltip } from "antd";
import { Spinner } from "@nextui-org/spinner";
import { SubTitleVariant } from "../AdminEditor/SubTitleComponent";
import { formatArticleTopic } from "@/lib/transformers/string";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AspectRatioType } from "../AdminEditor/ImageCropper";
import useScreenSize from "@/hooks/useScreenSize";

import {
  ShimmerButton,
  ShimmerTitle,
  ShimmerText,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerBadge,
  ShimmerTableCol,
  ShimmerTableRow,
  // @ts-ignore
} from "react-shimmer-effects";
import TrimmableText from "../shared/TrimmableText";

export interface BlogBaseProps {
  size?: "lg" | "sm";
  noLink?: boolean;
  post?: Post;
  linkClassName?: string;
  href?: string;
  noImage?: boolean;
  variant?: SubTitleVariant;
  classNames?: {
    content?: string;
    title?: string;
    h2?: string;
    h3?: string;
    img?: string;
  };
  aspectRatio?: AspectRatioType;
}

const defaultBlogWithAuthor = (size = "lg") => (
  <div className="py-3 group">
    <div className="flex">
      <div className="mr-2">
        <Image className="w-[38px] h-[38px]" src={avatar} alt="avatar" />
      </div>
      <div>
        <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
          Kadia Goba
        </h3>
        <p
          className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
          style={{
            fontWeight: "300",
            fontVariationSettings: '"wght" 400,"opsz" 10',
          }}
        >
          POLITICS
        </p>
      </div>
    </div>
    <hr className="border-dashed border-[#1f1d1a4d] my-4" />
    <div>
      <h2
        className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
        style={{
          fontSize: size === "sm" ? "24px" : "32px",
          fontWeight: "395",
          fontVariationSettings: '"wght" 495,"opsz" 10',
        }}
      >
        As Democrats double down on border bill, some progressives grow uneasy
      </h2>
      <p
        className="leading-[120%] group-hover:text-appBlue"
        style={{
          fontSize: size === "sm" ? "16px" : "18px",
          paddingTop: size === "sm" ? "8px" : "10px",
        }}
      >
        Senate Majority Leader Chuck Schumer is eager to put Republicans on
        defense with a vote on a bipartisan border bill. Not every Democrat is
        so excited.
      </p>
      <figure className="mt-2">
        <Image src={imageOne} alt="Image One" />
      </figure>
      <p
        className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
        style={{
          fontFamily: "Courier,monospace",
        }}
      >
        REUTERS/Leah Millis
      </p>
    </div>
  </div>
);

export default function BlogWithAuthor({
  size = "lg",
  post,
  noLink,
  linkClassName,
  showUnBookmarkButton,
  handleBookMark,
  href,
  isPending,
  classNames,
  noImage,
  variant = "medium",
  aspectRatio = "16 / 9",
}: BlogBaseProps & {
  post?: Post;
  showUnBookmarkButton?: boolean;
  handleBookMark?: (isBookmarked: boolean) => void;
  isPending?: boolean;
  href?: string;
}) {
  const router = useRouter();
  const { isSmallScreen } = useScreenSize();

  useEffect(() => {
    router.prefetch(href ?? `/posts/${post?.id}`);
  }, [href, router, post]);

  if (!post) return defaultBlogWithAuthor(size);

  const textContent =
    (variant === "very_short"
      ? post.snippetData?.subTextVariants?.very_short
      : variant === "short"
      ? post.snippetData?.subTextVariants?.short
      : variant === "medium"
      ? post.snippetData?.subTextVariants?.medium
      : variant === "long"
      ? post.snippetData?.subTextVariants?.long
      : post.snippetData?.content) ??
    post.snippetData?.content ??
    "";

  const thumbnailImage = post.getThumbnail(aspectRatio);

  console.log("thumbnailImage - ", thumbnailImage);

  const content = (
    <div className="py-3 group h-full flex flex-col">
      <div className="flex">
        <div className="mr-1 lg:mr-2 flex-shrink-0">
          <img
            className="w-[30px] h-[30px] lg:w-[38px] lg:h-[38px]"
            src={post.author.photoURL ?? avatar.src}
            alt="avatar"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="leading-[120%] text-[15px] lg:text-[17px] group-hover:text-appBlue w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {post.author.name}
          </h3>
          <p
            className={
              "leading-[120%] text-[13px] lg:text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase "
            }
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {isSmallScreen ? formatArticleTopic(post.topic) : post.topic}
          </p>
        </div>
        {showUnBookmarkButton && (
          <div className="flex-shrink-0 relative">
            <Tooltip title="Delete Bookmark">
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
            </Tooltip>
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
        )}
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className="flex-1 flex flex-col">
        {post.snippetData?.title && (
          <h2
            className={
              "font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation " +
              (classNames?.title ?? "") +
              (size === "sm"
                ? "text-[16px] lg:text-[18px]"
                : "text-[22px] lg:text-[32px]")
            }
            style={{
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {post.snippetData?.title}
          </h2>
        )}
        {textContent && (
          <div className="w-full flex-1">
            <TrimmableText
              text={textContent}
              paraClassName={
                "leading-[120%] group-hover:text-appBlue  " +
                (classNames?.content ?? "")
              }
              paraStyle={{
                fontSize: size === "sm" ? "16px" : "18px",
                paddingTop: size === "sm" ? "8px" : "10px",
              }}
            />
          </div>
          // <TrimmedPara
          //   className={
          //     "leading-[120%] opacity-80 group-hover:text-appBlue " +
          //     (classNames?.content ?? "") +
          //     (size === "sm"
          //       ? "text-[13px] lg:text-[15px]"
          //       : "text-[15px] lg:text-[18px]")
          //   }
          //   style={{
          //     paddingTop: size === "sm" ? "8px" : "10px",
          //   }}
          //   wordLimit={post.snippetData?.subTextVariants ? 350 : 70}
          // >
          //   {textContent}
          // </TrimmedPara>
        )}
        {/* {post.snippetData?.image && (
          <BlogImage className="mt-2" src={post.snippetData?.image} />
        )} */}
        {!post.snippetData?.image && post.snippetData?.iframe && (
          <iframe
            width="100%"
            src={post.snippetData?.iframe}
            className="mt-2 aspect-video"
          ></iframe>
        )}
      </div>
      {!noImage && thumbnailImage && (
        // <Zoom>
        //   <img
        //     onClick={(e: any) => {
        //       e.stopPropagation();
        //       e.preventDefault();
        //       // openPreview(src);
        //       // console.log("src - ", src);
        //     }}
        //     className="max-w-full max-h-full w-auto h-auto object-contain"
        //     src={post.snippetData?.image}
        //     alt="Image Preview"
        //   />
        // </Zoom>
        <BlogImage
          imageProps={{ className: "!w-full !object-cover !h-full" }}
          noZoom
          className={"mt-2 " + (classNames?.img ?? "")}
          src={thumbnailImage}
        />
      )}
      {/* <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p> */}
    </div>
  );

  return noLink ? (
    content
  ) : (
    <Link
      prefetch={true}
      className={linkClassName}
      href={href ?? `/posts/${post.id}`}
    >
      {content}
    </Link>
  );

  // return noLink ? content :  (
  //   <Link href={`/${post.id}`}>{content}</Link>
  // ) : (
  //   defaultBlogWithAuthor(size)
  // );
}

export function BlogWithAuthorShimmer({
  noImage,
  size = "lg",
}: {
  noImage?: boolean;
  size?: "lg" | "sm";
}) {
  return (
    <div className="py-3 group h-full flex flex-col">
      <div className="flex">
        <div className="mr-1 lg:mr-2 flex-shrink-0">
          <ShimmerThumbnail
            height={size === "sm" ? 30 : 45}
            width={size === "sm" ? 30 : 45}
            className="m-0 !mb-0 !min-w-[unset]"
            rounded
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {/* <h3 className="leading-[120%] text-[15px] lg:text-[17px] group-hover:text-appBlue w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {post.author.name}
          </h3> */}
          <ShimmerThumbnail
            height={size === "sm" ? 10 : 15}
            width={size === "sm" ? 90 : 120}
            variant="secondary"
            rounded
            className="!mb-0"
          />
          <ShimmerThumbnail
            height={size === "sm" ? 10 : 15}
            width={size === "sm" ? 90 : 120}
            variant="secondary"
            rounded
            className="!mb-0"
          />
          {/* <p
            className={
              "leading-[120%] text-[13px] lg:text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase "
            }
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {isSmallScreen ? formatArticleTopic(post.topic) : post.topic}
          </p> */}
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className="flex-1">
        <ShimmerTitle line={size === "sm" ? 1 : 2} gap={10} variant="primary" />
        <ShimmerText line={size === "sm" ? 3 : 5} gap={10} variant="primary" />
      </div>
      {!noImage && (
        <ShimmerThumbnail
          height={size === "sm" ? 180 : 315}
          width={"100%"}
          className="m-0 !mb-0"
          rounded
        />
      )}
      {/* <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p> */}
    </div>
  );
}

const defaultBlogWithAuthorV2 = (size = "lg", noImage = false) => (
  <div className="py-3 group">
    <div className="flex">
      {/* <div className="mr-2">
          <Image className="w-[38px] h-[38px]" src={avatar} alt="avatar" />
        </div> */}
      <div>
        <h3 className="leading-[120%] group-hover:text-appBlue text-[17px]">
          Kadia Goba
        </h3>
        <p
          className="leading-[120%] text-[15px] group-hover:text-appBlue text-tertiary font-helvetica uppercase"
          style={{
            fontWeight: "300",
            fontVariationSettings: '"wght" 400,"opsz" 10',
          }}
        >
          POLITICS
        </p>
      </div>
    </div>
    <hr className="border-dashed border-[#1f1d1a4d] my-4" />
    <div>
      <Image
        src={circlesBlue}
        alt="circles blue"
        className="w-[21px] h-[17px] float-left mt-[4px] mr-[5px]"
      />
      <h2
        className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
        style={{
          fontSize: size === "sm" ? "24px" : "32px",
          fontWeight: "395",
          fontVariationSettings: '"wght" 495,"opsz" 10',
        }}
      >
        As Democrats double down on border bill, some progressives grow uneasy
      </h2>
      <p
        className="leading-[120%] group-hover:text-appBlue"
        style={{
          fontSize: size === "sm" ? "16px" : "18px",
          paddingTop: size === "sm" ? "8px" : "10px",
        }}
      >
        Senate Majority Leader Chuck Schumer is eager to put Republicans on
        defense with a vote on a bipartisan border bill. Not every Democrat is
        so excited.
      </p>
      <div className="flex mt-3">
        <Image
          src={arrowSignalBlue}
          alt="circles blue"
          className="w-[16px] h-[13px] mr-[8px]"
        />
        <h2
          className="leading-[120%] font-helvetica text-appBlue text-[15px]"
          style={{
            fontWeight: "395",
            fontVariationSettings: '"wght" 495,"opsz" 10',
          }}
        >
          UK&apos;s infected blood scandal exacerbated by &apos;chilling&apos;
          cover-up, inquiry finds{" "}
        </h2>
      </div>
      {!noImage && (
        <>
          <figure className="mt-2">
            <Image src={imageOne} alt="Image One" />
          </figure>
          <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p>
        </>
      )}
    </div>
  </div>
);

export function BlogWithAuthorV2({
  size = "lg",
  post,
  noImage,
  noLink,
  href,
  linkClassName,
  classNames,
  aspectRatio = "4 / 3",
  variant = "medium",
}: BlogBaseProps & { post?: Post; noImage?: boolean }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href ?? `/posts/${post?.id}`);
  }, [href, router, post]);

  if (!post) return defaultBlogWithAuthorV2(size, noImage);

  const textContent =
    (variant === "very_short"
      ? post.snippetData?.subTextVariants?.very_short
      : variant === "short"
      ? post.snippetData?.subTextVariants?.short
      : variant === "medium"
      ? post.snippetData?.subTextVariants?.medium
      : variant === "long"
      ? post.snippetData?.subTextVariants?.long
      : post.snippetData?.content) ??
    post.snippetData?.content ??
    "";

  const thumbnailImage = post.getThumbnail(aspectRatio);

  const content = (
    <div className="py-3 group h-full flex flex-col ">
      <div className="flex">
        {post.author.photoURL && (
          <div className="mr-2">
            <img
              className="w-[38px] h-[38px]"
              src={post.author.photoURL}
              alt="avatar"
            />
          </div>
        )}
        <div>
          <h3 className="leading-[120%] group-hover:text-appBlue text-[17px]">
            {post.author.name}
          </h3>
          <p
            className={
              "leading-[120%] text-[15px] group-hover:text-appBlue text-tertiary font-helvetica uppercase "
            }
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {formatArticleTopic(post.topic)}
          </p>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className="flex-1">
        <Image
          src={circlesBlue}
          alt="circles blue"
          className="w-[21px] h-[17px] float-left mt-[4px] mr-[5px]"
        />
        {post.snippetData?.title && (
          <h2
            className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: size === "sm" ? "24px" : "32px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {post.snippetData?.title}
          </h2>
        )}
        {/* {textContent && (
          <TrimmedPara
            className={
              "leading-[120%] group-hover:text-appBlue  " +
              (classNames?.content ?? "")
            }
            style={{
              fontSize: size === "sm" ? "16px" : "18px",
              paddingTop: size === "sm" ? "8px" : "10px",
            }}
            wordLimit={post.snippetData?.subTextVariants ? 350 : 70}
          >
            {textContent}
          </TrimmedPara>
        )} */}
        {textContent && (
          <div className="w-full flex-1">
            <TrimmableText
              text={textContent}
              paraClassName={
                "leading-[120%] group-hover:text-appBlue  " +
                (classNames?.content ?? "")
              }
              paraStyle={{
                fontSize: size === "sm" ? "16px" : "18px",
                paddingTop: size === "sm" ? "8px" : "10px",
              }}
            />
          </div>
        )}
        {post.snippetData?.quote && (
          <div className="flex mt-3">
            <Image
              src={arrowSignalBlue}
              alt="circles blue"
              className="w-[16px] h-[13px] mr-[8px]"
            />

            <h2
              className="leading-[120%] font-helvetica text-appBlue text-[15px]"
              style={{
                fontWeight: "395",
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              {post.snippetData?.quote}
            </h2>
          </div>
        )}
        {/* <figure className="mt-2">
          <Image src={imageOne} alt="Image One" />
        </figure>
        <p
          className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
          style={{
            fontFamily: "Courier,monospace",
          }}
        >
          REUTERS/Leah Millis
        </p> */}
      </div>
      {!noImage && thumbnailImage && (
        <>
          {/* <Zoom>
            <img
              onClick={(e: any) => {
                e.stopPropagation();
                e.preventDefault();
                // openPreview(src);
                // console.log("src - ", src);
              }}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              src={thumbnailImage}
              alt="Image Preview"
            />
          </Zoom> */}
          <BlogImage
            imageProps={{ className: "!w-full !object-cover !h-full" }}
            noZoom
            className="mt-2"
            src={thumbnailImage}
          />
        </>
      )}
      {/* {thumbnailImage && (
        <Zoom>
          <img
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
              // openPreview(src);
              // console.log("src - ", src);
            }}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            src={post.snippetData?.image}
            alt="Image Preview"
          />
        </Zoom>
      )} */}
      {/* <p
            className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
            style={{
              fontFamily: "Courier,monospace",
            }}
          >
            REUTERS/Leah Millis
          </p> */}
    </div>
  );

  return noLink ? (
    content
  ) : (
    <Link className={linkClassName} href={href ?? `/posts/${post.id}`}>
      {content}
    </Link>
  );
}
