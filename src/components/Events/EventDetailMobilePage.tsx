"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useRef } from "react";
import { DocumentData } from "firebase/firestore";
import useScreenSize from "@/hooks/useScreenSize";
import EventSidebar from "./EventSidebar";
import EventDetails from "./EventDetails";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import EventDetailsMobile from "./EventDetailsMobile";
import Image from "next/image";

const imageUrl = `https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2Fevent-image-17235420424470.6464562972334416?alt=media&token=5df479fe-b498-4350-92e7-97a4ccd50aea`;

export default function EventDetailMobilePage({
  _event,
}: {
  _event?: DocumentData;
}) {
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // max-w-[1440px]

  return <EventDetailsMobile _event={_event} />;
}
