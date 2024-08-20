import { getRandomDarkHexColor } from "@/lib/colors";
import AppImage, { noImageUrl } from "../shared/AppImage";
import { useQueryEvents } from "@/api/event";
import dayjs from "dayjs";
import { getMeetLinkDetails } from "./EventDetails";
import Link from "next/link";

interface UpcomingEventProps {}
const UpcomingEventSection = (props: UpcomingEventProps) => {
  const { events, error } = useQueryEvents({
    enabled: true,
    occur_in: "upcoming",
    limit: 5,
  });

  if (!events) return null;
  const event = events[0];
  if (!event) return null;
  return (
    <div>
      <h2 className="font-featureRegular text-[20px] leading-[110%] mb-[10px]">
        Upcoming Events
      </h2>
      <div>
        <div
          className={
            "grid grid-cols-[45px_1fr] gap-2 md:grid-cols-[45px_1fr] lg:grid-cols-[45px_1fr] items-stretch w-full py-2 px-0 transition-all "
          }
        >
          <div className="flex flex-col py-1 items-start font-helvetica justify-start">
            <p className="text-xs uppercase">
              {dayjs(event.startTime.toDate()).format("ddd")}
            </p>
            <p className="text-lg font-medium">
              {dayjs(event.startTime.toDate()).format("D")}
            </p>
          </div>
          <div className="flex-1">
            <Link href={`/events?event_id=${event.id}`}>
              <div
                className="w-full flex gap-2 items-stretch py-2 px-4 text-white rounded-xl transition-all before:top-0 before:left-0 before:bg-[linear-gradient(135deg,_rgba(255,228,196,0.3)_0%,_rgba(240,128,128,0.3)_100%)] before:backdrop-blur-[6px] before:absolute before:w-full before:h-full relative overflow-hidden "
                style={{
                  backgroundImage: `url(/assets/images/colored-elements.webp)`,
                  backgroundSize: "cover",
                  boxShadow:
                    "0 6px 12px rgba(0, 0, 0, 0.15),  0 3px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 140, 0, 0.7)",
                  // backgroundColor: event.background ?? getRandomDarkHexColor(),
                }}
              >
                <div className="text-sm font-helvetica flex-1 relative">
                  <p className="font-semibold line-clamp-2 text-[#333333]">
                    {" "}
                    {event.title}
                  </p>
                  <p className="text-xs mt-0.5 text-[#333333]">
                    {event.venue.type === "online"
                      ? `Online via ${
                          getMeetLinkDetails(event.venue.meetingLink).label
                        }`
                      : event.venue.name}
                  </p>
                  <p className="text-[11px] text-[#333333] mt-2">
                    {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
                    {dayjs(event.endTime.toDate()).format("h:mm A")}
                  </p>
                </div>
                <div className="flex items-center flex-shrink-0 relative">
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
          </div>
        </div>
      </div>
      <hr className="border-solid border-[#1f1d1a4d] my-3 md:my-5" />
    </div>
  );
};

export default UpcomingEventSection;
