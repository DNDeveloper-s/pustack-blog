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
import Linkify from "linkify-react";
import EventMap from "./EventMap";
import RSVPNowButton from "../shared/RSVPNowButton";

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

const GenericMeetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={35}
    height={35}
    viewBox="0 0 64 64"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={4.09}
        x2={59.91}
        y1={32}
        y2={32}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#00c0ff" />
        <stop offset={1} stopColor="#5558ff" />
      </linearGradient>
    </defs>
    <path
      fill='url("#a")'
      d="M9.47 12.75A4.998 4.998 0 1 1 17.77 9a5.016 5.016 0 0 1-8.3 3.75zm-3.42 8.63h13.44a1.963 1.963 0 0 0 1.96-1.96v-1.73a4.389 4.389 0 0 0-3.29-4.24 6.972 6.972 0 0 1-10.78 0 4.389 4.389 0 0 0-3.29 4.24v1.73a1.963 1.963 0 0 0 1.96 1.96zm11.72 26.08a4.998 4.998 0 1 0-8.3 3.751 5.002 5.002 0 0 0 8.3-3.75zm.7 4.551-.31-.1a7.013 7.013 0 0 1-10.78 0 4.389 4.389 0 0 0-3.29 4.24v1.73a1.965 1.965 0 0 0 1.96 1.97h13.44a1.965 1.965 0 0 0 1.96-1.97v-1.73a4.358 4.358 0 0 0-2.98-4.14zm27.76-4.55c.222 6.61 9.78 6.607 10 0-.205-6.608-9.795-6.608-10 0zm10.7 4.55-.31-.1a7.013 7.013 0 0 1-10.78 0 4.389 4.389 0 0 0-3.29 4.24v1.73a1.965 1.965 0 0 0 1.96 1.97h13.44a1.965 1.965 0 0 0 1.96-1.97v-1.73a4.358 4.358 0 0 0-2.98-4.14zm-.7-43.01a4.998 4.998 0 1 0-8.3 3.75A5.002 5.002 0 0 0 56.23 9zm.7 4.55-.31-.1a7.013 7.013 0 0 1-10.78 0 4.39 4.39 0 0 0-3.29 4.24v1.73a1.963 1.963 0 0 0 1.96 1.96h13.44a1.963 1.963 0 0 0 1.96-1.96v-1.73a4.358 4.358 0 0 0-2.98-4.14zM12.24 23.51a.997.997 0 0 0-1.361.38 24.33 24.33 0 0 0-2.65 16.604 1 1 0 0 0 1.962-.387 22.336 22.336 0 0 1 2.43-15.235 1 1 0 0 0-.38-1.363zm26.982 33.287a22.362 22.362 0 0 1-14.444 0 1 1 0 0 0-.656 1.889 24.27 24.27 0 0 0 15.756 0 1 1 0 0 0-.656-1.889zm15.375-15.515a1.004 1.004 0 0 0 1.175-.788 24.33 24.33 0 0 0-2.65-16.605 1 1 0 0 0-1.743.983 22.336 22.336 0 0 1 2.43 15.235 1.001 1.001 0 0 0 .788 1.175zM40.84 13.211a24.248 24.248 0 0 0-17.678 0 1 1 0 1 0 .738 1.859 22.319 22.319 0 0 1 16.202 0 1 1 0 0 0 .738-1.86zM37.83 43A2.168 2.168 0 0 0 40 40.83V29.17A2.168 2.168 0 0 0 37.83 27H22.67a1.033 1.033 0 0 0-.71.29l-4.67 4.67a1.033 1.033 0 0 0-.29.71v8.16A2.168 2.168 0 0 0 19.17 43zM47 38.08v-6.02a2.188 2.188 0 0 0-2.97-2.02l-2.03.82v8.39c.587.178 2.212 1.06 2.83 1A2.187 2.187 0 0 0 47 38.08z"
      data-original="url(#a)"
    />
  </svg>
);

const ZoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={35}
    height={35}
    fillRule="evenodd"
    viewBox="0 0 512 512"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={67.83}
        x2={474.19}
        y1={82.42}
        y2={389.98}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#4a8cff" />
        <stop offset={1} stopColor="#23b7ec" />
      </linearGradient>
    </defs>
    <path
      fill='url("#a")'
      d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0z"
      data-original="url(#a)"
    />
    <path
      fill="#FFF"
      fillRule="nonzero"
      d="M117.44 188.39v101.48c.1 22.95 18.84 41.41 41.69 41.32h147.93c4.21 0 7.59-3.38 7.59-7.49V222.21c-.09-22.94-18.83-41.41-41.69-41.32H125.03c-4.2 0-7.59 3.38-7.59 7.5zm206.63 39.58 61.07-44.61c5.3-4.39 9.42-3.29 9.42 4.66v136.04c0 9.05-5.03 7.96-9.42 4.67l-61.07-44.53z"
      data-original="#ffffff"
    />
  </svg>
);

const MeetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={35}
    height={35}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="#FF2820"
      d="M128 44.8 0 172.8l64 39.617 64-39.617 36.141-64z"
      data-original="#ff2820"
    />
    <path
      fill="#0084FF"
      d="M128 172.8H0v166.4l64 35.145 64-35.145z"
      data-original="#0084ff"
    />
    <path
      fill="#06D"
      d="M0 339.2v85.333C0 448 19.2 467.2 42.667 467.2H128l36.141-67.942L128 339.2z"
      data-original="#0066dd"
    />
    <path
      fill="#00AD3C"
      d="M485.565 90.246 406.4 152.957v.643l-25.819 98.57 25.819 99.753 78.813 63.431c10.574 8.873 26.787 1.42 26.787-12.422V102.668c0-13.842-15.861-21.295-26.435-12.422z"
      data-original="#00ad3c"
    />
    <path
      fill="#FFBA00"
      d="M406.4 152.957v-65.98c0-23.197-18.792-42.177-41.76-42.177H128v128h156.8V256l84.244-9.385z"
      data-original="#ffba00"
    />
    <path
      fill="#00AD3C"
      d="M284.8 339.2H128v128h236.64c22.968 0 41.76-18.952 41.76-42.116V352l-41.793-85.861L284.8 256z"
      data-original="#00ad3c"
    />
    <path
      fill="#00831E"
      d="m284.8 256 121.6 96V152.957z"
      data-original="#00831e"
    />
  </svg>
);

const TeamsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={35}
    height={35}
    viewBox="0 0 100 100"
    {...props}
  >
    <path
      fill="#464EB8"
      d="M84.025 35.881c5.797 0 10.513-4.729 10.513-10.54-.577-13.983-20.45-13.979-21.026 0 0 5.811 4.717 10.54 10.513 10.54z"
      data-original="#464eb8"
    />
    <path
      fill="#464EB8"
      d="M90.958 38.71H51.61v-3.68c.784.139 1.605.232 2.467.268.093.001.186-.006.279-.007a15.5 15.5 0 0 0 1.063-.053c.12-.011.239-.021.357-.035.403-.045.801-.104 1.193-.181.024-.005.05-.008.074-.012a14.377 14.377 0 0 0 5.167-2.17 14.504 14.504 0 0 0 3.693-3.615c.26-.341.497-.697.718-1.061.021-.036.044-.07.065-.107.17-.287.32-.584.466-.884.064-.13.13-.26.19-.392.154-.345.296-.696.421-1.053l.032-.088c1.427-4.208.774-9.156-1.676-12.856a14.476 14.476 0 0 0-2.268-2.574c-.176-.153-.344-.314-.529-.457a14.41 14.41 0 0 0-3.567-2.159 12.49 12.49 0 0 0-1.347-.493c-.264-.081-.538-.141-.808-.207-.239-.058-.475-.121-.717-.166-.2-.038-.405-.062-.607-.092-.352-.05-.704-.096-1.06-.121-.122-.009-.245-.012-.368-.018a14.095 14.095 0 0 0-1.088-.007c-2.08.121-3.926.558-5.543 1.24-.33.149-.664.294-.975.47-3.242 1.766-5.722 4.772-6.867 8.293a15.274 15.274 0 0 0-.187 8.129l.02.076.097.345c.039.137.085.273.128.409.039.11.08.219.121.329H8.774a5.168 5.168 0 0 0-5.162 5.162v37.672a5.168 5.168 0 0 0 5.162 5.162h20.122c.026.118.059.232.087.349 2.77 10.899 12.463 18.607 23.917 18.885 9.503-.231 17.666-5.721 21.753-13.592.061.022.124.038.185.059 10.182 3.851 21.752-4.229 21.546-15.131V44.122c.001-2.984-2.434-5.412-5.426-5.412z"
      data-original="#464eb8"
    />
    <path
      fill="#7B83EB"
      d="M77.444 44.232c.069-2.971-2.287-5.448-5.251-5.521H50.761a1.43 1.43 0 0 0-1.429 1.433v29.095a2.433 2.433 0 0 1-2.428 2.433H30.199a1.429 1.429 0 0 0-1.399 1.721c2.367 11.561 12.248 19.837 24.1 20.126 13.856-.34 24.866-11.914 24.544-25.767zm-23.367-8.934c.093.001.186-.006.279-.007.358-.005.713-.023 1.064-.053.12-.011.239-.021.357-.035.402-.045.801-.104 1.193-.181l.074-.013a14.377 14.377 0 0 0 5.167-2.17 14.508 14.508 0 0 0 3.694-3.615c.26-.341.497-.697.718-1.061.021-.036.044-.07.065-.107.17-.287.32-.585.466-.884.064-.13.13-.259.19-.392.154-.345.297-.696.421-1.053l.032-.088c1.427-4.208.774-9.157-1.676-12.856a14.476 14.476 0 0 0-2.268-2.574c-.176-.153-.344-.314-.529-.457a14.41 14.41 0 0 0-3.567-2.159A12.49 12.49 0 0 0 58.41 7.1c-.264-.081-.538-.14-.808-.207-.239-.058-.475-.121-.717-.166-.2-.038-.404-.062-.607-.092-.352-.05-.704-.096-1.06-.121-.122-.009-.245-.012-.367-.018a15.179 15.179 0 0 0-1.088-.005c-2.08.121-3.926.557-5.543 1.24-.33.149-.664.294-.975.47-3.242 1.767-5.723 4.773-6.867 8.294a15.274 15.274 0 0 0-.187 8.129l.02.076.097.345c.039.137.085.273.128.409.06.171.123.34.187.51h-.027c1.775 4.977 6.268 9.029 13.481 9.334z"
      data-original="#7b83eb"
    />
    <path
      fill="#464EB8"
      d="M46.448 25.783H8.774a5.168 5.168 0 0 0-5.162 5.162v37.672a5.168 5.168 0 0 0 5.162 5.162h37.674a5.167 5.167 0 0 0 5.161-5.162V30.945a5.166 5.166 0 0 0-5.161-5.162z"
      data-original="#464eb8"
    />
    <path
      fill="#FFF"
      d="M37.109 36.271h-19.28c-.771 0-1.395.625-1.395 1.396v3.514c0 .771.624 1.396 1.395 1.396h6.22v19.575c0 .771.624 1.396 1.395 1.396h4.134c.771 0 1.395-.625 1.395-1.396V42.577h6.136c.771 0 1.395-.625 1.395-1.396v-3.514c0-.771-.624-1.396-1.395-1.396z"
      data-original="#ffffff"
    />
  </svg>
);

export type MeetingLinkDetails = {
  icon: React.ReactNode;
  label: string;
};
export const getMeetLinkDetails = (url: string): MeetingLinkDetails => {
  if (typeof url !== "string") {
    return {
      icon: <GenericMeetIcon />,
      label: "Other",
    };
  }

  // Normalize the URL to avoid case sensitivity issues
  const normalizedUrl = url.toLowerCase();

  // Check for Google Meet link
  if (normalizedUrl.includes("meet.google.com")) {
    return {
      icon: <MeetIcon />,
      label: "Google Meet",
    };
  }

  // Check for Zoom link
  if (normalizedUrl.includes("zoom.us")) {
    return {
      icon: <ZoomIcon />,
      label: "Zoom",
    };
  }

  // Add more cases here for other platforms if needed
  // Example: Microsoft Teams
  if (normalizedUrl.includes("teams.microsoft.com")) {
    return {
      icon: <TeamsIcon />,
      label: "Microsoft Team",
    };
  }

  // If none of the above, return 'Other'
  return {
    icon: <GenericMeetIcon />,
    label: "Other",
  };
};

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

const MapEmbed = ({ mapLink }: { mapLink: string }) => {
  let embedUrl = "";

  // Check if the link is from Google Maps
  if (mapLink.includes("google.com/maps")) {
    // Convert to Google Maps embed link
    embedUrl = mapLink.replace("/maps", "/maps/embed/v1/place");
  }
  // Check if the link is from Apple Maps
  else if (mapLink.includes("apple.com/maps")) {
    // Convert to Apple Maps embed link
    const encodedUrl = encodeURIComponent(mapLink);
    embedUrl = `https://maps.apple.com/embed?address=${encodedUrl}`;
  } else {
    // If the link is not recognized, you can display an error message or a default view
    return <p>Invalid map link provided.</p>;
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        allowFullScreen
        style={{ border: 0 }}
        title="Map Embed"
      ></iframe>
    </div>
  );
};

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
          author: _event.author,
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
    console.log("Redirecting to home page | 399");
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
    <>
      <div
        className="h-[220px] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:bg-opacity-50 relative"
        style={{
          backgroundImage: `url(${event.displayImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <Image
            width={500}
            className="w-full h-full object-cover"
            height={600}
            src={imageUrl}
            alt="event"
          /> */}
        <div className="absolute top-0 left-0 w-full h-full flex items-end justify-start pb-6 px-3">
          <p className="font-featureBold text-[25px] text-white line-clamp-3">
            {event.title}
          </p>
        </div>
      </div>
      <div className="w-full h-screen bg-primary mt-[-20px] relative rounded-t-[18px]">
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
                    url={`https://pustack-blog.vercel.app/events?event_id=${event.id}`}
                    appendClassName="mt-4"
                  />
                )}
              </div>
            </div>
            <div className="pt-5 lg:pt-0 lg:pl-5 flex flex-col gap-6 justify-between">
              {event?.id && (
                <div>
                  <div className="py-1">
                    <RSVPNowButton
                      eventId={event.id}
                      containerClassName="mt-1 flex"
                    />
                  </div>
                </div>
              )}
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
            <div className="grid grid-cols-[16px_1fr] gap-4 md:gap-5">
              <div>
                <div className="styles_title">
                  <p>
                    <span className="inline-flex mr-2">
                      <FaCalendarCheck />
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="font-featureBold text-[20px] leading-[27px]">
                  <p>Description</p>
                </div>
                <div className="mt-2">
                  <p className="leading-[120%]">
                    <Linkify
                      options={{
                        render: (opts) => {
                          return (
                            <Link
                              href={opts.attributes.href}
                              target="_blank"
                              className="text-appBlue underline"
                            >
                              {opts.content}
                            </Link>
                          );
                        },
                      }}
                    >
                      {event.description}
                    </Linkify>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="styles_divider !my-6"></div>

          <div id={"organizer"}>
            <div className="grid grid-cols-[16px_1fr] gap-4 md:gap-5">
              <div>
                <div className="styles_title">
                  <p>
                    <span className="inline-flex mr-2">
                      <FaUser />
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="font-featureBold text-[20px] leading-[27px]">
                  <p>Organizer</p>
                </div>
                <div className="mt-1">
                  <div className="flex flex-col w-full items-center gap-2 p-4">
                    <div>
                      <AppImage
                        className="w-10 md:w-14 h-10 md:h-14 rounded-full"
                        width={30}
                        height={30}
                        src={event.organizer?.photoURL}
                        alt="Nothing"
                      />
                    </div>
                    <div>
                      <span className="text-lg md:text-2xl font-featureHeadline">
                        {event.organizer.name}
                      </span>
                    </div>
                  </div>
                  <p className="leading-[120%]">
                    <Linkify
                      options={{
                        render: (opts) => {
                          return (
                            <Link
                              href={opts.attributes.href}
                              target="_blank"
                              className="text-appBlue underline"
                            >
                              {opts.content}
                            </Link>
                          );
                        },
                      }}
                    >
                      {event.organizer.description}
                    </Linkify>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="styles_divider !my-6"></div>

          <div id="date_and_time">
            <div className="grid grid-cols-[16px_1fr] gap-4 md:gap-5">
              <div>
                <div className="styles_title">
                  <p>
                    <span className="inline-flex mr-2">
                      <DateTimeIcon />
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="font-featureBold text-[20px] leading-[27px]">
                  <p>Date & Time</p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center divide-x divide-dashed divide-[#1f1d1a19]">
                    <div className="flex-1">
                      <p className="text-sm mb-1 text-appBlack text-opacity-60">
                        Starts On:
                      </p>
                      <p>
                        <b>
                          {dayjs(event.startTime.toDate()).format(
                            "MMMM DD, YYYY"
                          )}
                        </b>
                      </p>
                      <p>
                        <b>
                          {dayjs(event.startTime.toDate()).format("hh:mm A")}
                        </b>
                      </p>
                    </div>
                    <div className="flex-1 pl-4">
                      <p className="text-sm mb-1 text-appBlack text-opacity-60">
                        Ends On:
                      </p>
                      <p>
                        <b>
                          {dayjs(event.endTime.toDate()).format(
                            "MMMM DD, YYYY"
                          )}
                        </b>
                      </p>
                      <p>
                        <b>{dayjs(event.endTime.toDate()).format("hh:mm A")}</b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="styles_divider !my-6"></div>

          <div id="venue">
            <div className="grid grid-cols-[16px_1fr] gap-4 md:gap-5">
              <div>
                <div className="styles_title">
                  <p>
                    <span className="inline-flex mr-2">
                      <PinIcon />
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="font-featureBold text-[20px] leading-[27px]">
                  <p>Venue</p>
                </div>
                <div className="mt-2">
                  {event.venue.type === "offline" ? (
                    <Link href={event.venue.mapsLink ?? "#"} target="_blank">
                      {/* {event.venue.image && (
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
                      )} */}
                      {event.venue.mapsLink && (
                        <>
                          <div className="w-full max-w-[500px] h-auto aspect-video overflow-hidden mt-3">
                            <EventMap mapLink={event.venue.mapsLink} />
                          </div>
                          <h3 className="font-featureHeadline text-[14px] md:text-[18px] mt-2 text-appBlue">
                            {event.venue.name}
                          </h3>
                        </>
                      )}
                    </Link>
                  ) : (
                    // <div className="p-4 border divide-x divide-dashed divide-[#1f1d1a19] border-dashed border-[#1f1d1a] rounded-2xl bg-lightPrimary">
                    //   <div className="flex-1">
                    //     <p className="text-sm text-appBlack text-opacity-60">
                    //       Meet link:
                    //     </p>
                    //     <Link
                    //       href={event.venue.meetingLink ?? "#"}
                    //       target="_blank"
                    //       className="text-appBlue"
                    //     >
                    //       <b>
                    //         <u>{event.venue.meetingLink}</u>
                    //       </b>
                    //     </Link>
                    //   </div>
                    // </div>
                    <Link target="_blank" href={event.venue.meetingLink ?? "#"}>
                      <div className="flex-1 flex items-center gap-3 cursor-pointer">
                        <div>
                          {getMeetLinkDetails(event.venue.meetingLink).icon}
                        </div>
                        <div>
                          <p className="text-lg font-featureHeadline">
                            Online Meeting
                          </p>
                          <p className="text-xs">
                            Join{" "}
                            {getMeetLinkDetails(event.venue.meetingLink).label}{" "}
                            Link
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="styles_divider !my-6"></div>

          <div id="contact">
            <div className="grid grid-cols-[16px_1fr] gap-4 md:gap-5">
              <div>
                <div className="styles_title">
                  <p>
                    <span className="inline-flex mr-2">
                      <ContactIcon />
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="font-featureBold text-[20px] leading-[27px]">
                  <p>Contact</p>
                </div>
                <div className="mt-2">
                  <p className="leading-[120%]">
                    <b>{event.organizer.email}</b>
                  </p>
                  <p className="leading-[120%] mt-2">
                    <b>{event.organizer.contact}</b>
                  </p>
                </div>
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
      </div>
    </>
  );
}
