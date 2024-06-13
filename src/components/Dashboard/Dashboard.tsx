"use client";
import Flagship from "@/components/Blogs/Flagship";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useMediaQuery } from "react-responsive";
import { Post, SnippetPosition } from "@/firebase/post";
import { chunk, compact, difference, sortBy } from "lodash";
import { useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useQueryPosts } from "@/api/post";

export default function Dashboard({ posts: _serverPosts }: { posts: any }) {
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const { data: posts } = useQueryPosts({
    initialData: _serverPosts.map(
      (data: any) =>
        new Post(
          data.title,
          data.content,
          data.author,
          data.topic,
          data.id,
          data.timestamp,
          data.position,
          data.design,
          data.isFlagship
        )
    ),
  });

  // const serverPosts = useMemo(() => {
  //   if (!_serverPosts) return [];

  //   console.log("_serverPosts - ", _serverPosts);

  //   return _serverPosts.map(
  //     (data: any) =>
  //       new Post(
  //         data.title,
  //         data.content,
  //         data.author,
  //         data.topic,
  //         data.id,
  //         data.timestamp,
  //         data.position,
  //         data.design,
  //         data.isFlagship
  //       )
  //   );
  // }, [_serverPosts]);

  // const posts = _posts ?? serverPosts;

  console.log("posts - ", posts);

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
      (post: any) => post.snippetPosition === SnippetPosition.TITLE
    );

    const rightPosts = compact(
      difference(posts, [titlePost])?.filter(
        (post) =>
          post?.snippetPosition === SnippetPosition.RIGHT ||
          post?.snippetPosition === SnippetPosition.TITLE
      )
    ).slice(0, 2);

    const midContentPosts = compact(
      difference(posts, [...[titlePost], ...rightPosts])?.filter(
        (post) =>
          post?.snippetPosition === SnippetPosition.MID_CONTENT ||
          post?.snippetPosition === SnippetPosition.RIGHT ||
          post?.snippetPosition === SnippetPosition.TITLE
      )
    ).slice(0, 12);

    const listPosts = compact(
      difference(posts, [
        ...[titlePost],
        ...rightPosts,
        ...midContentPosts,
      ])?.filter((post) => post?.snippetPosition === SnippetPosition.LEFT)
    );

    return {
      titlePost,
      rightPosts: sortBy(rightPosts ?? [], "post.timestamp"),
      midContentPosts: chunk(
        sortBy(midContentPosts ?? [], "post.timestamp"),
        2
      ),
      listPosts: sortBy(listPosts ?? [], "post.timestamp"),
    };
  }, [posts]);

  // const oldPosts = chunk(
  //   [...(fullCPosts?.slice(2) ?? []), ...(fullQPosts ?? [])],
  //   2
  // );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[21%_54%_25%] py-2">
      <div className="pr-0 md:pr-7">
        <Flagship />
        <div className="pt-1 selection:md:pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-x-hidden">
          {postsByPosition.listPosts.map((post, i) => (
            <div
              key={post.id}
              className="md:px-0 px-3 min-w-[170px] my-2 md:my-0"
            >
              <DesignedBlog post={post} />
            </div>
          ))}
        </div>
      </div>
      <div className="md:border-x border-dashed border-[#1f1d1a4d] px-3 md:px-7">
        <DesignedBlog post={postsByPosition.titlePost as Post} />
        <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
          {postsByPosition.midContentPosts?.map((postChunkOf2, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
            >
              {postChunkOf2.map((post, j) => (
                <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                  <DesignedBlog size="sm" post={post} />
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
      <div className="px-3 md:pl-7 md:pr-0">
        {postsByPosition.rightPosts?.map((post) => (
          <DesignedBlog key={post.id} post={post} />
        ))}
        {/* <BlogWithAuthor post={fullCPosts?.[1]} size="sm" /> */}
        {!isTabletScreen && (
          <div>
            <SignUpForNewsLetters />
          </div>
        )}
      </div>
    </div>
  );
}
