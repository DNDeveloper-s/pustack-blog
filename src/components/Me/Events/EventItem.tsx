import {
  useDeletePostDraft,
  usePublishPost,
  useUnPublishPost,
} from "@/api/post";
import JoditPreview from "@/components/AdminEditor/JoditPreview";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { Checkbox } from "@/components/SignUpForNewsLetters/SignUpForNewsLetters";
import { Post, PostStatus } from "@/firebase/post-v2";
import { useDisclosure } from "@nextui-org/modal";
import dayjs from "@/lib/dayjsConfig";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import {
  MdDelete,
  MdEdit,
  MdModeEdit,
  MdPublish,
  MdUnpublished,
} from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { IoIosEye } from "react-icons/io";
import { Tooltip } from "antd";
import { useMemo } from "react";
import { getSections } from "@/components/SlateEditor/utils/helpers";
import { CustomElement } from "../../../../types/slate";
import { Event } from "@/firebase/event";
import AppImage from "@/components/shared/AppImage";
import { getMeetLinkDetails } from "@/components/Events/EventDetails";
import { getRandomDarkHexColor } from "@/lib/colors";

export const noImageUrl =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

const colorScheme = {
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

function EventItemActions({
  disclosureOptions,
  disclosureOptionsPublish,
  disclosureOptionsUnPublish,
  postId,
  status,
}: {
  disclosureOptions: any;
  disclosureOptionsPublish: any;
  disclosureOptionsUnPublish: any;
  postId: string;
  status: PostStatus;
}) {
  const router = useRouter();
  // const disclosureOptions = useDisclosure();
  const isReadyToPublish = status === "draft" || status === "unpublished";

  return (
    <Dropdown
      classNames={{
        content: "!bg-primary !rounded-[4px] p-0 !min-w-[100px]",
        base: "!p-[0_4px]",
        arrow: "!bg-primary",
      }}
      style={{
        // @ts-ignore
        "--nextui-content1": "55 70% 91%",
        backgroundColor: "#f8f5d7",
        borderRadius: "4px",
      }}
      placement="bottom-end"
      showArrow={true}
    >
      <DropdownTrigger className="!scale-100 !opacity-100">
        <div className="relative">
          <SlOptionsVertical />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{
          list: "p-0 m-0 divide-y divide-dashed divide-[#fcfae4] !gap-0",
          base: "!p-[0_5px]",
        }}
      >
        <DropdownItem
          onClick={() => {
            router.push("/posts/create?post_id=" + postId);
          }}
          className="!p-[9px_9px_5px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            <MdEdit />
            <span>Edit</span>
          </p>
        </DropdownItem>
        <DropdownItem
          onClick={() => disclosureOptions.onOpen()}
          className="!p-[6px_9px_6px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            <IoIosEye />
            <span>View</span>
          </p>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            isReadyToPublish
              ? disclosureOptionsPublish.onOpen()
              : disclosureOptionsUnPublish.onOpen();
          }}
          className="!p-[6px_9px_9px] !pl-1 !rounded-none !bg-transparent"
        >
          <p
            className="text-[10px] grid grid-cols-[13px_1fr] items-center gap-2 uppercase"
            style={{
              fontWeight: 600,
              fontVariationSettings: '"wght" 700,"opsz" 10',
            }}
          >
            {isReadyToPublish ? (
              <>
                <MdPublish />
                <span>Publish</span>
              </>
            ) : (
              <>
                <MdUnpublished />
                <span>Unpublish</span>
              </>
            )}
          </p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function EventItemHeader() {
  return (
    // <div
    //   className={
    //     "grid grid-cols-[1fr_90px_80px_30px] items-center py-3 pt-4 px-3 bg-lightPrimary mb-2 text-[11px]"
    //   }
    // >
    //   {/* <div className="self-center">
    //     <Checkbox id={"item.key"} />
    //   </div> */}
    //   <div className="min-w-[120px]">Event Title</div>
    //   <div className="text-center">Topic</div>
    //   <div className="text-center">Timestamp</div>
    //   <div className="text-center">Act.</div>
    // </div>
    <div className="text-[18px] py-2 px-3 font-featureBold">
      <p>Events</p>
    </div>
  );
}

export default function EventItem({
  event,
  handleSelectChange,
  isSelected,
}: {
  event: Event;
  handleSelectChange: (id: string, selected: boolean) => void;
  isSelected: boolean;
}) {
  const disclosureOptions = useDisclosure();
  const router = useRouter();

  const disclosureOptionsUnPublish = useDisclosure();
  const disclosureOptionsPublish = useDisclosure();
  const {
    mutate: postUnpublishPost,
    isPending,
    error: unpublishError,
  } = useUnPublishPost({
    onSuccess: () => {
      disclosureOptionsUnPublish.onClose();
    },
  });
  const {
    mutate: postPublishPost,
    isPending: isPublishPending,
    error: publishError,
  } = usePublishPost({
    onSuccess: () => {
      disclosureOptionsPublish.onClose();
    },
  });

  return (
    <div
      className={
        "grid grid-cols-[1fr_30px] items-start py-2 px-3 " +
        (isSelected ? "bg-primaryVariant1" : "bg-transparent")
      }
    >
      {/* <div className="self-center">
        <Checkbox
          id={"item.key"}
          onChange={(checked) => handleSelectChange(post.id as string, checked)}
        />
      </div> */}
      <div className="flex items-start gap-3 overflow-hidden min-w-[120px]">
        <div className="mt-1 w-[90px] h-[90px] overflow-hidden border-2 border-gray-200 shadow-sm rounded flex-shrink-0">
          <AppImage
            width={200}
            height={200}
            alt="Event Image"
            className="w-full h-full object-cover"
            src={event.displayImage}
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex flex-col items-start justify-start overflow-hidden">
            <h2 className="text-[18px] leading-[24px] font-featureHeadline font-medium mt-0 line-clamp-2 overflow-hidden">
              {event.title}
            </h2>
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
              {/* <span
                className="flex-shrink-0 inline-block py-0.5 ml-3 px-2 font-helvetica uppercase rounded text-[10px] text-white"
                style={{
                  backgroundColor:
                    dayjs() <= dayjs(event.startTime?.toDate())
                      ? "#32CD32"
                      : "#A9A9A9",
                  fontVariationSettings: `'wght' 700`,
                }}
              >
                {dayjs() <= dayjs(event.startTime?.toDate())
                  ? "Upcoming"
                  : "Past"}
              </span> */}
            </p>
            <div className="flex gap-1 items-center">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    dayjs() <= dayjs(event.startTime?.toDate())
                      ? "#32CD32"
                      : "#A9A9A9",
                }}
              ></div>
              <p
                style={{ color: event.background ?? getRandomDarkHexColor() }}
                className="text-[11px] text-opacity-60"
              >
                {dayjs(event.startTime.toDate()).format("h:mm A")} -{" "}
                {dayjs(event.endTime.toDate()).format("h:mm A")}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="flex-shrink-0 w-4 h-4 rounded-full">
                <AppImage
                  src={event.organizer.photoURL}
                  alt="Organizer Image"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <span className="leading-[120%] font-helvetica text-[14px] whitespace-nowrap flex-1 overflow-hidden text-ellipsis">
                {event.organizer.name}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-center">
        <Tooltip
          title={event.status.toUpperCase()}
          style={{ fontSize: "13px" }}
          placement="top"
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 block"
            style={{ backgroundColor: colorScheme[event.status]?.bg }}
          ></span>
        </Tooltip>
        <span className="ml-1 text-[10px] text-[#53524c] font-helvetica uppercase leading-[14px] whitespace-nowrap">
          {event.title}
        </span>
      </div>
      <div>
        <p className="leading-[120%] font-helvetica text-center text-tertiary text-[10px]">
          <span>{dayjs().to(dayjs(event?.startTime?.toDate()))}</span>
        </p>
      </div> */}
      <div className="flex items-center py-2 justify-center gap-5 text-xs">
        <EventItemActions
          disclosureOptions={disclosureOptions}
          disclosureOptionsPublish={disclosureOptionsPublish}
          disclosureOptionsUnPublish={disclosureOptionsUnPublish}
          postId={event.id as string}
          status={event.status}
        />
      </div>
    </div>
  );
}
