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
            "grid grid-cols-[35px_1fr] w-full items-stretch transition-all before:top-0 before:left-0 before:bg-black before:absolute before:w-full before:h-full relative py-1 px-3 overflow-hidden rounded-xl text-white "
          }
        >
          <div
            className="flex flex-col my-1 items-center pr-[8px] font-helvetica justify-start relative"
            style={{
              borderRight: "1px dashed rgb(255 255 255 / 36%)",
            }}
          >
            <p className="text-[11px] uppercase font-bold">
              {dayjs(event.startTime.toDate()).format("MMM")}
            </p>
            <p className="text-sm font-bold">
              {dayjs(event.startTime.toDate()).format("D")}
            </p>
          </div>
          <div className="flex-1 flex items-center pl-2">
            <div className="w-full overflow-hidden ">
              <div className="text-sm font-helvetica flex-1 relative">
                <p className="font-semibold line-clamp-2"> {event.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="border-solid border-[#1f1d1a4d] my-3 md:my-5" /> */}
    </Link>
  );
};

export default UpcomingEventSection;
