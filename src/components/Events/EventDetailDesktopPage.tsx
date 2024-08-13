"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRef } from "react";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventSidebar from "./EventSidebar";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import EventDetailsDesktop from "./EventDetailsDesktop";

export default function EventDetailDesktopPage({
  _event,
}: {
  _event?: DocumentData;
}) {
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // max-w-[1440px]

  return (
    <main
      className="min-h-screen w-full"
      style={{
        overflow: isMobileScreen ? "unset" : "hidden",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-3">
        <Navbar scrollRef={scrollerRef} />
      </div>
      {isMobileScreen && (
        <div className="px-3 py-2 mb-0 sticky top-0 bg-primary border-b border-dashed border-[#1f1d1a6f] z-40">
          <h3
            className="text-[25px] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              router.push("/events/list");
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
                <EventSidebar />
              </div>
            )}
            <EventDetailsDesktop _event={_event} />
          </div>
        </div>
      </div>
    </main>
  );
}
