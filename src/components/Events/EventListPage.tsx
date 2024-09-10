"use client";

import useScreenSize from "@/hooks/useScreenSize";
import { useEffect, useMemo, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import EventSidebar from "./EventSidebar";
import PageDrawer from "../shared/PageDrawer";
import EventDetailMobilePage from "./EventDetailMobilePage";
import { useSearchParams, useRouter } from "next/navigation";

export default function EventListPage({ _event }: { _event: any }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("event_id");

  const open = useMemo(() => {
    return !!eventId;
  }, [eventId]);

  useEffect(() => {
    router.prefetch("/events");
  }, [router]);

  // max-w-[1440px]
  return (
    <main
      className="max-w-[1440px] mx-auto"
      style={{
        overflow: isMobileScreen ? "auto" : "hidden",
      }}
    >
      <div className="px-3">
        <Navbar scrollRef={scrollerRef} />
      </div>
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
        <div className="mb-2 pt-2 px-1 flex justify-between items-center">
          <h2 className="text-appBlack text-[26px] md:text-[30px] font-larkenExtraBold">
            Events
          </h2>
          <div></div>
        </div>
        <div className="w-full h-full">
          <EventSidebar className="!bg-transparent" />
        </div>
      </div>
      <PageDrawer open={open} onClose={() => router.back()}>
        {_event && <EventDetailMobilePage _event={_event} />}
      </PageDrawer>
    </main>
  );
}
