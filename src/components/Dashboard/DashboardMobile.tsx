"use client";
import Flagship from "@/components/Blogs/Flagship";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useMediaQuery } from "react-responsive";
import { Post, SnippetPosition } from "@/firebase/post-v2";
import { Post as PostV1 } from "@/firebase/post";
import { chunk, compact, difference, sortBy } from "lodash";
import { useEffect, useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useGetPostById, useQueryPosts } from "@/api/post";
import { useGetFlagshipSignal, useQuerySignals } from "@/api/signal";
import { Signal } from "@/firebase/signal";
import { BlueSignalBlog } from "../Blogs/BlueCircleBlog";
import { Spinner } from "@nextui-org/spinner";
import useInView from "@/hooks/useInView";
import BlogPostDrawer from "../BlogPost/v2/BlogPostDrawer";
import { useSearchParams } from "next/navigation";
import SignalDrawer from "../Signals/SignalsDrawer";

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
  const { data: flagshipSignal } = useGetFlagshipSignal();
  const searchParams = useSearchParams();

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

  const signals = (_clientSignals || _serverFormedSignals)
    ?.filter((c: Signal) => c?.id !== flagshipSignal?._id)
    ?.slice(0, 10);
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
        data.subTitle,
        data.subTextVariants,
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

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo({
        left: 0,
        top: parseInt(scrollPosition),
        behavior: "instant",
      });
      console.log("scrollPosition | removed - ", scrollPosition);
      sessionStorage.removeItem("scrollPosition");
    }

    const onScroll = () => {
      console.log("scrollPosition | added - ", scrollPosition);
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    addEventListener("scroll", onScroll);

    return () => {
      // console.log("scrollPosition | added - ", scrollPosition);
      // sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      removeEventListener("scroll", onScroll);
    };
  }, [searchParams]); // Run effect when query parameters change

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

    const rightPosts = compact(difference(posts, [titlePost])).slice(0, 4);

    return {
      titlePost,
      rightPosts: sortBy(rightPosts ?? [], "post.timestamp"),
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
          {signals.map((signal: Signal) => (
            <div
              key={signal.id}
              className="md:px-0 px-3 min-w-[240px] my-2 md:my-0"
            >
              <BlueSignalBlog
                href={`?signal_drawer_id=${signal.id}`}
                signal={signal}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[15px] md:mt-0 md:border-x border-dashed border-[#1f1d1a4d] px-0 md:px-7">
        {postsByPosition.titlePost && (
          <DesignedBlog
            linkClassName="block"
            post={postsByPosition.titlePost as Post}
            href={`?post_drawer_id=${postsByPosition.titlePost?.id}`}
            variant="very_short"
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {postsByPosition.rightPosts?.map((post) => (
          <DesignedBlog
            linkClassName="block"
            key={post.id}
            post={post}
            href={`?post_drawer_id=${post.id}`}
            variant="very_short"
          />
        ))}
      </div>
      <BlogPostDrawer _posts={posts} />
      <SignalDrawer _signals={signals} />
    </div>
  );
}
