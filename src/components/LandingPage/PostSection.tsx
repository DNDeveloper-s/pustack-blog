import { chunk } from "lodash";
import DesignedBlog from "../Blogs/DesignedBlog";
import { BlogWithAuthorSide } from "./LandingPageSectionLayout";
import { useMemo } from "react";

interface PostSectionProps {
  posts: any[];
}
export default function PostSection({ posts }: PostSectionProps) {
  let content = null;

  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    return chunk(posts, 2);
  }, [posts]);

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
              post={post}
            />
          </div>
        ))}
      </div>
    );
  } else if (posts.length === 3) {
    content = (
      <div
        className={
          "grid divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-3 pt-4 "
        }
      >
        {posts.map((post: any, j) => (
          <div key={post.id} className={"px-3"}>
            <DesignedBlog
              linkClassName={"h-full block"}
              size="sm"
              post={post}
              variant="short"
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
            />
          </div>
        ))}
      </div>
    );
  } else if (posts.length === 5) {
    const singlePost =
      posts.length > 1 && chunkedPosts.find((post) => post.length === 1);
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
            if (postChunkOf2.length === 1) return;
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
                      variant={posts.length === 5 ? "long" : "short"}
                      classNames={{
                        content: "!max-h-[140px]",
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
              variant="medium"
              post={singlePost[0]}
              classNames={{
                content: "!max-h-[130px]",
              }}
            />
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <div
        className={
          "grid divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-3 pt-4"
        }
      >
        {posts.map((post: any, j) => (
          <div key={post.id} className={"px-3"}>
            <DesignedBlog
              linkClassName={"h-full block"}
              size="sm"
              post={post}
              variant="short"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={"py-3"}>
      <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
      {content}
    </div>
  );
}


export function PostMobileSection({ posts }: PostSectionProps) {
  let content = null;

  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    return chunk(posts, 2);
  }, [posts]);

  content = (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] py-2 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d]">
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
                <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                  <DesignedBlog
                    href={`/?post_drawer_id=${post.id}`}
                    linkClassName={"h-full block"}
                    size="sm"
                    post={post}
                    variant={postChunkOf2.length === 1 ? "short" : "very_short"}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={"py-3"}>
      <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
      {content}
    </div>
  );
}
