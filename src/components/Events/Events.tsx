"use client";

import Link from "next/link";
import classes from "./Events.module.css";
import useScreenSize from "@/hooks/useScreenSize";
import { useGetClosestEvent } from "@/api/event";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import EventListPage from "./EventListPage";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorMasterComponent } from "../shared/ErrorComponent";
import EventDetailDesktopPage from "./EventDetailDesktopPage";

export default function Events({
  eventId,
  _event,
}: {
  eventId?: string | null;
  _event: any;
}) {
  const { isMobileScreen } = useScreenSize();
  const router = useRouter();

  const {
    data: event,
    error,
    isFetched,
  } = useGetClosestEvent({ enabled: true });

  useEffect(() => {
    if (_event || isMobileScreen) return;
    if (event?.length === 0) {
      console.log("Redirecting to home page | 32");
      router.push(`/`);
    } else if (event?.[0]?.id) {
      router.push(`/events?event_id=${event?.[0]?.id}`);
    }
  }, [event, _event, isMobileScreen]);

  return isMobileScreen ? (
    <EventListPage _event={_event} />
  ) : (
    <div>
      <ErrorBoundary errorComponent={ErrorMasterComponent}>
        <EventDetailDesktopPage _event={_event} />
      </ErrorBoundary>
    </div>
  );
}
