import { getRandomDarkHexColor } from "@/lib/colors";
import AppImage, { noImageUrl } from "../shared/AppImage";
import { useQueryEvents } from "@/api/event";
import dayjs from "dayjs";
import { getMeetLinkDetails } from "./EventDetails";
import Link from "next/link";
import { getOrdinalSuffix } from "@/lib/date";
import { usePathname } from "next/navigation";

interface UpcomingEventProps {}
const UpcomingEventSection = (props: UpcomingEventProps) => {
  const { events, error } = useQueryEvents({
    enabled: true,
    occur_in: "upcoming",
    limit: 5,
  });

  const pathname = usePathname();
  const isEventPage = pathname.includes("/events");

  if (!events) return null;
  const event = events[0];
  if (!event) return null;
  return (
    <Link href={`/events?event_id=${event.id}`}>
      <div>
        <div
          className={
            "grid grid-cols-[35px_1fr] gap-1 md:grid-cols-[35px_1fr] lg:grid-cols-[35px_1fr] w-full items-stretch transition-all before:top-0 before:left-0 before:bg-[linear-gradient(135deg,_rgba(171,71,188,0.7),_rgba(236,64,122,0.7))] before:backdrop-blur-[6px] before:absolute before:w-full before:h-full relative py-1 px-3 overflow-hidden rounded-xl text-white "
          }
          style={{
            animation: isEventPage
              ? "none"
              : "intense-blink-breath 1.5s infinite ease-in-out",
            backgroundImage: `url(/assets/images/colored-elements.webp)`,
            backgroundSize: "cover",
            boxShadow: isEventPage
              ? "rgba(171, 71, 188, 0.7) 0px 0px 10px, rgba(236, 64, 122, 0.5) 0px 0px 20px"
              : "rgba(171, 71, 188, 0.7) 0px 0px 20px, rgba(236, 64, 122, 0.5) 0px 0px 40px",
            // backgroundColor: event.background ?? getRandomDarkHexColor(),
          }}
        >
          <div
            className="flex flex-col my-1 items-center pr-[8px] font-helvetica justify-start relative"
            style={{
              borderRight: "1px dashed #46464630",
            }}
          >
            <p className="text-[11px] uppercase font-bold">
              {dayjs(event.startTime.toDate()).format("MMM")}
            </p>
            <p className="text-sm font-bold">
              {dayjs(event.startTime.toDate()).format("D")}
            </p>
          </div>
          <div className="flex-1 flex items-center pl-1">
            <div className="w-full overflow-hidden ">
              <div className="text-xs font-helvetica flex-1 relative">
                <p className="font-semibold line-clamp-2"> {event.title}</p>
                {/* <p className="text-xs mt-0.5 text-[#333333]">
                    {event.venue.type === "online"
                      ? `Online via ${
                          getMeetLinkDetails(event.venue.meetingLink).label
                        }`
                      : event.venue.name}
                  </p> */}
                {/* <p className="text-[11px] text-[#333333] mt-2">
                    {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
                    {dayjs(event.endTime.toDate()).format("h:mm A")}
                  </p> */}
              </div>
              {/* <div className="flex items-center flex-shrink-0 relative">
                  <div className="w-8 h-8 rounded-full">
                    <AppImage
                      className="w-full h-full rounded-full object-cover"
                      width={140}
                      height={140}
                      src={event.organizer.photoURL}
                      alt=""
                    />
                  </div>
                </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="border-solid border-[#1f1d1a4d] my-3 md:my-5" /> */}
    </Link>
  );
};

export default UpcomingEventSection;
