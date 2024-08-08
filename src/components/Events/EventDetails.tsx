"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { avatar, minervaMiniImage } from "@/assets";
import dayjs from "dayjs";
import { DocumentData, Timestamp } from "firebase/firestore";
import { useUser } from "@/context/UserContext";
import { db, functions, storage } from "@/lib/firebase";
import { FaCalendar, FaRegStar, FaUser } from "react-icons/fa";
import { FaCalendarCheck, FaCopy, FaStar } from "react-icons/fa6";
import useScreenSize from "@/hooks/useScreenSize";
import useInView from "@/hooks/useInView";
import { useJoinModal } from "@/context/JoinModalContext";
import { Event } from "@/firebase/event";
import BlogImage from "../shared/BlogImage";
import MoreFromMinerva from "../BlogPost/MoreFromMinerva";
import { IoIosPin, IoMdMap } from "react-icons/io";
import { ShareLinks } from "../BlogPost/BlogPostShareLinks";
import AppImage from "../shared/AppImage";

const DateTimeIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M.468 12.8h12.25c.11 0 .217-.044.3-.123.119-.113 2.803-2.74 2.966-8.41H2.827c-.163 5.147-2.634 7.567-2.66 7.59a.583.583 0 0 0-.138.593c.067.21.242.35.44.35ZM15.531 1.067h-2.344V.533c0-.298-.206-.533-.468-.533-.263 0-.47.235-.47.533v.534H9.876V.533c0-.298-.207-.533-.47-.533-.262 0-.468.235-.468.533v.534H6.593V.533C6.593.235 6.387 0 6.125 0c-.263 0-.47.235-.47.533v.534H3.313c-.263 0-.469.234-.469.533v1.6H16V1.6c0-.299-.206-.533-.469-.533Z"
    />
    <path
      fill="#000"
      d="M13.621 13.494a1.312 1.312 0 0 1-.902.373H2.843v1.6c0 .294.21.533.469.533h12.22c.258 0 .468-.239.468-.533V9.488c-.904 2.523-2.165 3.802-2.379 4.006Z"
    />
  </svg>
);

const ContactIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={16}
    height={16}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M436.992 74.953c-99.989-99.959-262.08-99.935-362.039.055s-99.935 262.08.055 362.039 262.08 99.935 362.039-.055a256 256 0 0 0-.055-362.039zm-49.289 281.652-.034.034v-.085l-12.971 12.885a68.267 68.267 0 0 1-64.427 18.432 226.834 226.834 0 0 1-65.877-29.525 304.371 304.371 0 0 1-51.968-41.899 306.71 306.71 0 0 1-38.827-47.104 238.907 238.907 0 0 1-29.184-59.051 68.265 68.265 0 0 1 17.067-69.717l15.189-15.189c4.223-4.242 11.085-4.257 15.326-.034l.034.034 47.957 47.957c4.242 4.223 4.257 11.085.034 15.326l-.034.034-28.16 28.16c-8.08 7.992-9.096 20.692-2.389 29.867a329.334 329.334 0 0 0 33.707 39.339 327.314 327.314 0 0 0 44.373 37.291c9.167 6.394 21.595 5.316 29.525-2.56l27.221-27.648c4.223-4.242 11.085-4.257 15.326-.034l.034.034 48.043 48.128c4.243 4.222 4.258 11.083.035 15.325z"
      data-original="#000000"
    />
  </svg>
);

const PinIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={16}
    height={16}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 64 64"
    {...props}
  >
    <path
      d="M32 0A24.032 24.032 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24.032 24.032 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z"
      data-original="#000000"
    />
  </svg>
);

const sections = [
  {
    id: "description",
    title: "Description",
    icon: <FaCalendarCheck />,
  },
  {
    id: "organizer",
    title: "Organizer",
    icon: <FaUser />,
  },
  {
    id: "date_and_time",
    title: "Date & Time",
    icon: <DateTimeIcon />,
  },
  {
    id: "venue",
    title: "Venue",
    icon: <PinIcon />,
  },
  {
    id: "contact",
    title: "Contact",
    icon: <ContactIcon />,
  },
];

export default function EventDetails({ _event }: { _event?: DocumentData }) {
  const params = useParams();
  const [event, setEvent] = useState<Event | null | undefined>(null);
  const { user } = useUser();
  const { ref, isInView } = useInView();
  const deleteModalRef = useRef<any>();
  const router = useRouter();
  const { isTabletScreen, isDesktopScreen, isMobileScreen } = useScreenSize();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [rsvped, setRsvped] = useState(false);

  const { setOpen } = useJoinModal();

  useEffect(() => {
    const _storageRef = storageRef(storage, `static/minerva.png`);
    getDownloadURL(_storageRef)
      .then((url) => {
        console.log("url - ", url);
      })
      .catch((e) => {
        console.log("error - ", e);
      });
  }, []);

  useEffect(() => {
    if (_event) {
      setEvent(
        new Event({
          id: _event.id,
          title: _event.title,
          description: _event.description,
          startTime: Timestamp.fromDate(dayjs(_event.startTime).toDate()),
          endTime: Timestamp.fromDate(dayjs(_event.endTime).toDate()),
          status: _event.status,
          organizer: _event.organizer,
          venue: _event.venue,
          displayImage: _event.displayImage,
          isAllDay: _event.isAllDay,
          background: _event.background,
          timestamp: _event.timestamp,
        })
      );
    } else {
      setEvent(undefined);
    }
  }, [_event]);

  const hasPost = !!event;
  const hasNoPost = !event;

  if (event === null) {
    return null;
  }

  if (event === undefined) {
    router.push("/");
    return null;
  }

  const getRSVPButtonLabel = () => {
    if (!user) return "Sign In Now.";
    if (!rsvped) return "I'll be there.";
    return "I can't make it.";
  };

  const getRSVPMessage = () => {
    if (rsvped && user)
      return (
        <>
          Awesome! You&apos;ll start receiving all updates at
          <b className="style_bold">{" " + user.email}</b>
        </>
      );

    return (
      <>
        <b className="style_bold">RSVP for this event, </b>
        and get notified at the earliest.
      </>
    );
  };

  const handleRSVPButtonClick = () => {
    if (!user) {
      setOpen(true);
      return;
    }
    setRsvped(!rsvped);
  };

  return (
    <div className="w-full h-full pb-10 overflow-auto">
      <div
        ref={ref}
        className="grid divide-y lg:divide-y-0 divide-x-0 lg:divide-x divide-dashed divide-[#1f1d1a4d] grid-cols-1 lg:grid-cols-[auto_18.3125rem] my-6 gap-4 lg:gap-0"
      >
        <div className="pb-5 lg:pb-0 lg:pr-5">
          <div className="flex items-end justify-between">
            <div className="mr-2">
              <img
                className="w-[38px] h-[38px]"
                src={
                  event?.organizer?.photoURL
                    ? event?.organizer?.photoURL
                    : avatar.src
                }
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <h3 className="leading-[120%] text-[17px] group-hover:text-appBlue">
                {event?.organizer?.name}
              </h3>
              {/* <p
                  className="leading-[120%] text-[15px] text-tertiary group-hover:text-appBlue font-helvetica uppercase"
                  style={{
                    fontWeight: "300",
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                >
                  POLITICS
                </p> */}
            </div>
            {/* <div className="flex items-center gap-3">
                  {post?.sections && (
                    <span className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                      {
                        readingTime(
                          post.nodes
                            ? extractTextFromEditor(post.nodes)
                            : Section.mergedContent(post.sections)
                        ).text
                      }
                    </span>
                  )}
                  {!isBookMarked ? (
                    <FaRegStar
                      className="cursor-pointer"
                      onClick={() => handleBookMark(true)}
                    />
                  ) : (
                    <FaStar
                      className="text-[#d9c503] cursor-pointer"
                      onClick={() => handleBookMark(false)}
                    />
                  )}
                  {user?.email === post?.author.email && (
                    <MdModeEdit
                      className="cursor-pointer"
                      onClick={() =>
                        router.push("/posts/create?post_id=" + post?.id)
                      }
                    />
                  )}
                  {user?.email === post?.author.email && (
                    <MdDelete
                      className="cursor-pointer"
                      onClick={() => {
                        deleteModalRef.current?.handleChangeOpen(true);
                      }}
                    />
                  )}
                </div> */}
          </div>
          <hr className="border-dashed border-[#1f1d1a4d] my-2" />
          <div className="flex gap-5 items-center justify-between">
            <div className="flex gap-x-8 gap-y-2 items-center flex-wrap">
              <p className="text-[13px] text-[#53524c] font-helvetica leading-[14px]">
                Updated{" "}
                {dayjs(event?.timestamp).format("MMM DD, YYYY, H:mm a") +
                  " " +
                  " GMT " +
                  dayjs(event?.timestamp).format("Z")}
              </p>
              {/* <p className="text-[13px] text-[#53524c] font-helvetica uppercase leading-[14px]">
                    {post?.topic}
                  </p> */}
            </div>
            {/* <NavigatorShare handleShare={handleShare} /> */}
          </div>
          <div className="mt-4">
            <h2
              className="font-featureHeadline line-clamp-2 leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
              style={{
                fontSize: "32px",
                fontWeight: "395",
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              {event?.title}
            </h2>
            {event?.displayImage && (
              <BlogImage
                className="mt-4 w-[77%] cover-figure"
                src={
                  event?.displayImage
                  // `https://pustack-blog.vercel.app/api/fetch-image?imageUrl=` +
                  // encodeURIComponent(post?.snippetData?.image)
                }
                style={{
                  aspectRatio: "auto 700 / 453",
                }}
              />
            )}
            {/* {post && (
                  <BlogPostShareLinks post={post} appendClassName="mt-4" />
                )} */}
            {event.id && (
              <ShareLinks
                title={event.title}
                id={event.id}
                url={`https://pustack-blog.vercel.app/events/${event.id}`}
                appendClassName="mt-4"
              />
            )}
          </div>
        </div>
        <div className="pt-5 lg:pt-0 lg:pl-5 flex flex-col gap-6 justify-between">
          <div>
            <div className="py-1">
              <p className="text-sm font-featureHeadline style_intro leading-[120%]">
                {getRSVPMessage()}
              </p>
              <button
                className="mt-2 h-[40px] leading-[40px] w-full border-[#1f1d1a] border font-featureRegular text-[16px]"
                onClick={handleRSVPButtonClick}
              >
                {getRSVPButtonLabel()}
              </button>
            </div>
            {/* {!user && (
                  <SignUpForNewsLettersButton
                    containerClassName="flex mt-1"
                    checkedLetters={newsLettersList}
                  />
                )} */}
          </div>
          {sections?.length > 0 && (
            <div className="flex flex-col gap-1">
              <h3
                className="text-[#1f1d1a] text-[16px] font-featureHeadline"
                style={{
                  fontWeight: 400,
                  fontVariationSettings: '"wght" 500,"opsz" 10',
                }}
              >
                About this event:
              </h3>
              {sections?.map((section, index) => (
                <>
                  <hr className="border-dashed border-[#1f1d1a4d] my-2" />
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => {
                      router.push("#" + section.id);
                    }}
                  >
                    <h3
                      className="text-[#1f1d1a] text-[16px] font-featureHeadline capitalize"
                      style={{
                        fontWeight: 400,
                        fontVariationSettings: '"wght" 500,"opsz" 10',
                        alignItems: "center",
                        gap: "10px",
                        display: "grid",
                        gridTemplateColumns: "16px 1fr",
                      }}
                    >
                      <span className="inline-flex">
                        {/* <img
                              src={section.icon}
                              alt="icon"
                              className="h-auto w-auto inline"
                            /> */}
                        {section.icon}
                      </span>
                      {section.title}
                    </h3>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-dashed border-[#1f1d1a4d] mt-[20px]" />
      <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />

      <div className="mt-8" id={"description"}>
        <div className="styles_title">
          <p>
            <span className="inline-flex mr-2">
              <FaCalendarCheck />
            </span>
            Description
          </p>
        </div>
      </div>
      <div>
        <p>{event.description}</p>
      </div>

      <div className="mt-8" id={"organizer"}>
        <div className="styles_divider"></div>
        <div className="styles_title">
          <p>
            <span className="inline-flex mr-2">
              <FaUser />
            </span>
            Organizer
          </p>
        </div>
      </div>
      <div className="mt-5">
        <div className="border divide-y divide-dashed divide-[#1f1d1a65] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
          <div className="flex items-center gap-2 p-4">
            <div>
              <AppImage
                className="w-6 md:w-8 h-6 md:h-8 rounded-full"
                width={30}
                height={30}
                src={event.organizer?.photoURL}
                alt="Nothing"
              />
            </div>
            <div>
              <span className="text-base md:text-lg font-featureHeadline">
                {event.organizer.name}
              </span>
            </div>
          </div>
          <div className="flex-1 p-4">
            <p className="text-sm mb-1 text-appBlack text-opacity-60">
              {event.organizer.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8" id={"date_and_time"}>
        <div className="styles_divider"></div>
        <div className="styles_title">
          <p>
            <span className="inline-flex mr-2">
              <DateTimeIcon />
            </span>
            Date & Time
          </p>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center p-4 border divide-x divide-dashed divide-[#1f1d1a19] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
          <div className="flex-1">
            <p className="text-sm mb-1 text-appBlack text-opacity-60">
              Starts On:
            </p>
            <p>
              {/* <b>September 07, 2024</b> */}
              <b>{dayjs(event.startTime.toDate()).format("MMMM DD, YYYY")}</b>
            </p>
            <p>
              {/* <b>09:00 AM</b> */}
              <b>{dayjs(event.startTime.toDate()).format("hh:mm A")}</b>
            </p>
          </div>
          <div className="flex-1 pl-4">
            <p className="text-sm mb-1 text-appBlack text-opacity-60">
              Ends On:
            </p>
            <p>
              {/* <b>September 07, 2024</b> */}
              <b>{dayjs(event.endTime.toDate()).format("MMMM DD, YYYY")}</b>
            </p>
            <p>
              {/* <b>11:00 AM</b> */}
              <b>{dayjs(event.endTime.toDate()).format("hh:mm A")}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8" id={"venue"}>
        <div className="styles_divider"></div>
        <div className="styles_title">
          <p>
            <span className="inline-flex mr-2">
              <PinIcon />
            </span>
            Venue
          </p>
        </div>
      </div>
      <div className="mt-5">
        {event.venue.type === "offline" ? (
          <Link href={event.venue.mapsLink ?? "#"}>
            <div className="flex items-center before:absolute relative before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:bg-opacity-60 overflow-hidden before:z-[2] border divide-x divide-dashed divide-[#1f1d1a19] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
              <AppImage
                className="w-full aspect-video rounded-2xl"
                width={1000}
                height={1000}
                src={event.venue.image}
                alt="Nothing"
              />
              <div className="absolute bottom-3 md:bottom-5 w-full z-10 px-3 md:px-8 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-featureHeadline text-[18px] md:text-[25px]">
                    {event.venue.name}
                  </h3>
                  <p className="text-white text-[12px] md:text-[16px] text-opacity-40">
                    Open in maps
                  </p>
                </div>
                <div className="w-10 h-10 text-xl text-gray-400 border border-gray-500 rounded-full bg-gray-700 flex items-center justify-center">
                  <IoMdMap />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-4 border divide-x divide-dashed divide-[#1f1d1a19] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
            <div className="flex-1">
              <p className="text-sm text-appBlack text-opacity-60">
                Meet link:
              </p>
              <Link
                href={event.venue.meetingLink ?? "#"}
                target="_blank"
                className="text-appBlue"
              >
                <b>
                  <u>{event.venue.meetingLink}</u>
                </b>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8" id={"contact"}>
        <div className="styles_divider"></div>
        <div className="styles_title">
          <p>
            <span className="inline-flex mr-2">
              <ContactIcon />
            </span>
            Contact
          </p>
        </div>
      </div>
      <div className="mt-5">
        <div className="p-4 border divide-x divide-dashed divide-[#1f1d1a19] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
          <div className="flex-1">
            <p className="text-sm text-appBlack text-opacity-60">Email:</p>
            <p>
              <b>{event.organizer.email}</b>
            </p>
          </div>
          <div className="flex-1 mt-3">
            <p className="text-sm text-appBlack text-opacity-60">Phone:</p>
            <p>
              <b>{event.organizer.contact}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Image alt="Minerva" src={minervaMiniImage} className="w-[16px]" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[10px]" />
        <hr className="border-dashed border-[#1f1d1a4d] mt-[1px]" />
      </div>
      <MoreFromMinerva />
    </div>
  );
}
