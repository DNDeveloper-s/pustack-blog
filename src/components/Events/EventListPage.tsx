"use client";

import useScreenSize from "@/hooks/useScreenSize";
import { useRef } from "react";
import Navbar from "../Navbar/Navbar";
import EventSidebar from "./EventSidebar";

export default function EventListPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  return (
    <main
      className="max-w-[1440px] min-h-screen mx-auto px-3"
      style={{
        overflow: isMobileScreen ? "auto" : "hidden",
      }}
    >
      <Navbar scrollRef={scrollerRef} />
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
        <div className="w-full h-full">
          <EventSidebar />
        </div>
      </div>
    </main>
  );
}
