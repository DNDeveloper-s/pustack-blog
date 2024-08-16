"use client";

import useScreenSize from "@/hooks/useScreenSize";
import Navbar from "../Navbar/Navbar";
import Footer from "../shared/Footer";
import { ConfigProvider, Segmented } from "antd";
import classes from "./Events.module.css";
import { Event } from "@/firebase/event";
import Link from "next/link";
import AppImage from "../shared/AppImage";
import dayjs from "dayjs";
import { useQueryEvents, useQueryRsvpEvents } from "@/api/event";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { getMeetLinkDetails } from "../Events/EventDetails";
import { compact } from "lodash";

interface EventCardProps {
  event?: Event;
}
export function EventCard({ event }: EventCardProps) {
  if (!event) return null;
  const isUpcoming = dayjs() <= dayjs(event?.startTime?.toDate());
  return (
    <Link
      className={
        classes.card_wrapper +
        " " +
        (isUpcoming ? classes.upcoming : classes.past)
      }
      href={"/events?event_id=" + event.id}
    >
      <div className={classes.event_title_label}>
        <p className={classes.event_label + " " + classes.past}>
          {isUpcoming ? "UPCOMING" : "PAST"}
        </p>
      </div>
      <div className="flex items-start gap-2 p-[10px_10px_0]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
          <AppImage
            width={200}
            height={200}
            alt="Display Image"
            className="w-full h-full object-cover"
            src={event.displayImage}
          />
        </div>
        <div className={classes.link_title}>
          <span
            style={{ fontWeight: "bold" }}
            className="line-clamp-2 inline-block"
          >
            {event.title}
          </span>
        </div>
      </div>
      <div className={classes.link_info}>
        <p className="mb-0 p-[0_10px]">
          {dayjs(event.startTime.toDate()).format("D MMMM, YYYY")}
        </p>
        <p className="mb-0 p-[0_10px]">
          {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
          {dayjs(event.endTime.toDate()).format("h:mm A")}
        </p>
        <p className="mb-0 p-[0_10px]">
          <span className="text-[16px] leading-[18px]">Venue: </span>
          <span className="ml-1 text-[16px] text-[#53524c] leading-[18px] whitespace-nowrap">
            {event.venue.type === "online"
              ? `Online via ${
                  getMeetLinkDetails(event.venue.meetingLink).label
                }`
              : event.venue.name}
          </span>
        </p>
      </div>
      <p className={classes.link_para}>
        <span style={{ fontWeight: "bold" }}>{event.description}</span>
      </p>
      <div className="flex items-center justify-center gap-2 mb-4 p-[0_10px_0]">
        <div className="flex-shrink-0 w-5 h-5 rounded-full">
          <AppImage
            src={event.organizer.photoURL}
            alt="Organizer Image"
            className="rounded-full w-full h-full object-cover"
          />
        </div>
        <span className="leading-[120%] font-helvetica text-[16px] whitespace-nowrap flex-1 overflow-hidden text-ellipsis">
          {event.organizer.name}
        </span>
      </div>
      <div>
        <div className={classes.link_dashed_holder}>
          <div className={classes.link_dashed}></div>
        </div>
        <div className={classes.link_cta}>Learn More →</div>
      </div>
    </Link>
  );
}

const NoEventsIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={80}
    height={80}
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      d="M17.796 15.345c-.42-.42-1.07-.41-1.48 0l-1.31 1.31-1.31-1.31c-.41-.41-1.09-.41-1.5 0a1.088 1.088 0 0 0 0 1.5l1.31 1.31-1.3 1.3c-.21.21-.31.47-.31.74 0 .26.1.54.31.75.41.41 1.07.41 1.48 0l1.31-1.31 1.31 1.31c.41.41 1.07.41 1.48 0 .42-.41.42-1.08.01-1.49l-1.31-1.31 1.31-1.31c.41-.41.41-1.08 0-1.49z"
      data-original="#000000"
    />
    <path
      d="M24.59 4.27h-.4v2.52c0 1.65-1.34 3-3 3-1.65 0-3-1.35-3-3V4.27h-6.38v2.52c0 1.65-1.35 3-3 3-1.66 0-3-1.35-3-3V4.27h-.4C3.53 4.27 2 5.8 2 7.68v16.16c0 1.88 1.53 3.41 3.41 3.41h19.18c1.88 0 3.41-1.53 3.41-3.41V7.68c0-1.88-1.53-3.41-3.41-3.41zm0 20.98H5.41c-.78 0-1.41-.63-1.41-1.41V11.8h22v12.04c0 .78-.63 1.41-1.41 1.41z"
      data-original="#000000"
    />
    <path
      d="M8.807 7.787a1 1 0 0 0 1-1V3.75a1 1 0 1 0-2 0v3.036a1 1 0 0 0 1 1zm12.385 0a1 1 0 0 0 1-1V3.75a1 1 0 1 0-2 0v3.036a1 1 0 0 0 1 1z"
      data-original="#000000"
    />
  </svg>
);

export default function RSVPedPage() {
  const { isMobileScreen } = useScreenSize();
  const { user } = useUser();
  const [mode, setMode] = useState<"upcoming" | "past">("upcoming");

  const {
    data: events,
    error,
    isLoading,
  } = useQueryRsvpEvents({
    enabled: true,
    userId: user?.uid,
    occur_in: mode,
  });

  console.log("error - ", error);

  return (
    <div className="max-w-[1440px] w-screen h-screen flex flex-col overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="w-full overflow-auto py-10 flex-1 flex flex-col">
        <div className="w-full flex-1">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4 md:items-center">
            <h2 className="text-appBlack text-[22px] md:text-[30px] font-larkenExtraBold">
              RSVP&nbsp;ed Events
            </h2>
            {/* <div className="flex items-center gap-4">
              <SortByModal handleApply={handleSortApply} />
              <FilterModal filters={filters} handleApply={handleFiltersApply} />
            </div> */}
            <div className="w-full">
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
                  options={["Upcoming Events", "Past Events"]}
                  onChange={(value) => {
                    console.log(value); // string
                    setMode(value.split(" ")[0].toLowerCase() as any);
                  }}
                  style={{
                    width: "100%",
                  }}
                  // className="!bg-lightPrimary"
                />
              </ConfigProvider>
            </div>
          </div>
          {/* {isMobileScreen ? (
            <div className="grid grid-cols-1 gap-3"></div>
          ) : (
            <div className="grid divide-y divide-dashed divide-[#1f1d1a4d]"></div>
          )} */}
          {isLoading && (
            <div className="w-full py-5 px-2 flex items-center justify-center">
              <Spinner size="lg" label="Loading Events" />
            </div>
          )}
          {!isLoading && events && events.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {compact(events)?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          {!isLoading && (!events || events.length === 0) && (
            <div className="w-full py-5 px-2 text-center flex flex-col items-center gap-3 justify-center">
              <NoEventsIcon />
              <p className="text-base text-appBlack text-opacity-65">
                No RSVPed Events
              </p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
