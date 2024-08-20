import {
  TransformedEvent,
  TransformedEventWeekStructure,
  useGetEventsForDateRange,
} from "@/api/event";
import { getRandomDarkHexColor } from "@/lib/colors";
import { Spinner } from "@nextui-org/spinner";
import dayjs from "dayjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import AppImage from "../shared/AppImage";
import { getMeetLinkDetails } from "./EventDetails";
import { Event } from "@/firebase/event";
import { useSearchParams } from "next/navigation";

const NoEventIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={20}
    height={20}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
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

interface EventCardProps {
  event: Event;
}
function EventCard({ event }: EventCardProps) {
  const searchParams = useSearchParams();

  const isActive = searchParams.get("event_id") === event.id;

  return (
    <Link href={`/events?event_id=${event.id}`}>
      <div
        className="w-full flex gap-2 items-stretch py-2 px-4 text-white rounded-xl transition-all"
        style={{
          backgroundColor: event.background ?? getRandomDarkHexColor(),
          transform: `scale(${isActive ? 1 : 0.9})`,
          opacity: isActive ? 1 : 0.75,
          boxShadow: isActive
            ? "0 6px 12px rgba(0, 0, 0, 0.15),  0 3px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 140, 0, 0.7)"
            : "none",
        }}
      >
        <div className="text-sm font-helvetica flex-1">
          <p className="font-semibold line-clamp-2" title={event.title}>
            {event.title}
          </p>
          <p className="text-xs mt-0.5 text-white text-opacity-70">
            {event.venue.type === "online"
              ? `Online via ${
                  getMeetLinkDetails(event.venue.meetingLink).label
                }`
              : event.venue.name}
          </p>
          <p className="text-[11px] text-white text-opacity-60 mt-2">
            {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
            {dayjs(event.endTime.toDate()).format("h:mm A")}
          </p>
        </div>
        <div className="flex items-center flex-shrink-0">
          <div className="w-8 h-8 rounded-full">
            <AppImage
              className="w-full h-full rounded-full object-cover"
              width={140}
              height={140}
              src={event.organizer.photoURL}
              alt=""
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface EventSidebarItemProps {
  event: Event;
}
function EventSidebarItem({ event }: EventSidebarItemProps) {
  const searchParams = useSearchParams();

  const isActive = searchParams.get("event_id") === event.id;

  return (
    <div
      className={
        "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 pl-0 md:pl-2 md:px-2 pr-2 transition-all " +
        (isActive ? "bg-primary" : "transparent")
      }
    >
      <div className="flex flex-col py-1 items-center font-helvetica justify-start">
        <p className="text-xs uppercase">
          {dayjs(event.startTime.toDate()).format("ddd")}
        </p>
        <p className="text-lg font-medium">
          {dayjs(event.startTime.toDate()).format("D")}
        </p>
      </div>
      <div className="flex-1">
        <EventCard event={event} />
      </div>
    </div>
  );
}

interface EventSidebarProps {
  className?: string;
}
export default function EventSidebar({ className }: EventSidebarProps) {
  const { transformedEvents, isLoading, error } = useGetEventsForDateRange({
    enabled: true,
  });

  const currentMonthSectionRef = useCallback((node: HTMLDivElement) => {
    node?.scrollIntoView();
  }, []);

  const renderEventList = (transformedEvent: TransformedEventWeekStructure) => {
    return transformedEvent.weeks.map((week) => (
      <div key={week.id}>
        <div className="grid grid-cols-[45px_1fr] items-stretch w-full py-2 pl-0 md:pl-2 md:px-2 pr-2">
          <div></div>
          <span className="text-xs font-helvetica text-[#a0a4aa]">
            {week.id}
          </span>
        </div>
        <div>
          {week.events.map(({ date, events }) => {
            return (
              <div
                key={date}
                className={
                  "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 pl-0 md:pl-2 md:px-2 pr-2 transition-all "
                  // (isActive ? "bg-primary" : "transparent")
                }
              >
                <div className="flex flex-col py-1 items-center font-helvetica justify-start">
                  <p className="text-xs uppercase">
                    {dayjs(date).format("ddd")}
                  </p>
                  <p className="text-lg font-medium">
                    {dayjs(date).format("D")}
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {/* {events.length > 0 && <EventCard event={events[0].data} />} */}
                  {events.every((c) => c.exists) ? (
                    events.map(
                      (event) =>
                        event.exists && (
                          <EventCard key={event.data.id} event={event.data} />
                        )
                    )
                  ) : (
                    <div>
                      <p className="text-sm flex items-center justify-center gap-3 py-3 text-appBlack font-helvetica text-opacity-65">
                        <NoEventIcon fill="#1f1d1a" />
                        <span className="-mb-0.5">No Events</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );

            // if (exists)
            //   return <EventSidebarItem key={event.id} event={event} />;

            // return (
            //   <div
            //     key={event.id}
            //     className="grid grid-cols-[45px_1fr] gap-2 items-stretch w-full py-2 pl-0 md:pl-2 md:px-2 pr-2"
            //   >
            //     <div className="flex flex-col py-0 items-center font-helvetica justify-start">
            //       <p className="text-xs uppercase">{dayjs().format("ddd")}</p>
            //       <p className="text-lg font-medium">{dayjs().format("D")}</p>
            //     </div>
            //     <div className="flex-1 h-full text-sm flex items-center">
            //       <p>No Events</p>
            //     </div>
            //   </div>
            // );
          })}
        </div>
      </div>
    ));
  };

  const renderNoEventItem = () => {
    return (
      <div>
        <p className="text-sm flex items-center justify-center gap-3 py-3 text-appBlack font-helvetica text-opacity-65">
          <NoEventIcon fill="#1f1d1a" />
          <span className="-mb-0.5">No Events</span>
        </p>
      </div>
    );
  };

  const renderSpinner = () => {
    return (
      <div className="w-full flex py-4 justify-center items-center">
        <Spinner size="lg" label="Fetching events..." />
      </div>
    );
  };

  return (
    <div
      className={
        "w-full bg-lightPrimary h-full overflow-auto " + (className ?? "")
      }
    >
      {isLoading && renderSpinner()}
      {!isLoading &&
        transformedEvents?.map((transformedEvent) => {
          const className =
            "w-full h-[70px] bg-cover overlay-black bg-fixed text-white flex items-center justify-center bg-" +
            transformedEvent.id;
          return (
            <section
              key={transformedEvent.id}
              ref={transformedEvent.isCurrent ? currentMonthSectionRef : null}
            >
              <div className={className}>
                <span className="block relative text-2xl font-[600] font-helvetica">
                  {transformedEvent.month_name +
                    " " +
                    transformedEvent.full_year}
                </span>
              </div>
              <div className="py-2">
                {transformedEvent.weeks.length > 0
                  ? renderEventList(transformedEvent)
                  : renderNoEventItem()}
              </div>
            </section>
          );
        })}
    </div>
  );
}
