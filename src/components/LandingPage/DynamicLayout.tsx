"use client";

import { useQueryPosts } from "@/api/post";
import { useMemo } from "react";
import { chunk, compact, difference, sortBy } from "lodash";
import DesignedBlog from "../Blogs/DesignedBlog";
import useScreenSize from "@/hooks/useScreenSize";
import { BlogBaseProps, BlogWithAuthorShimmer } from "../Blogs/BlogWithAuthor";
import { Post } from "@/firebase/post-v2";
import { avatar } from "@/assets";
import { Tooltip } from "antd";
import { FaStar } from "react-icons/fa6";
import { Spinner } from "@nextui-org/spinner";
import TrimmedPara from "../shared/TrimmedPara";
import BlogImage from "../shared/BlogImage";
import Link from "next/link";
import { SnippetPosition } from "@/firebase/post";
import { breakdownArray } from "@/lib/transformers/array";
import PostSection from "./PostSection";

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

export default function DynamicLayout({
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
  const { posts, isLoading } = useQueryPosts({
    topics,
    limit,
  });
  const { isSmallScreen } = useScreenSize();

  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    return chunk(posts, 2);
  }, [posts]);

  const singlePost =
    posts.length > 1 && chunkedPosts.find((post) => post.length === 1);
  const onlyPost = posts.length === 1 && posts[0];

  let content = null;

  const postsByPosition = useMemo(() => {
    if (!posts) {
      return {
        titlePost: null,
        rightPosts: [],
        midContentPosts: [],
        listPosts: [],
      };
    }

    const titlePost = posts.find(
      (post: any) => !!post.snippetData?.image || !!post.meta?.image
    );

    const midContentPosts = compact(
      difference(posts, [titlePost])?.filter(
        // @ts-ignore
        (post) => !!post?.snippetData?.image || !!post?.meta?.image
      )
    ).slice(0, 2);

    const rightPosts = compact(
      difference(posts, [titlePost, ...midContentPosts])
    ).slice(0, 2);

    const leftPosts = compact(
      difference(posts, [titlePost, ...midContentPosts, ...rightPosts])
    ).slice(0, 2);

    const listPosts = compact(
      difference(posts, [
        ...[titlePost],
        ...rightPosts,
        ...leftPosts,
        ...midContentPosts,
      ])
    );

    return {
      titlePost,
      rightPosts: sortBy(rightPosts ?? [], "post.timestamp"),
      midContentPosts: chunk(
        sortBy(midContentPosts ?? [], "post.timestamp"),
        2
      ),
      leftPosts: sortBy(leftPosts ?? [], "post.timestamp"),
      listPosts: breakdownArray(sortBy(listPosts ?? [], "post.timestamp")),
    };
  }, [posts]);

  return (
    <div className={"my-4 py-5 " + (classNames.base ?? "")}>
      <div className={"border-t-2 border-black " + (classNames.wrapper ?? "")}>
        <h2 className="font-featureHeadline lg:text-[40px] md:text-[30px] text-[26px] leading-[120%] pt-1">
          {label}
        </h2>
        <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
        <div className="grid grid-cols-1 md:grid-cols-[25%_46%_29%] relative mt-4">
          <div className="px-0 md:pr-4 lg:pr-7 md:pl-0 py-2">
            {/* <div className="mt-5">
          <UpcomingEventSection />
        </div> */}

            <div className="grid grid-cols-1 gap-4">
              {postsByPosition.leftPosts?.map((post) => (
                <DesignedBlog
                  size="sm"
                  linkClassName="block"
                  key={post.id}
                  post={post}
                  variant="short"
                />
              ))}
            </div>
          </div>
          <div className="mt-[15px] md:mt-0 md:border-x py-2 border-dashed border-[#1f1d1a4d] px-0 md:px-4 lg:px-10">
            {postsByPosition.titlePost && (
              <DesignedBlog
                linkClassName="block"
                post={postsByPosition.titlePost as Post}
                variant="short"
                classNames={{
                  wrapper: "!h-auto",
                }}
                imageProps={{
                  width: 650,
                  height: 500,
                  // @ts-ignore
                  priority: true,
                  layout: "responsive",
                }}
              />
            )}
            <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
              {postsByPosition.midContentPosts?.map((postChunkOf2, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
                >
                  {postChunkOf2.map((post, j) => (
                    <div
                      key={post.id}
                      className={j % 2 === 0 ? "pr-3" : "pl-3"}
                    >
                      <DesignedBlog
                        linkClassName={"h-full block"}
                        size="sm"
                        post={post}
                        variant="short"
                      />
                    </div>
                  ))}
                </div>
              ))}
              {/* <div className="pr-3">
            <BlogWithAuthorV2 size="sm" />
          </div>
          <div className="pl-3">
            <BlogWithAuthor size="sm" />
          </div> */}
            </div>
          </div>
          <div className="px-0 md:pl-4 lg:pl-7 md:pr-0 py-2">
            {/* <div className="mt-5">
          <UpcomingEventSection />
        </div> */}

            <div className="grid grid-cols-1 gap-4">
              {postsByPosition.rightPosts?.map((post) => (
                <DesignedBlog
                  size="sm"
                  linkClassName="block"
                  key={post.id}
                  post={post}
                  variant="short"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        {postsByPosition.listPosts?.map((postChunk, i) => (
          <PostSection key={i} posts={postChunk} />
        ))}
      </div>
    </div>
  );
}
