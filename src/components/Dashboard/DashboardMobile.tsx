"use client";
import Flagship from "@/components/Blogs/Flagship";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useMediaQuery } from "react-responsive";
import { Post, SnippetPosition } from "@/firebase/post-v2";
import { Post as PostV1 } from "@/firebase/post";
import { chunk, compact, difference, sortBy } from "lodash";
import { useEffect, useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useQueryPosts } from "@/api/post";
import { useQuerySignals } from "@/api/signal";
import { Signal } from "@/firebase/signal";
import { BlueSignalBlog } from "../Blogs/BlueCircleBlog";
import { Spinner } from "@nextui-org/spinner";
import useInView from "@/hooks/useInView";

export default function DashboardMobile({
  posts: _serverPosts,
  signals: _serverSignals,
}: {
  posts: any;
  signals: any;
}) {
  const {
    signals: _clientSignals,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useQuerySignals({ limit: 10 });

  const _serverFormedSignals = useMemo(() => {
    return _serverSignals.map(
      (data: any) =>
        new Signal(
          data.title,
          data.nodes,
          data.author,
          data.source,
          data.id,
          data.timestamp
        )
    );
  }, [_serverSignals]);

  const signals = (_clientSignals || _serverFormedSignals)?.slice(0, 10);
  const hasSignals = signals?.length > 0;

  const { posts } = useQueryPosts({
    initialData: _serverPosts.map((data: any) => {
      if (!data.sections && data.content) {
        return new PostV1(
          data.title,
          data.content,
          data.author,
          data.topic,
          data.id,
          data.timestamp,
          data.position,
          data.design,
          data.isFlagship,
          data.displayTitle,
          data.displayContent
        );
      }
      return new Post(
        data.title,
        data.author,
        data.topic,
        data.sections,
        data.status ?? "published",
        data.id,
        data.timestamp,
        data.position,
        data.design,
        data.displayTitle,
        data.displayContent,
        data.scheduledTime,
        data.is_v2,
        data.nodes
      );
    }),
  });

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
        (post) => !!post.snippetData?.image || !!post.meta?.image
      )
    ).slice(0, 12);

    const rightPosts = compact(
      difference(posts, [titlePost, ...midContentPosts])
    ).slice(0, 3);

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
        <Flagship title={(signals[0] as Signal).title} />
        <div className="pt-1 selection:md:pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-x-hidden">
          {signals.map((signal: Signal) => (
            <div
              key={signal.id}
              className="md:px-0 px-3 min-w-[170px] my-2 md:my-0"
            >
              <BlueSignalBlog signal={signal} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[15px] md:mt-0 md:border-x border-dashed border-[#1f1d1a4d] px-0 md:px-7">
        <DesignedBlog
          linkClassName="block"
          post={postsByPosition.titlePost as Post}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {postsByPosition.rightPosts?.map((post) => (
          <DesignedBlog
            size="sm"
            linkClassName="block"
            key={post.id}
            post={post}
          />
        ))}
      </div>
      <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]">
        {postsByPosition.midContentPosts?.map((postChunkOf2, i) => (
          <div
            key={i}
            className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] py-3"
          >
            {postChunkOf2.map((post, j) => (
              <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
                <DesignedBlog
                  linkClassName={"h-full block"}
                  size="sm"
                  post={post}
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
  );
}
