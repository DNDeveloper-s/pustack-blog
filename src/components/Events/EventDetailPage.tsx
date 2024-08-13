"use client";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventDetailMobilePage from "./EventDetailMobilePage";
import EventDetailDesktopPage from "./EventDetailDesktopPage";

export default function EventDetailPage({ _event }: { _event?: DocumentData }) {
  const { isMobileScreen } = useScreenSize();

  // max-w-[1440px]

  if (isMobileScreen) {
    return <EventDetailMobilePage _event={_event} />;
  }

  return <EventDetailDesktopPage _event={_event} />;
}
