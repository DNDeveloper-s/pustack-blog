import {
  useDeletePostDraft,
  usePublishPost,
  useUnPublishPost,
} from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";
import { getSections } from "@/components/SlateEditor/utils/helpers";
import { Post } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdPublish, MdUnpublished } from "react-icons/md";
import { CustomElement } from "../../../../types/slate";
import { noImageUrl } from "./EventItem";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Tooltip } from "antd";
import { Event } from "@/firebase/event";
import AppImage from "@/components/shared/AppImage";
import { getMeetLinkDetails } from "@/components/Events/EventDetails";
import { getRandomDarkHexColor } from "@/lib/colors";
import Link from "next/link";

export const colorScheme = {
  draft: {
    bg: "#FFA500",
    text: "#CC7A00",
  },
  scheduled: {
    bg: "#1E90FF",
    text: "#0C5A9E",
  },
  published: {
    bg: "#32CD32",
    text: "#228B22",
  },
  unpublished: {
    bg: "#A9A9A9",
    text: "#ffffff",
  },
};

export function EventItemDesktopHeader() {
  return (
    <div
      className={
        "grid grid-cols-[1fr_100px_150px_160px_100px] items-center py-3 px-6 bg-lightPrimary mb-2"
      }
    >
      {/* <div className="self-center">
        <Checkbox id={"item.key"} />
      </div> */}
      <div className="pl-1">Event Title</div>
      <div className="text-center">Status</div>
      <div className="text-center">Organizer</div>
      <div className="text-center">Timestamp</div>
      <div className="text-center">Actions</div>
    </div>
  );
}

export default function EventItemDesktop({
  event,
  handleSelectChange,
  isSelected,
}: {
  event: Event;
  handleSelectChange: (id: string, selected: boolean) => void;
  isSelected: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className={
        "grid grid-cols-[1fr_100px_150px_160px_100px] items-center py-3 px-6 " +
        (isSelected ? "bg-primaryVariant1" : "bg-lightPrimary")
      }
    >
      {/* <div className="self-center">
        <Checkbox
          id={"item.key"}
          onChange={(checked) => handleSelectChange(post.id as string, checked)}
        />
      </div> */}
      <div className="flex items-start gap-3 overflow-hidden">
        <div className="mt-1 w-16 h-16 overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <AppImage
            width={200}
            height={200}
            alt="Display Image"
            className="w-full h-full object-cover"
            src={event.displayImage}
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-start justify-start flex-col overflow-hidden gap-2">
            <Link
              href={"/events?event_id=" + event.id}
              className="text-[22px] font-featureHeadline font-medium mt-0 text-ellipsis whitespace-nowrap overflow-hidden w-full"
            >
              {event.title}
            </Link>
            <p>
              <span className="text-[13px] text-[#676662] font-helvetica leading-[14px]">
                Venue:{" "}
              </span>
              <span className="ml-1 text-[13px] text-[#53524c] font-helvetica leading-[14px] whitespace-nowrap">
                {event.venue.type === "online"
                  ? `Online via ${
                      getMeetLinkDetails(event.venue.meetingLink).label
                    }`
                  : event.venue.name}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span
          className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white"
          style={{
            backgroundColor:
              dayjs() <= dayjs(event.startTime?.toDate())
                ? "#32CD32"
                : "#A9A9A9",
            fontVariationSettings: `'wght' 700`,
          }}
        >
          {dayjs() <= dayjs(event.startTime?.toDate()) ? "Upcoming" : "Past"}
        </span>
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex-shrink-0 w-6 h-6 rounded-full">
            <AppImage
              src={event.organizer.photoURL}
              alt="Organizer Image"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <span className="leading-[120%] font-helvetica text-sm whitespace-nowrap flex-1 overflow-hidden text-ellipsis">
            {event.organizer.name}
          </span>
        </div>
      </div>
      <div style={{ color: event.background ?? getRandomDarkHexColor() }}>
        <p className="leading-[120%] font-helvetica text-center text-sm mb-1">
          {dayjs(event.startTime.toDate()).format("D MMM, YY")}
        </p>
        <p className="leading-[120%] font-helvetica text-center  text-xs">
          {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
          {dayjs(event.endTime.toDate()).format("h:mm A")}
        </p>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          onClick={() => {
            router.push("/events/create?event_id=" + event.id);
          }}
        >
          <MdModeEdit />
        </div>
        <Link
          className="flex items-center gap-1 cursor-pointer hover:text-appBlue"
          href={"/events?event_id=" + event.id}
          prefetch={true}
        >
          <FaEye />
        </Link>
        <div className="flex items-center gap-1 cursor-pointer text-danger-500 hover:text-danger-700">
          <MdDelete />
        </div>
      </div>
    </div>
  );
}
