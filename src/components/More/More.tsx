"use client";

import { useQueryPosts } from "@/api/post";
import { useMemo } from "react";
import { chunk } from "lodash";
import DesignedBlog from "../Blogs/DesignedBlog";
import useScreenSize from "@/hooks/useScreenSize";

export default function More({ limit = 5 }: { limit?: number }) {
  const { posts } = useQueryPosts({
    topics: ["more"],
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
      <div className="my-4 py-5">
        <div className="border-t-2 border-black">
          <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
            More
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

  return (
    <div className="my-4 py-5">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          More
        </h2>
        <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
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
                    <div
                      key={post.id}
                      className={j % 2 === 0 ? "pr-3" : "pl-3"}
                    >
                      <DesignedBlog
                        linkClassName={"h-full block"}
                        size="sm"
                        noImage={posts.length === 5}
                        post={post}
                        variant="long"
                        classNames={{
                          content:
                            posts.length !== 5
                              ? posts.length === 3
                                ? "h-[104px] !line-clamp-5"
                                : "h-[70px] overflow-hidden "
                              : "h-[140px] overflow-hidden !line-clamp-[7] ",
                        }}
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
                post={singlePost[0]}
                variant="medium"
                classNames={{
                  content: "!h-[104px] !line-clamp-5 ",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
