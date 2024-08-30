"use client";

import { useQueryPosts } from "@/api/post";
import { useMemo } from "react";
import { chunk } from "lodash";
import DesignedBlog from "../Blogs/DesignedBlog";
import useScreenSize from "@/hooks/useScreenSize";
import { BlogBaseProps } from "../Blogs/BlogWithAuthor";
import { Post } from "@/firebase/post-v2";
import { avatar } from "@/assets";
import { Tooltip } from "antd";
import { FaStar } from "react-icons/fa6";
import { Spinner } from "@nextui-org/spinner";
import TrimmedPara from "../shared/TrimmedPara";
import BlogImage from "../shared/BlogImage";
import Link from "next/link";

function BlogWithAuthorSide({
  size = "lg",
  post,
  noLink,
  linkClassName,
  showUnBookmarkButton,
  handleBookMark,
  href,
  isPending,
  classNames,
  variant,
  noImage,
}: BlogBaseProps & {
  post?: Post;
  showUnBookmarkButton?: boolean;
  handleBookMark?: (isBookmarked: boolean) => void;
  isPending?: boolean;
  href?: string;
}) {
  if (!post) return;

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
            {post.topic}
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
      <div className="flex-1 flex justify-between gap-3">
        <div className="w-[75%]">
          {post.snippetData?.title && (
            <h2
              className={
                "font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation " +
                (size === "sm"
                  ? "text-[18px] lg:text-[20px]"
                  : "text-[28px] lg:text-[32px]")
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
            <TrimmedPara
              className={
                "leading-[120%] group-hover:text-appBlue  " +
                (classNames?.content ?? "") +
                (size === "sm"
                  ? "text-[12px] lg:text-[14px]"
                  : "text-[16px] lg:text-[18px]")
              }
              style={{
                paddingTop: size === "sm" ? "8px" : "10px",
              }}
              wordLimit={500}
            >
              {textContent}
            </TrimmedPara>
          )}
        </div>
        {!noImage && post.snippetData?.image && (
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
            className="mt-2 w-[36%] rounded-[6px]"
            src={post.snippetData?.image}
          />
        )}
      </div>
    </div>
  );

  return noLink ? (
    content
  ) : (
    <Link className={linkClassName} href={href ?? `/posts/${post.id}`}>
      {content}
    </Link>
  );

  // return noLink ? content :  (
  //   <Link href={`/${post.id}`}>{content}</Link>
  // ) : (
  //   defaultBlogWithAuthor(size)
  // );
}

type topicId =
  | "product-management"
  | "artificial-intelligence"
  | "technology"
  | "silicon-valley"
  | "more";

type label =
  | "Product Management"
  | "Artificial Intelligence"
  | "Technology"
  | "Silicon Valley"
  | "More";

export default function LandingPageSectionLayout({
  limit = 5,
  classNames = {},
  label,
  topics,
}: {
  limit?: number;
  classNames?: { base?: string; wrapper?: string };
  label: label;
  topics: topicId[];
}) {
  const { posts } = useQueryPosts({
    topics,
    limit,
  });
  const { isSmallScreen } = useScreenSize();

  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    return chunk(posts, 2);
  }, [posts]);

  if (!posts || posts?.length === 0) return null;

  if (isSmallScreen)
    return (
      <div className={"my-4 py-5 " + (classNames.base ?? "")}>
        <div
          className={"border-t-2 border-black " + (classNames.wrapper ?? "")}
        >
          <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
            {label}
          </h2>
          <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] py-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d]">
            <div className="pr-0 md:pr-3 divide-y divide-dashed divide-[#1f1d1a4d]">
              {chunkedPosts?.map((postChunkOf2, i) => {
                const gridClassName =
                  postChunkOf2.length === 1 ? "grid-cols-1" : "grid-cols-2";
                return (
                  <div
                    key={i}
                    className={
                      "grid divide-x divide-dashed divide-[#1f1d1a4d] py-3 " +
                      gridClassName
                    }
                  >
                    {postChunkOf2.map((post: any, j) => (
                      <div
                        key={post.id}
                        className={j % 2 === 0 ? "pr-3" : "pl-3"}
                      >
                        <DesignedBlog
                          linkClassName={"h-full block"}
                          size="sm"
                          post={post}
                          variant={
                            postChunkOf2.length === 1 ? "short" : "very_short"
                          }
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );

  const singlePost =
    posts.length > 1 && chunkedPosts.find((post) => post.length === 1);
  const onlyPost = posts.length === 1 && posts[0];

  let content = null;

  if (posts.length === 2) {
    content = (
      <div
        className={
          "grid divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-2 pt-4 "
        }
      >
        {posts.map((post: any, j) => (
          <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
            <BlogWithAuthorSide
              linkClassName={"h-full block"}
              size="sm"
              variant="long"
              noImage={posts.length === 5}
              post={post}
            />
          </div>
        ))}
      </div>
    );
  } else if (posts.length === 4) {
    content = (
      <div
        className={
          "grid divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-4 pt-4"
        }
      >
        {posts.map((post: any, j) => (
          <div key={post.id} className={"px-3"}>
            <DesignedBlog
              linkClassName={"h-full block"}
              size="sm"
              noImage={posts.length === 5}
              post={post}
              variant="short"
              classNames={{
                // content: "h-[80px] overflow-hidden !line-clamp-[4] ",
                // title: "!line-clamp-3 ",
                img: "!aspect-[16/10]",
              }}
            />
          </div>
        ))}
      </div>
    );
  } else {
    content = (
      <div
        className={
          "grid py-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] " +
          (singlePost ? "grid-cols-[2fr_1fr]" : "grid-cols-1")
        }
      >
        <div className="pr-0 md:pr-3 divide-y divide-dashed divide-[#1f1d1a4d]">
          {chunkedPosts?.map((postChunkOf2, i) => {
            // const gridClassName =
            //   postChunkOf2.length === 1 ? "grid-cols-1" : "grid-cols-2";
            if (postChunkOf2.length === 1 && !onlyPost) return;
            return (
              <div
                key={i}
                className={
                  "grid divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-2 " +
                  (posts.length === 3 ? "h-full" : i === 1 ? "pt-3" : "pb-3")
                }
              >
                {postChunkOf2.map((post: any, j) => (
                  <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                    <DesignedBlog
                      linkClassName={"h-full block"}
                      size="sm"
                      noImage={posts.length === 5}
                      post={post}
                      variant="long"
                      classNames={
                        {
                          // content:
                          //   posts.length !== 5
                          //     ? posts.length === 3
                          //       ? "h-[104px] !line-clamp-5"
                          //       : "h-[70px] overflow-hidden "
                          //     : "h-[140px] overflow-hidden !line-clamp-[7] ",
                        }
                      }
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {singlePost && (
          <div className="pl-3 divide-y divide-dashed divide-[#1f1d1a4d]">
            <DesignedBlog
              linkClassName={"h-full block"}
              size="sm"
              variant="medium"
              post={singlePost[0]}
              classNames={
                {
                  // content: "!h-[104px] !line-clamp-5 ",
                }
              }
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={"my-4 py-5 " + (classNames.base ?? "")}>
      <div className={"border-t-2 border-black " + (classNames.wrapper ?? "")}>
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          {label}
        </h2>
        <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
        {content}
      </div>
    </div>
  );
}
