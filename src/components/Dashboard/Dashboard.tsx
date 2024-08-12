"use client";
import Flagship from "@/components/Blogs/Flagship";
import SignUpForNewsLetters from "../SignUpForNewsLetters/SignUpForNewsLetters";
import { useMediaQuery } from "react-responsive";
import { Post, SnippetPosition } from "@/firebase/post-v2";
import { Post as PostV1 } from "@/firebase/post";
import { chunk, compact, difference, sortBy } from "lodash";
import { useMemo } from "react";
import DesignedBlog from "../Blogs/DesignedBlog";
import { useQueryPosts } from "@/api/post";
import { useQuerySignals } from "@/api/signal";
import { Signal } from "@/firebase/signal";
import { BlueSignalBlog } from "../Blogs/BlueCircleBlog";
import useScreenSize from "@/hooks/useScreenSize";
import DashboardMobile from "./DashboardMobile";
import { useUser } from "@/context/UserContext";
import AppImage from "../shared/AppImage";
import { noImageUrl } from "../Me/Signals/SignalItem";
import { getRandomDarkHexColor } from "@/lib/colors";

function DashboardDesktop({
  posts: _serverPosts,
  signals: _serverSignals,
}: {
  posts: any;
  signals: any;
}) {
  const { user } = useUser();
  const isTabletScreen = useMediaQuery({ query: "(max-width: 1024px)" });
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
    limit: 40,
  });

  // const { ref: signalSpinnerRef, isInView: isSignalSpinnerInView } =
  //   useInView();

  // useEffect(() => {
  //   if (!isFetching && !isFetchingNextPage && isSignalSpinnerInView)
  //     fetchNextPage();
  // }, [fetchNextPage, isFetching, isFetchingNextPage, isSignalSpinnerInView]);

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
    ).slice(0, 6);

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
    <div className="grid grid-cols-1 md:grid-cols-[21%_54%_25%] relative">
      <div className="md:sticky md:top-[150px] md:h-[calc(100vh-150px)] py-2 md:pt-0 pt-2 md:overflow-auto">
        <div className="w-[96%] md:sticky md:top-0 md:pt-2 bg-primary">
          <Flagship title={(signals[0] as Signal).title} />
        </div>
        <div className="pr-0 md:pr-7 pt-1 selection:md:pt-5 flex md:flex-col flex-row divide-x md:divide-x-0 md:divide-y divide-dashed divide-[#1f1d1a4d] overflow-x-auto md:overflow-x-hidden">
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
      <div className="mt-[15px] md:mt-0 md:border-x py-2 border-dashed border-[#1f1d1a4d] px-0 md:px-7">
        <DesignedBlog
          linkClassName="block"
          post={postsByPosition.titlePost as Post}
        />
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
      <div className="px-0 md:pl-7 md:pr-0 py-2">
        <div className="mt-5">
          <h2 className="font-featureRegular text-[20px] leading-[110%] mb-[10px]">
            Upcoming Events
          </h2>
          <div>
            <div
              className={
                "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 px-0 pr-2 transition-all "
              }
            >
              <div className="flex flex-col py-1 items-start font-helvetica justify-start">
                <p className="text-xs uppercase">SEP</p>
                <p className="text-lg font-medium">14</p>
              </div>
              <div className="flex-1">
                <div
                  className="w-full flex gap-2 items-stretch py-2 px-4 text-white rounded-xl transition-all"
                  style={{
                    backgroundColor: getRandomDarkHexColor(),
                  }}
                >
                  <div className="text-sm font-helvetica flex-1">
                    <p className="font-semibold line-clamp-2">NYC Meetup</p>
                    <p className="text-xs mt-0.5 text-white text-opacity-70">
                      Online via Google Meet
                    </p>
                    <p className="text-[11px] text-white text-opacity-60 mt-2">
                      9:00 AM - 11:00 AM
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full">
                      <AppImage
                        className="w-full h-full rounded-full object-cover"
                        width={140}
                        height={140}
                        src={noImageUrl}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 px-0 pr-2 transition-all "
              }
            >
              <div className="flex flex-col py-1 items-start font-helvetica justify-start">
                <p className="text-xs uppercase">SEP</p>
                <p className="text-lg font-medium">14</p>
              </div>
              <div className="flex-1">
                <div
                  className="w-full flex gap-2 items-stretch py-2 px-4 text-white rounded-xl transition-all"
                  style={{
                    backgroundColor: getRandomDarkHexColor(),
                  }}
                >
                  <div className="text-sm font-helvetica flex-1">
                    <p className="font-semibold line-clamp-2">NYC Meetup</p>
                    <p className="text-xs mt-0.5 text-white text-opacity-70">
                      Online via Google Meet
                    </p>
                    <p className="text-[11px] text-white text-opacity-60 mt-2">
                      9:00 AM - 11:00 AM
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full">
                      <AppImage
                        className="w-full h-full rounded-full object-cover"
                        width={140}
                        height={140}
                        src={noImageUrl}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 px-0 pr-2 transition-all "
              }
            >
              <div className="flex flex-col py-1 items-start font-helvetica justify-start">
                <p className="text-xs uppercase">SEP</p>
                <p className="text-lg font-medium">14</p>
              </div>
              <div className="flex-1">
                <div
                  className="w-full flex gap-2 items-stretch py-2 px-4 text-white rounded-xl transition-all"
                  style={{
                    backgroundColor: getRandomDarkHexColor(),
                  }}
                >
                  <div className="text-sm font-helvetica flex-1">
                    <p className="font-semibold line-clamp-2">NYC Meetup</p>
                    <p className="text-xs mt-0.5 text-white text-opacity-70">
                      Online via Google Meet
                    </p>
                    <p className="text-[11px] text-white text-opacity-60 mt-2">
                      9:00 AM - 11:00 AM
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full">
                      <AppImage
                        className="w-full h-full rounded-full object-cover"
                        width={140}
                        height={140}
                        src={noImageUrl}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-solid border-[#1f1d1a4d] my-3 md:my-5" />
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
