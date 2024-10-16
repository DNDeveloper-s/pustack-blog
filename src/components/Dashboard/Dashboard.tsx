"use client";
import Flagship from "@/components/Blogs/Flagship";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { Post, SnippetPosition } from "@/firebase/post-v2";
import { chunk, compact, difference, sortBy } from "lodash";
import { useEffect, useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useQueryPosts } from "@/api/post";
import { useGetFlagshipSignal, useQuerySignals } from "@/api/signal";
import { Signal } from "@/firebase/signal";
import { BlueSignalBlog } from "../Blogs/BlueCircleBlog";
import useScreenSize from "@/hooks/useScreenSize";
import DashboardMobile from "./DashboardMobile";
import { useUser } from "@/context/UserContext";

function DashboardDesktop({
  posts: _serverPosts,
  signals: _serverSignals,
}: {
  posts: any;
  signals: any;
}) {
  const { user } = useUser();
  const { isTabletScreen, isMobileScreen } = useScreenSize();
  const {
    signals: _clientSignals,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useQuerySignals({ limit: 11, status: "published" });
  const { data: flagshipSignal, error: _Error } = useGetFlagshipSignal();

  console.log("error - ", _Error);

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
      return new Post(
        data.title,
        data.subTitle,
        data.subTextVariants,
        data.author,
        data.topic,
        data.customTopic,
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
        data.nodes,
        data.displayThumbnail
      );
    }),
    limit: 40,
  });

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      document.body.scrollTo({
        left: 0,
        top: parseInt(scrollPosition),
        behavior: "instant",
      });
      console.log("scrollPosition | removed - ", scrollPosition);
      sessionStorage.removeItem("scrollPosition");
    }

    const onScroll = () => {
      document.body.scrollTop > 0 &&
        sessionStorage.setItem(
          "scrollPosition",
          document.body.scrollTop.toString()
        );
    };

    document.body.addEventListener("scroll", onScroll);

    return () => {
      // console.log("scrollPosition | added - ", scrollPosition);
      // sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      document.body.removeEventListener("scroll", onScroll);
    };
  }, []); // Run effect when query parameters change

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
    ).slice(0, 6);

    const rightPosts = compact(
      difference(posts, [titlePost, ...midContentPosts])
    ).slice(0, 4);

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

  // console.log("postsByPosition - ", postsByPosition);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[25%_46%_29%] relative">
      <div
        className={
          "md:sticky py-2 md:pt-0 pt-2 md:overflow-auto " +
          (isTabletScreen
            ? "h-[calc(100vh-220px)] top-[220px]"
            : isMobileScreen
            ? ""
            : "h-[calc(100vh-150px)] top-[150px]")
        }
      >
        <div className="w-[96%] md:sticky md:top-0 md:pt-2 bg-primary">
          <Flagship />
        </div>
        <div className="pr-0 md:pr-4 lg:pr-7 pt-1 selection:md:pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-x-hidden">
          {signals.map((signal: Signal) => (
            <div
              key={signal.id}
              className="md:px-0 px-3 min-w-[170px] my-2 md:my-0"
            >
              <BlueSignalBlog signal={signal} />
            </div>
          ))}
          {/* {(hasNextPage || isFetching || isLoading) && (
            <div
              ref={signalSpinnerRef}
              className="flex-shrink-0 px-3 flex items-center justify-center"
            >
              <Spinner
                classNames={{
                  circle1: "blue-border-b",
                  circle2: "blue-border-b",
                }}
                color="warning"
                size="sm"
              />
            </div>
          )} */}
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
                <div key={post.id} className={j % 2 === 0 ? "pr-3" : "pl-3"}>
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
        {/* <BlogWithAuthor post={fullCPosts?.[1]} size="sm" /> */}
        {!user && !isTabletScreen && (
          <div className="mt-4">
            <SignUpForNewsLetters />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard(props: { posts: any; signals: any }) {
  const { isMobileScreen } = useScreenSize();

  return isMobileScreen ? (
    <DashboardMobile {...props} />
  ) : (
    <DashboardDesktop {...props} />
  );
}

// padding: 5px (Parent)
// box-shadow: rgba(60, 64, 67, 0.3) 0px 0px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 6px 2px
