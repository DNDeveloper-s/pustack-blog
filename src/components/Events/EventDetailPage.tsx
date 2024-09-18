"use client";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventDetailMobilePage from "./EventDetailMobilePage";
import EventDetailDesktopPage from "./EventDetailDesktopPage";
import PageDrawer from "../shared/PageDrawer";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLink } from "@/context/LinkContext";

export default function EventDetailPage({ _event }: { _event?: DocumentData }) {
  const { isMobileScreen } = useScreenSize();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigationStack } = useLink();

  const open = useMemo(() => {
    return !!searchParams.get("event_id");
  }, [searchParams]);

  // max-w-[1440px]

  useEffect(() => {
    router.prefetch("/events");
  }, [router]);

  if (isMobileScreen) {
    return (
      <PageDrawer
        open={open}
        onClose={() => {
          if (navigationStack.length === 1) {
            return router.push("/events");
          }
          router.back();
        }}
      >
        <EventDetailMobilePage _event={_event} />
      </PageDrawer>
    );
  }

  return <EventDetailDesktopPage _event={_event} />;
}
