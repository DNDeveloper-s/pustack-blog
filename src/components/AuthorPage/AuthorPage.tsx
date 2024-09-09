"use client";

import { ConfigProvider, Segmented } from "antd";
import AppImage from "../shared/AppImage";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  EventCardDesktop,
  getSortedKeys,
  groupEventsByDate,
  NoEventsIcon,
} from "../RSVP/RSVPedPage";
import { compact } from "lodash";
import { pstDayjs } from "@/lib/dayjsConfig";
import { EventCard } from "../Events/EventSidebar";

const tabs = ["Posts", "Signals", "Events"];

const DocumentIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M106 512h300c24.814 0 45-20.186 45-45V150H346c-24.814 0-45-20.186-45-45V0H106C81.186 0 61 20.186 61 45v422c0 24.814 20.186 45 45 45zm60-301h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h120c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15z"
      data-original="#000000"
    />
    <path
      d="M346 120h96.211L331 8.789V105c0 8.276 6.724 15 15 15z"
      data-original="#000000"
    />
  </svg>
);

const SignalIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22.2}
    fillRule="evenodd"
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 100 101"
    {...props}
  >
    <path
      d="M73.064 31.973a3.92 3.92 0 0 0-3.92-3.919H56.793a3.92 3.92 0 0 0-3.92 3.92v61.753a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM21.191 81.376a3.92 3.92 0 0 0-3.92-3.919L4.92 77.456A3.92 3.92 0 0 0 1 81.376v12.351a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM99 7.272a3.92 3.92 0 0 0-3.92-3.92H82.729a3.92 3.92 0 0 0-3.92 3.92v86.455a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM47.127 56.675a3.92 3.92 0 0 0-3.92-3.92H30.856a3.92 3.92 0 0 0-3.92 3.92v37.051a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92z"
      data-original="#000000"
    />
  </svg>
);

const EventIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 48 48"
    {...props}
  >
    <rect width={4} height={6} x={11} y={3} data-original="#000000" rx={2} />
    <rect width={4} height={6} x={33} y={3} data-original="#000000" rx={2} />
    <path
      d="M4 18v23a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V18zm12 20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm6-11v-6a4 4 0 0 0-4-4h-1v1c0 2.206-1.794 4-4 4s-4-1.794-4-4V6H17v1c0 2.206-1.794 4-4 4S9 9.206 9 7V6H8a4 4 0 0 0-4 4v6z"
      data-original="#000000"
    />
  </svg>
);

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
      <div className="w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-x-2 md:gap-x-4 gap-y-3 md:gap-y-6">
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
  const { isSmallScreen } = useScreenSize();

  const eventsArr = useMemo(() => {
    const groupedEvents = groupEventsByDate(compact(events) || []);
    return getSortedKeys(groupedEvents).map((date) => ({
      date,
      events: groupedEvents[date],
    }));
  }, [events]);

  return (
    <div className="w-full flex-1 py-10">
      {isLoading && (
        <div className="w-full py-5 px-2 flex items-center justify-center">
          <Spinner size="lg" label="Loading Events" />
        </div>
      )}
      {!isLoading && events && events.length > 0 && (
        <div
          className={
            !isSmallScreen ? "grid grid-cols-3 gap-4" : "grid grid-cols-1"
          }
        >
          {events?.map((event) =>
            !isSmallScreen ? (
              <EventCardDesktop key={event.id} event={event} />
            ) : (
              <div className="flex flex-col gap-4 mt-4" key={event.id}>
                {eventsArr.map((eventGroup) => (
                  <div
                    className="grid grid-cols-[40px_1fr] gap-3"
                    key={eventGroup.date}
                  >
                    <div className="flex items-start">
                      <div className="flex font-helvetica flex-col items-center text-sm p-2 justify-center bg-appBlack rounded-lg">
                        <p className="text-white text-opacity-70">
                          {pstDayjs(eventGroup.date).format("MMM")}
                        </p>
                        <p className="text-white text-opacity-100">
                          {pstDayjs(eventGroup.date).format("D")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {eventGroup.events.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          includeDate
                          stayActive
                          noShadow
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
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

  const { isSmallScreen } = useScreenSize();

  const [index, setIndex] = useState(0);

  return (
    <div className="py-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-[20px] md:gap-[40px] lg:gap-[70px]">
        <div className="flex gap-4 md:items-center">
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
              {author?.about ??
                `Saurabh Singh is a seasoned technology expert based in Silicon Valley, with years of experience in cutting-edge innovations and software development. Specializing in areas like cloud computing, artificial intelligence, and full-stack development.`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="h-[90px] md:h-[120px] w-full flex flex-col justify-evenly px-3 md:px-7 py-2 md:py-5 rounded-md shadow-md hover:shadow-lg transition-all bg-[#00B3A6] border border-white">
            <div className="flex items-center gap-2">
              <DocumentIcon
                width={isSmallScreen ? 17 : 22}
                height={isSmallScreen ? 17 : 22}
              />
              <h4 className="text-[14px] md:text-[16px] text-black text-opacity-75 font-bold font-helvetica">
                Posts
              </h4>
            </div>
            <p className="text-[20px] md:text-[24px] font-helvetica ml-[30px] font-bold text-black">
              {author?.articleCount ?? 0}
            </p>
          </div>
          <div className="h-[90px] md:h-[120px] w-full flex flex-col justify-evenly px-3 md:px-7 py-2 md:py-5 rounded-md shadow-md hover:shadow-lg transition-all bg-[#FFB400] border border-white">
            <div className="flex items-center gap-2">
              <SignalIcon
                width={isSmallScreen ? 17 : 22}
                height={isSmallScreen ? 17 : 22.2}
              />
              <h4 className="text-[14px] md:text-[16px] text-black text-opacity-75 font-bold font-helvetica">
                Signals
              </h4>
            </div>
            <p className="text-[20px] md:text-[24px] font-helvetica ml-[30px] font-bold text-black">
              {author?.signalCount ?? 0}
            </p>
          </div>
          <div className="h-[90px] md:h-[120px] w-full flex flex-col justify-evenly px-3 md:px-7 py-2 md:py-5 rounded-md shadow-md hover:shadow-lg transition-all bg-[#a487f1] border border-white">
            <div className="flex items-center gap-2">
              <EventIcon
                width={isSmallScreen ? 17 : 22}
                height={isSmallScreen ? 17 : 22}
              />
              <h4 className="text-[14px] md:text-[16px] text-black text-opacity-75 font-bold font-helvetica">
                Events
              </h4>
            </div>
            <p className="text-[20px] md:text-[24px] font-helvetica font-bold ml-[30px] text-black">
              {author?.eventCount ?? 0}
            </p>
          </div>
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
