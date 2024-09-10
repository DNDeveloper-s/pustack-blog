"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRef, useState } from "react";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventSidebar, { EventFetchState } from "./EventSidebar";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import EventDetailsDesktop, {
  EventDetailDesktopShimmer,
} from "./EventDetailsDesktop";
import noEventSVG from "@/assets/svgs/no-events.svg";
import Image from "next/image";
import { minervaMiniImage } from "@/assets";
import MoreFromMinerva from "../BlogPost/MoreFromMinerva";
import _ from "lodash";
import { NoPostIcon } from "../Me/Posts/PostsEntry";

export default function EventDetailDesktopPage({
  _event,
}: {
  _event?: DocumentData;
}) {
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [eventFetchStatus, setEventFetchStatus] =
    useState<EventFetchState>("loading");

  // max-w-[1440px]

  const onStateChange = (state: EventFetchState) => {
    console.log("state - ", state);
    setEventFetchStatus(state);
  };

  return (
    // <main
    //   className="min-h-screen w-full"
    //   style={{
    //     overflow: isMobileScreen ? "unset" : "hidden",
    //   }}
    // >
    //   <div className="max-w-[1440px] mx-auto px-3">
    //     <Navbar scrollRef={scrollerRef} />
    //   </div>
    <>
      {isMobileScreen && (
        <div className="px-3 py-2 mb-0 sticky top-0 bg-primary border-b border-dashed border-[#1f1d1a6f] z-40">
          <h3
            className="text-[25px] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              router.push("/events");
            }}
          >
            <MdArrowBackIos />
            <span className="-mb-1">Events</span>
          </h3>
        </div>
      )}
      <div
        className={
          isTabletScreen
            ? "h-[calc(100vh-220px)]"
            : isMobileScreen
            ? ""
            : "h-[calc(100vh-150px)]"
        }
        style={{
          overflow: isMobileScreen ? "unset" : "auto",
        }}
        ref={scrollerRef}
      >
        <div className="max-w-[1440px] w-full mx-auto px-3">
          <div className="w-full h-full grid grid-cols-[1fr] md:grid-cols-[300px_1fr] lg:grid-cols-[315px_1fr] gap-4">
            {!isMobileScreen && (
              <div
                className={
                  "w-full sticky top-0 " +
                  (isTabletScreen
                    ? "h-[calc(100vh-220px)]"
                    : isMobileScreen
                    ? ""
                    : "h-[calc(100vh-150px)]")
                }
              >
                <EventSidebar onStateChange={onStateChange} />
              </div>
            )}
            {eventFetchStatus === "loading" ? (
              <EventDetailDesktopShimmer />
            ) : _event ? (
              <EventDetailsDesktop _event={_event} />
            ) : eventFetchStatus === "error" ? (
              <div className="pt-10">
                <h2 className="font-featureBold text-[24px] text-center text-[#666666]">
                  No Upcoming Events
                </h2>
                <div className="w-10 mx-auto">
                  <NoPostIcon />
                </div>
                <div className="mt-5">
                  <p className="text-[18px] text-[#888888] text-center">
                    You&apos;re all caught up!
                  </p>
                  <p className="text-[14px] text-[#aaaaaa] text-center">
                    Check back later for more exciting events or explore some of
                    our past highlights.
                  </p>
                </div>
                <div className="mt-10">
                  <Image
                    alt="Minerva"
                    src={minervaMiniImage}
                    className="w-[16px]"
                  />
                  <hr className="border-dashed border-[#1f1d1a4d] mt-[10px]" />
                  <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
                </div>
                <MoreFromMinerva />
              </div>
            ) : (
              <div className="pt-10">
                <h2 className="font-featureBold text-[24px] text-center text-[#666666]">
                  No Upcoming Events
                </h2>
                <div className="w-10 mx-auto">
                  <NoPostIcon />
                </div>
                <div className="mt-5">
                  <p className="text-[18px] text-[#888888] text-center">
                    You&apos;re all caught up!
                  </p>
                  <p className="text-[14px] text-[#aaaaaa] text-center">
                    Check back later for more exciting events or explore some of
                    our past highlights.
                  </p>
                </div>
                <div className="mt-10">
                  <Image
                    alt="Minerva"
                    src={minervaMiniImage}
                    className="w-[16px]"
                  />
                  <hr className="border-dashed border-[#1f1d1a4d] mt-[10px]" />
                  <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
                </div>
                <MoreFromMinerva />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
