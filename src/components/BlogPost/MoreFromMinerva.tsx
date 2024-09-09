"use client";

import { useGetPostsByCategory, useGetRecentPosts } from "@/api/post";
import { ampersandImage, avatar } from "@/assets";
import { chunk, sortBy } from "lodash";
import Image from "next/image";
import { ReactNode, useMemo } from "react";
import { Post } from "@/firebase/post-v2";
import TrimmedPara from "../shared/TrimmedPara";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";
import { useParams } from "next/navigation";
import { trimToSentence } from "@/lib/transformers/trimToSentence";
import useScreenSize from "@/hooks/useScreenSize";
import { AspectRatioType } from "../AdminEditor/ImageCropper";
import BlogImage from "../shared/BlogImage";
import TrimmableText from "../shared/TrimmableText";
import DesignedBlog from "../Blogs/DesignedBlog";

function MinervaBlogPost({
  post,
  noImage,
  aspectRatio = "16 / 9",
}: {
  post: Post;
  noImage?: boolean;
  aspectRatio?: AspectRatioType;
}) {
  const wrapper = (children: ReactNode) => (
    <div className="pb-[10px] group">{children}</div>
  );

  const trimmedTitle = useMemo(
    () => trimToSentence(post?.snippetData?.title ?? "", 20),
    [post?.snippetData?.title]
  );

  const textContent =
    post.snippetData?.subTextVariants?.short ?? post.snippetData?.content ?? "";

  const thumbnailImage = post.getThumbnail(aspectRatio);

  const thumbnailBlurData = post.getThumbnailData(aspectRatio)?.blurData;

  const content = (
    <>
      <div className="flex">
        <div className="mr-2">
          <img
            className="w-[38px] h-[38px]"
            src={post.author.photoURL ?? avatar.src}
            alt="avatar"
          />
        </div>
        <div>
          <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
            {post.author.name}
          </h3>
          <p
            className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
            style={{
              fontWeight: "300",
              fontVariationSettings: '"wght" 400,"opsz" 10',
            }}
          >
            {post.topic}
          </p>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-3" />
      <div>
        {post.snippetData?.title && (
          <h2
            className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: "22px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            {trimmedTitle}
          </h2>
        )}
        {textContent && (
          <div className="w-full flex-1">
            <TrimmableText
              text={textContent}
              paraClassName={
                "leading-[120%] group-hover:text-appBlue opacity-70  "
              }
              paraStyle={{
                fontSize: "16px",
                paddingTop: "8px",
              }}
            />
          </div>
        )}
        {!noImage && thumbnailImage && (
          <BlogImage
            imageProps={{
              className: "!w-full !object-cover !h-full",
              // @ts-ignore
              blurDataURL: thumbnailBlurData,
              placeholder: "blur",
            }}
            noZoom
            className={"mt-2 "}
            src={thumbnailImage}
          />
        )}
      </div>
    </>
  );

  return wrapper(<Link href={`/posts/${post.id}`}>{content}</Link>);

  // return noLink ? content :  (
  //   <Link href={`/${post.id}`}>{content}</Link>
  // ) : (
  //   defaultBlogWithAuthor(size)
  // );
}

interface MoreFromMinervaProps {}
export default function MoreFromMinerva(props: MoreFromMinervaProps) {
  const { data: posts, error, isLoading } = useGetRecentPosts();
  const params = useParams();
  const { isSmallScreen } = useScreenSize();

  const chunkedPosts = useMemo(() => {
    const _posts = posts
      ?.filter((post) => post.id !== params?.postId?.[0])
      .slice(0, 4);
    return _posts;
    // return chunk(_posts ?? [], 2);
  }, [params?.postId, posts]);

  const hasNoPosts = !isLoading && !posts?.length;

  return (
    !hasNoPosts && (
      <div>
        <hr
          style={{
            margin: isSmallScreen ? "35px 0 0" : "60px 0 0",
            borderColor: "#1f1d1a",
            borderBottom: 0,
          }}
        />
        <hr
          style={{
            margin: "2px 0 10px",
            borderColor: "#1f1d1a",
            borderBottom: 0,
          }}
        />
        <div className="styles_title flex items-center gap-3 !mb-4">
          <Image src={ampersandImage} width={20} height={16} alt="Ampersand" />
          <h2 style={{ marginBottom: 0, marginTop: "4px" }}>
            More from Minerva
          </h2>
        </div>
        {!isLoading ? (
          <div className="grid grid-cols-4 divide-x divide-dashed divide-[#1f1d1a4d]">
            {chunkedPosts?.map((post, j) => (
              <div key={post.id} className={"px-3"}>
                <DesignedBlog size="sm" post={post as any} variant="short" />
              </div>
            ))}
            {/* <div className="pr-3">
            <BlogWithAuthorV2 size="sm" />
          </div>
          <div className="pl-3">
            <BlogWithAuthor size="sm" />
          </div> */}
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Spinner
              size="lg"
              classNames={{
                circle1: "blue-border-b",
                circle2: "blue-border-b",
              }}
            />
          </div>
        )}
      </div>
    )
  );
}
