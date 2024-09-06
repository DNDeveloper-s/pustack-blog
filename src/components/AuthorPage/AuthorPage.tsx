"use client";

import { ConfigProvider, Segmented } from "antd";
import AppImage from "../shared/AppImage";
import { useEffect, useRef, useState } from "react";
import { useGetAuthorById } from "@/api/author";
import { useQueryPosts } from "@/api/post";
import useInView from "@/hooks/useInView";
import BlogWithAuthor from "../Blogs/BlogWithAuthor";
import { Spinner } from "@nextui-org/spinner";
import { useQuerySignals } from "@/api/signal";
import useScreenSize from "@/hooks/useScreenSize";
import classes from "@/components/Signals/Signals.module.css";
import Image from "next/image";
import { emptyBox, twoCirclesWhite } from "@/assets";
import { Signal } from "@/firebase/signal";
import { SignalComponent } from "../Signals/Signals";
import MoreFromMinerva from "../BlogPost/MoreFromMinerva";
import { useQueryEvents } from "@/api/event";
import { EventCardDesktop, NoEventsIcon } from "../RSVP/RSVPedPage";

const tabs = ["Posts", "Signals", "Events"];

function PostsEntry({ authorId }: { authorId?: string }) {
  const {
    posts,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    error,
  } = useQueryPosts({
    status: ["published"],
    enabled: !!authorId,
    userId: authorId,
  });

  const hasPosts = (posts?.length ?? 0) > 0;

  const { ref: lastItemRef, isInView } = useInView();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

  return (
    <div>
      <div className="w-full grid grid-cols-4 gap-x-4 gap-y-6">
        {hasPosts &&
          posts?.map((post) => (
            <BlogWithAuthor key={post.id} post={post} size="sm" />
          ))}
      </div>
      {!hasPosts && (
        <div className="flex flex-col gap-5 items-center justify-center text-lg py-4 font-featureRegular text-gray-600">
          <Image alt="No Posts Found" src={emptyBox} className="w-[150px]" />
          <p>No Posts Found</p>
        </div>
      )}
      {(hasNextPage || isFetching || isLoading) && (
        <div
          ref={lastItemRef}
          className="w-full flex items-center justify-center py-4"
        >
          <Spinner
            classNames={{
              circle1: "blue-border-b",
              circle2: "blue-border-b",
            }}
            color="warning"
            size="lg"
          />
        </div>
      )}
    </div>
  );
}

function SignalsEntry({ authorId }: { authorId?: string }) {
  const {
    signals,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    error,
  } = useQuerySignals({
    limit: 10,
    status: "published",
    userId: authorId,
    enabled: !!authorId,
  });

  const hasSignals = (signals?.length ?? 0) > 0;

  const { ref: lastItemRef, isInView } = useInView();
  const targetRef = useRef<HTMLDivElement>(null);
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

  return (
    <div className="w-full max-w-[720px] mx-auto pt-[40px] pb-[80px] mb-2">
      {hasSignals && (
        <>
          <div className={classes.signal_blue_header}>
            <div>
              <Image alt="Signals" src={twoCirclesWhite} />
            </div>
            <h3>MINERVA SIGNALS</h3>
          </div>
          <div className={classes.label}>
            {/* <strong>Minerva Signals:</strong> */}
            {" Global insights on today's biggest stories."}
          </div>
          {/* {hasPreviousPage && (
          <div className={classes.button_holder}>
            <Button
              className={classes.button}
              isLoading={isFetchingPreviousPage}
              onClick={() => {
                if (!isFetchingPreviousPage) fetchPreviousPage();
              }}
            >
              {isFetchingPreviousPage
                ? "Loading Newer Posts..."
                : "Load Newer Posts"}
            </Button>
          </div>
        )} */}
          {signals?.map((signal: Signal) => (
            <div key={signal._id}>
              <SignalComponent signal={signal} />
            </div>
          ))}
        </>
      )}
      {!hasSignals && (
        <div className="flex flex-col gap-5 items-center justify-center text-lg py-4 font-featureRegular text-gray-600">
          <Image alt="No Signals Found" src={emptyBox} className="w-[150px]" />
          <p>No Signals Found</p>
        </div>
      )}
      {(hasNextPage || isFetching || isLoading) && (
        <div
          ref={lastItemRef}
          className="w-full flex items-center justify-center py-4"
        >
          <Spinner
            classNames={{
              circle1: "blue-border-b",
              circle2: "blue-border-b",
            }}
            color="warning"
            size="lg"
            label="Fetching more signals..."
          />
        </div>
      )}
      {!hasNextPage && !isFetching && !isLoading && (
        <>
          <MoreFromMinerva />
        </>
      )}
    </div>
  );
}

function EventsEntry({ authorId }: { authorId?: string }) {
  const {
    events,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    error,
  } = useQueryEvents({
    enabled: !!authorId,
    userId: authorId,
  });
  return (
    <div className="w-full flex-1 py-10">
      {isLoading && (
        <div className="w-full py-5 px-2 flex items-center justify-center">
          <Spinner size="lg" label="Loading Events" />
        </div>
      )}
      {!isLoading && events && events.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {events?.map((event) => (
            <EventCardDesktop key={event.id} event={event} />
          ))}
        </div>
      )}
      {!isLoading && (!events || events.length === 0) && (
        <div className="w-full py-5 px-2 text-center flex flex-col items-center gap-3 justify-center">
          <NoEventsIcon />
          <p className="text-base text-appBlack text-opacity-65">No Events</p>
        </div>
      )}
    </div>
  );
}

export default function AuthorDetailsPage({ authorId }: { authorId?: string }) {
  const [selectedTab, setSelectedTab] = useState("posts");
  const { author, error } = useGetAuthorById({
    id: authorId,
  });

  const [index, setIndex] = useState(0);
  return (
    <div className="py-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AppImage
            src={author?.image_url}
            alt="Nice one"
            width={80}
            height={80}
            className="w-[80px] h-[80px] rounded-full"
          />
        </div>
        <div>
          <h2 className="font-featureHeadline text-[25px]">
            {author?.name ?? "Saurabh Singh"}
          </h2>
          <p className="text-appBlack text-opacity-60 text-[14px]">
            {`${author?.name} is a seasoned technology expert based in Silicon Valley, with years of experience in cutting-edge innovations and software development. Specializing in areas like cloud computing, artificial intelligence, and full-stack development, ${author?.name} has worked with leading tech firms and startups, driving digital transformation across various industries. A passionate advocate for open-source contributions and emerging technologies, ${author?.name} is also a thought leader, sharing insights through articles, conferences, and mentorship to help shape the future of tech.`}
          </p>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] mt-[20px]" />
      <hr className="border-dashed border-[#1f1d1a4d] mt-[1px] mb-[20px]" />
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              /* here is your component tokens */
              itemActiveBg: "#243bb5",
              itemColor: "#1f1d1a",
              itemHoverColor: "#1f1d1a",
              itemSelectedBg: "#243bb5",
              itemSelectedColor: "#fff",
              trackBg: "#fcfae4",
            },
          },
        }}
      >
        <Segmented<string>
          size={"large"}
          options={tabs}
          onChange={(value) => {
            console.log(value); // string
            setSelectedTab(value.toLowerCase());
            setIndex(tabs.indexOf(value));
          }}
          value={
            selectedTab.charAt(0).toUpperCase() +
            selectedTab.slice(1).toLowerCase()
          }
          label={"Select Aspect Ratio"}
          style={{
            width: "100%",
          }}
          block
          // className="!bg-lightPrimary"
        />
      </ConfigProvider>
      <div className="mt-3"></div>

      <div>
        {selectedTab === "posts" && <PostsEntry authorId={authorId} />}
        {selectedTab === "signals" && <SignalsEntry authorId={authorId} />}
        {selectedTab === "events" && <EventsEntry authorId={authorId} />}
      </div>
    </div>
  );
}
