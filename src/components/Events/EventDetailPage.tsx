"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRef } from "react";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventSidebar from "./EventSidebar";
import EventDetails from "./EventDetails";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function EventDetailPage({ _event }: { _event?: DocumentData }) {
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <main
      className="max-w-[1440px] min-h-screen mx-auto px-3"
      style={{
        overflow: isMobileScreen ? "unset" : "hidden",
      }}
    >
      <Navbar scrollRef={scrollerRef} />
      {isMobileScreen && (
        <div className="py-2 mb-0 sticky top-0 bg-primary border-b border-dashed border-[#1f1d1a6f] z-40">
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
        <div className="w-full h-full grid grid-cols-[1fr] md:grid-cols-[320px_1fr] lg:grid-cols-[350px_1fr] gap-4">
          {!isMobileScreen && <EventSidebar />}
          <EventDetails _event={_event} />
        </div>
      </div>
    </main>
  );
}
