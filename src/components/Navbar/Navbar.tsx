"use client";

import Image from "next/image";
import Logo from "../shared/Logo";
import earthSpinning from "@/assets/images/spinning-earth.gif";
import navOpen from "@/assets/svgs/nav-open.svg";
import navClose from "@/assets/svgs/nav-close.svg";
import Link from "next/link";
import { WorldClockWithLabel } from "../shared/WorldClock2";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { topics, url } from "@/constants";
import { navYouAreHere } from "@/assets";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useMediaQuery } from "react-responsive";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { TiHome } from "react-icons/ti";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { FaCaretDown } from "react-icons/fa";
import AccountsModal, { AccountsDrawer } from "./Accounts/AccountsModal";
import AppImage from "../shared/AppImage";
import dynamic from "next/dynamic";
const DeleteAccountModal = dynamic(
  () => import("./Accounts/DeleteAccountModal"),
  {
    ssr: false,
  }
);
// import DeleteAccountModal from "./Accounts/DeleteAccountModal";
import { useDisclosure } from "@nextui-org/modal";
import { toDashCase } from "@/firebase/signal";
import { useJoinModal } from "@/context/JoinModalContext";
import useScreenSize from "@/hooks/useScreenSize";
import { motion, useScroll, useTransform, frame } from "framer-motion";
import { useGetClosestEvent } from "@/api/event";
import UpcomingEventSection from "../Events/UpcomingEventSection";

const managePaths = [
  { key: "create-post", label: "CREATE POST", href: "/posts/create" },
  { key: "create-signal", label: "CREATE SIGNAL", href: "/signals/create" },
  { key: "create-event", label: "CREATE EVENT", href: "/events/create" },
  // { key: "view-posts", label: "VIEW MY POSTS", href: "/me/posts" },
  // { key: "view-signals", label: "VIEW MY SIGNALS", href: "/me/signals" },
];

const navLinks = topics.map((topic) => ({
  key: toDashCase(topic),
  label: topic,
  href: toDashCase(topic) === "home" ? "/" : `/${toDashCase(topic)}`,
}));

interface CurrentTime {
  time: string;
  date: string;
}

function SignOutButton({ noCaret }: { noCaret?: boolean }) {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-1 cursor-pointer">
      <div>
        <AppImage
          height={13}
          width={13}
          className="w-[13px] h-[13px] relative z-10 rounded-full object-cover border border-primaryText border-opacity-30"
          src={user?.image_url}
          alt="userdp"
          // @ts-ignore
          unoptimized
          draggable={false}
        />
      </div>
      <div
        className="text-[10px] flex justify-end font-helvetica text-primaryText"
        // onClick={() => {
        //   // signOut();
        //   // signOutWithAuth();
        // }}
        style={{
          fontWeight: 600,
          fontVariationSettings: '"wght" 700,"opsz" 10',
        }}
      >
        <span className="max-w-[70px] overflow-hidden overflow-ellipsis whitespace-nowrap uppercase">
          {user?.name?.split(" ")[0] ?? "My Account"}
        </span>
      </div>
      {!noCaret && (
        <FaCaretDown className="text-[10px] flex justify-end font-helvetica text-primaryText" />
      )}
    </div>
  );
}

function NavItem({
  href,
  label,
  isFirst,
  isLast,
}: {
  href: string;
  label: string;
  isLast?: boolean;
  isFirst?: boolean;
}) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      prefetch={true}
      href={href}
      className={
        "font-featureBold relative whitespace-nowrap " +
        (isActive ? "text-appBlue" : "text-appBlack")
      }
    >
      <span style={{ opacity: isActive ? 0 : 1 }}>{label}</span>
      <span
        className={
          "uppercase absolute " +
          (isFirst
            ? "left-0"
            : isLast
            ? "right-0"
            : "left-1/2 transform -translate-x-1/2")
        }
        style={{ opacity: isActive ? 1 : 0 }}
      >
        {label}
      </span>
    </Link>
  );
}

function NavbarDesktop({
  scrollRef,
}: {
  scrollRef?: React.RefObject<HTMLDivElement>;
}) {
  const { user } = useUser();

  const {
    data: event,
    error,
    isFetched,
  } = useGetClosestEvent({ enabled: true });

  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleDrawer = () => {
    setIsNavOpen((prevState) => !prevState);
  };
  const disclosureOptions = useDisclosure();
  const [isOnTop, setIsOnTop] = useState(true);
  const { setOpen: openJoinModal } = useJoinModal();

  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });

  useEffect(() => {
    function handleWindowScroll() {
      console.log("scroll", document.body.scrollTop);
      setIsOnTop(document.body.scrollTop === 0);
    }

    function handleScroll() {
      setIsOnTop(scrollRef?.current?.scrollTop === 0);
    }

    handleScroll();
    handleWindowScroll();
    scrollRef?.current?.addEventListener("scroll", handleScroll);
    document.body.addEventListener("scroll", handleWindowScroll);

    return () => {
      document.body.removeEventListener("scroll", handleWindowScroll);
      scrollRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime({
        time: dayjs().format("h:mm A"),
        date: dayjs().format("dddd MMMM DD, YYYY"),
      });
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const manageList = useMemo(() => {
    if (!user) return [];
    let filteredList = managePaths.filter((path) => path.href !== pathname);

    if (user.is_admin) {
      return filteredList;
    }

    if (!user.is_author) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/posts/create"
      );
      filteredList = filteredList.filter(
        (path) => path.href !== "/signals/create"
      );
    }
    if (!user.is_event_creator) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/events/create"
      );
    }
    return filteredList;
  }, [pathname, user]);

  const showCreatePostButton = !!user && manageList.length > 0;

  // <div className="h-[150px]">
  return (
    <div className="h-[150px]">
      <div
        className="w-full fixed top-0 left-0 bg-primary z-40"
        style={{
          boxShadow: isOnTop ? "none" : "0 0 2px rgba(0,0,0,0.25)",
        }}
      >
        <header className="w-full max-w-[1440px] mx-auto py-2 px-5">
          <div className="flex">
            <div className="flex-1 ">
              <div className="flex items-center uppercase font-helvetica gap-2 text-[10px]">
                <Image
                  src={earthSpinning}
                  alt="Spinning Earth"
                  className="w-[12px] h-[12px]"
                  style={{
                    mixBlendMode: "multiply",
                    transform: "translateZ(0)",
                  }}
                  // onClick={() => {
                  //   attachUIDToAllThePosts();
                  // }}
                />
                <span>{currentTime.time}</span>
                <span>{currentTime.date}</span>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 justify-center mt-[10px] ">
              {/* <Logo className="w-[310px] h-[auto]" /> */}
              <WorldClockWithLabel timezone={-7} label="SF" />
              <WorldClockWithLabel timezone={-4} label="NYC" />
              <WorldClockWithLabel timezone={1} label="LONDON" />
              <Logo
                style={{
                  fontSize: "65px",
                  lineHeight: 0,
                  marginTop: "-5px",
                }}
                linkStyle={{
                  margin: "0 5px",
                  width: "300px",
                }}
              />
              <WorldClockWithLabel timezone={5.5} label="DELHI" />
              <WorldClockWithLabel timezone={9} label="TOKYO" />
              <WorldClockWithLabel timezone={10} label="SYDNEY" />
            </div>
            <div className="flex-1 flex items-start gap-5 justify-end">
              {showCreatePostButton && (
                <Dropdown
                  classNames={{
                    content: "!bg-primary !rounded-[4px] p-0 !min-w-[unset]",
                    base: "!p-[0_10px]",
                  }}
                >
                  <DropdownTrigger className="!scale-100 !opacity-100">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <p
                        className="text-[10px] flex justify-end font-helvetica text-primaryText"
                        style={{
                          fontWeight: 600,
                          fontVariationSettings: '"wght" 700,"opsz" 10',
                        }}
                      >
                        CREATE
                      </p>
                      <FaCaretDown className="text-[10px] flex justify-end font-helvetica text-primaryText" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    classNames={{
                      list: "p-0 m-0 divide-y divide-dashed divide-[#1f1d1a4d] !gap-0",
                      base: "!p-[0_10px]",
                    }}
                  >
                    {manageList.map((link) => (
                      <DropdownItem
                        key={link.key}
                        className="!p-[4px_0_2px] !rounded-none !bg-transparent"
                      >
                        <Link
                          href={link.href}
                          className="text-[10px] flex justify-start font-helvetica text-primaryText"
                          style={{
                            fontWeight: 600,
                            fontVariationSettings: '"wght" 700,"opsz" 10',
                          }}
                        >
                          <span>{link.label}</span>
                        </Link>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
              {!user ? (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => openJoinModal(true)}
                >
                  <p
                    className="text-[10px] flex justify-end font-helvetica text-primaryText"
                    style={{
                      fontWeight: 600,
                      fontVariationSettings: '"wght" 700,"opsz" 10',
                    }}
                  >
                    SIGN IN
                  </p>
                </div>
              ) : (
                // <div
                //   className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
                //   onClick={() => {
                //     // signInWithGoogle();
                //     // signIn("linkedin");
                //     signInWithLinkedin();
                //   }}
                //   style={{
                //     fontWeight: 600,
                //     fontVariationSettings: '"wght" 700,"opsz" 10',
                //   }}
                // >
                //   <span>SIGN IN</span>
                // </div>
                <AccountsModal
                  Trigger={
                    <div>
                      <SignOutButton />
                    </div>
                  }
                  deleteAccountDisclosure={disclosureOptions}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center items-center relative w-full my-3">
            <div className="flex items-center gap-5 absolute left-0 bottom-0 text-[10px]">
              <Link
                prefetch={true}
                className={
                  "leading-[120%] text-[1rem] font-featureHeadline " +
                  (pathname.startsWith("/events")
                    ? "text-appBlue uppercase"
                    : "text-appBlack")
                }
                href={
                  event?.[0]?.id
                    ? "/events?event_id=" + event?.[0]?.id
                    : "/events"
                }
                style={{
                  fontWeight: 395,
                  fontVariationSettings: '"wght" 495,"opsz" 10',
                }}
              >
                Events
              </Link>
              {/* <Link
                className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
                href="#"
                style={{
                  fontWeight: 395,
                  fontVariationSettings: '"wght" 495,"opsz" 10',
                }}
              >
                Newsletters
              </Link> */}
            </div>
            <div className="flex-1 flex font-helvetica justify-center items-center gap-3 text-[10px]">
              <span className="text-appBlack leading-[120%]">INTELLIGENT</span>
              <div className="w-1 h-1 rounded-full bg-appBlack" />
              <span className="text-appBlack leading-[120%]">EFFICIENT</span>
              <div className="w-1 h-1 rounded-full bg-appBlack" />
              <span className="text-appBlack leading-[120%]">RESPONSIBLE</span>
            </div>
            <div
              className="flex items-center gap-2 absolute -right-2 -bottom-[4px] text-[10px] cursor-pointer"
              // onClick={() => setIsNavOpen((c) => !c)}
            >
              {/* <Image
                src={isNavOpen ? navClose : navOpen}
                alt="Open Navigation"
              /> */}
              {/* <div className="mt-5"> */}
              <div className="max-w-[300px] w-[20vw]">
                <UpcomingEventSection />
              </div>
              {/* </div> */}
            </div>
          </div>
          <hr className="border-appBlack" />
          <hr className="border-dashed border-[#1f1d1a4d] mt-0.5" />
          <nav className="flex justify-between py-2">
            {navLinks.map((link, index) => (
              <NavItem
                key={link.href}
                isFirst={index === 0}
                isLast={index === navLinks.length - 1}
                href={link.href}
                label={link.label}
              />
            ))}
          </nav>
          <hr className="border-dashed border-[#1f1d1a4d]" />
          <Drawer
            open={isNavOpen}
            onClose={toggleDrawer}
            direction="right"
            className="!bg-primary !w-[360px]"
          >
            <div className="w-[252px] m-[25px_30px] flex flex-col justify-between h-full">
              <Image
                className="absolute top-4 right-4 cursor-pointer"
                src={navClose}
                alt="nav-close"
                onClick={() => setIsNavOpen(false)}
              />
              <nav className="flex flex-col gap-1 justify-start divide-y divide-dashed divide-[#1f1d1a4d]">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="text-appBlack font-featureBold flex items-center gap-2"
                  >
                    <span
                      className="font-featureHeadline text-[31px] text-appBlack"
                      style={{
                        fontWeight: 395,
                        fontVariationSettings: '"wght" 495,"opsz" 10',
                      }}
                    >
                      {link.label}
                    </span>
                    {i === 0 && (
                      <Image
                        className="h-5"
                        src={navYouAreHere}
                        alt={"You are here"}
                      />
                    )}
                  </Link>
                ))}
              </nav>
              <div>
                <div
                  className="flex flex-col gap-2 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Events</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Newsletters</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Podcast</span>
                  </Link>
                </div>
                <div
                  className="flex flex-col gap-2 mt-4 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>About</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Speakers Bureau</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Careers</span>
                  </Link>
                </div>
                <div
                  className="flex flex-col gap-2 mt-4 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Privacy</span>
                  </Link>
                  <p
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>© 2024 Minerva Inc.</span>
                  </p>
                </div>
              </div>
              <Logo
                linkStyle={{
                  display: "block",
                  height: "40px",
                  marginBottom: "45px",
                }}
                withMini
              />
            </div>
          </Drawer>
        </header>
      </div>
      {user && <DeleteAccountModal disclosureOptions={disclosureOptions} />}
    </div>
  );
}

function NavbarTablet({
  scrollRef,
}: {
  scrollRef?: React.RefObject<HTMLDivElement>;
}) {
  const { user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleDrawer = () => {
    setIsNavOpen((prevState) => !prevState);
  };
  const [isOnTop, setIsOnTop] = useState(true);
  const disclosureOptions = useDisclosure();
  const { setOpen: openJoinModal } = useJoinModal();

  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });

  useEffect(() => {
    function handleWindowScroll() {
      setIsOnTop(window.scrollY === 0);
    }

    function handleScroll() {
      setIsOnTop(scrollRef?.current?.scrollTop === 0);
    }

    handleScroll();
    scrollRef?.current?.addEventListener("scroll", handleScroll);
    addEventListener("scroll", handleWindowScroll);

    return () => {
      removeEventListener("scroll", handleWindowScroll);
      scrollRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime({
        time: dayjs().format("h:mm A"),
        date: dayjs().format("dddd MMMM DD, YYYY"),
      });
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const manageList = useMemo(() => {
    if (!user) return [];
    let filteredList = managePaths.filter((path) => path.href !== pathname);
    if (!user.is_author) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/posts/create"
      );
      filteredList = filteredList.filter(
        (path) => path.href !== "/signals/create"
      );
    }
    if (!user.is_event_creator) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/events/create"
      );
    }
    return filteredList;
  }, [pathname, user]);

  const showCreatePostButton = !!user && manageList.length > 0;

  return (
    <div className="h-[220px]">
      <div
        className="w-full fixed top-0 left-0 bg-primary z-40"
        style={{
          boxShadow: isOnTop ? "none" : "0 0 2px rgba(0,0,0,0.25)",
        }}
      >
        <header className="w-full max-w-[1440px] mx-auto py-2 px-3">
          <div className="flex">
            <div className="flex-1 ">
              <div className="flex items-center uppercase whitespace-nowrap font-helvetica gap-2 text-[10px]">
                <Image
                  src={earthSpinning}
                  alt="Spinning Earth"
                  className="w-[12px] h-[12px]"
                  style={{
                    mixBlendMode: "multiply",
                    transform: "translateZ(0)",
                  }}
                />
                <span>{currentTime.time}</span>
                <span>{currentTime.date}</span>
              </div>
            </div>
            <div className="flex-1 flex items-start gap-3 justify-end">
              {showCreatePostButton && (
                // <Link
                //   href="/admin"
                //   className="text-[10px] flex justify-end font-helvetica text-primaryText"
                //   style={{
                //     fontWeight: 600,
                //     fontVariationSettings: '"wght" 700,"opsz" 10',
                //   }}
                // >
                //   <span>CREATE POST</span>
                // </Link>
                <Dropdown
                  classNames={{
                    content: "!bg-primary !rounded-[4px] p-0 !min-w-[unset]",
                    base: "!p-[0_10px]",
                  }}
                >
                  <DropdownTrigger className="!scale-100 !opacity-100">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <p
                        className="text-[10px] flex justify-end font-helvetica text-primaryText"
                        style={{
                          fontWeight: 600,
                          fontVariationSettings: '"wght" 700,"opsz" 10',
                        }}
                      >
                        CREATE
                      </p>
                      <FaCaretDown className="text-[10px] flex justify-end font-helvetica text-primaryText" />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    classNames={{
                      list: "p-0 m-0 divide-y divide-dashed divide-[#1f1d1a4d] !gap-0",
                      base: "!p-[0_10px]",
                    }}
                  >
                    {manageList.map((link) => (
                      <DropdownItem
                        key={link.key}
                        className="!p-[4px_0_2px] !rounded-none !bg-transparent"
                      >
                        <Link
                          href={link.href}
                          className="text-[10px] flex justify-start font-helvetica text-primaryText"
                          style={{
                            fontWeight: 600,
                            fontVariationSettings: '"wght" 700,"opsz" 10',
                          }}
                        >
                          <span>{link.label}</span>
                        </Link>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
              {!user ? (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => openJoinModal(true)}
                >
                  <p
                    className="text-[10px] flex justify-end font-helvetica text-primaryText"
                    style={{
                      fontWeight: 600,
                      fontVariationSettings: '"wght" 700,"opsz" 10',
                    }}
                  >
                    SIGN IN
                  </p>
                </div>
              ) : (
                // <div
                //   className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
                //   onClick={() => {
                //     signOut();
                //   }}
                //   style={{
                //     fontWeight: 600,
                //     fontVariationSettings: '"wght" 700,"opsz" 10',
                //   }}
                // >
                //   <span>SIGN OUT</span>
                // </div>
                <AccountsModal
                  deleteAccountDisclosure={disclosureOptions}
                  Trigger={
                    <div>
                      <SignOutButton />
                    </div>
                  }
                />
              )}
              {/* <div className="text-[10px] flex justify-end font-helvetica">
        <span>SIGN IN</span>
      </div> */}
            </div>
          </div>
          <div className="flex justify-center items-center relative w-full mt-9">
            <div className="flex items-center gap-5 absolute left-0 bottom-0 text-[10px]">
              <Link
                className={
                  "leading-[120%] text-[1rem] font-featureHeadline " +
                  (pathname.startsWith("events")
                    ? "text-appBlue uppercase"
                    : "text-appBlack")
                }
                href="#"
                style={{
                  fontWeight: 395,
                  fontVariationSettings: '"wght" 495,"opsz" 10',
                }}
              >
                Events
              </Link>
              {/* <Link
                className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
                href="#"
                style={{
                  fontWeight: 395,
                  fontVariationSettings: '"wght" 495,"opsz" 10',
                }}
              >
                Newsletters
              </Link> */}
            </div>
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 -bottom-[4px] text-[10px] cursor-pointer"
              // onClick={() => setIsNavOpen((c) => !c)}
            >
              <div className="max-w-[300px] w-[50vw]">
                <UpcomingEventSection />
              </div>
              {/* <Image
                src={isNavOpen ? navClose : navOpen}
                alt="Open Navigation"
              /> */}
            </div>
          </div>
          <div
            className="overflow-hidden transition-all"
            style={{
              maxHeight: isNavOpen ? "450px" : 0,
            }}
          >
            <div className="flex px-3 gap-2 divide-x divide-dashed divide-[#1f1d1a4d] py-4">
              <nav className="flex flex-1 flex-col gap-1 justify-between py-2 divide-y divide-dashed divide-[#1f1d1a4d]">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={
                      "font-featureBold flex items-center gap-2 " +
                      (pathname === link.href
                        ? "text-appBlue uppercase"
                        : "text-appBlack")
                    }
                  >
                    <span
                      className="font-featureHeadline text-[1.5rem] text-appBlack"
                      style={{
                        fontWeight: 395,
                        fontVariationSettings: '"wght" 495,"opsz" 10',
                      }}
                    >
                      {link.label}
                    </span>
                    {i === 0 && (
                      <Image
                        className="h-5"
                        src={navYouAreHere}
                        alt={"You are here"}
                      />
                    )}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col pl-2 gap-2 mt-4 font-featureHeadline">
                <Link
                  href={url}
                  style={{
                    fontWeight: 395,
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                  }}
                >
                  <span>About</span>
                </Link>
                <Link
                  href={url}
                  style={{
                    fontWeight: 395,
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                  }}
                >
                  <span>Speakers Bureau</span>
                </Link>
                <Link
                  href={url}
                  style={{
                    fontWeight: 395,
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                  }}
                >
                  <span>Careers</span>
                </Link>
              </div>
            </div>
          </div>
          <hr className="border-dashed border-[#1f1d1a4d] mt-3 mb-1" />
          <div className="p-[.1rem_0_.65rem]">
            <div className="flex-1 flex items-center gap-3 justify-between mt-0 ">
              {/* <Logo className="w-[310px] h-[auto]" /> */}
              <div className="flex items-center gap-3">
                <WorldClockWithLabel timezone={-7} label="SF" />
                <WorldClockWithLabel timezone={-4} label="NYC" />
                <WorldClockWithLabel timezone={1} label="LONDON" />
              </div>
              <div>
                <Logo
                  style={{
                    fontSize: "65px",
                    lineHeight: 0,
                    marginTop: "5px",
                  }}
                  linkStyle={{
                    margin: "0 5px",
                    width: "300px",
                    display: "block",
                  }}
                />
                <div className="flex-1 flex font-helvetica justify-center items-center gap-3 text-[10px] mt-3">
                  <span className="text-appBlack leading-[120%]">
                    INTELLIGENT
                  </span>
                  <div className="w-1 h-1 rounded-full bg-appBlack" />
                  <span className="text-appBlack leading-[120%]">
                    EFFICIENT
                  </span>
                  <div className="w-1 h-1 rounded-full bg-appBlack" />
                  <span className="text-appBlack leading-[120%]">
                    RESPONSIBLE
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WorldClockWithLabel timezone={5.5} label="DELHI" />
                <WorldClockWithLabel timezone={9} label="TOKYO" />
                <WorldClockWithLabel timezone={10} label="SYDNEY" />
              </div>
            </div>
          </div>
          <hr className="border-appBlack" />
          <hr className="border-dashed border-[#1f1d1a4d] mt-0.5" />
          <nav className="flex justify-between py-2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-appBlack font-featureBold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <hr className="border-dashed border-[#1f1d1a4d]" />
          <Drawer
            open={isNavOpen}
            onClose={toggleDrawer}
            direction="right"
            className="!bg-primary !w-[360px]"
          >
            <div className="w-[252px] m-[25px_30px] flex flex-col justify-between h-full">
              <Image
                className="absolute top-4 right-4 cursor-pointer"
                src={navClose}
                alt="nav-close"
                onClick={() => setIsNavOpen(false)}
              />
              <nav className="flex flex-col gap-1 justify-start divide-y divide-dashed divide-[#1f1d1a4d]">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="text-appBlack font-featureBold flex items-center gap-2"
                  >
                    <span
                      className="font-featureHeadline text-[31px] text-appBlack"
                      style={{
                        fontWeight: 395,
                        fontVariationSettings: '"wght" 495,"opsz" 10',
                      }}
                    >
                      {link.label}
                    </span>
                    {i === 0 && (
                      <Image
                        className="h-5"
                        src={navYouAreHere}
                        alt={"You are here"}
                      />
                    )}
                  </Link>
                ))}
              </nav>
              <div>
                <div
                  className="flex flex-col gap-2 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Events</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Newsletters</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Podcast</span>
                  </Link>
                </div>
                <div
                  className="flex flex-col gap-2 mt-4 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>About</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Speakers Bureau</span>
                  </Link>
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Careers</span>
                  </Link>
                </div>
                <div
                  className="flex flex-col gap-2 mt-4 font-featureHeadline"
                  style={{
                    borderTop: "1px dashed rgba(31,29,26,.302)",
                    paddingTop: "10px",
                  }}
                >
                  <Link
                    href={url}
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>Privacy</span>
                  </Link>
                  <p
                    style={{
                      fontWeight: 395,
                      fontVariationSettings: '"wght" 495,"opsz" 10',
                    }}
                  >
                    <span>© 2024 Minerva Inc.</span>
                  </p>
                </div>
              </div>
              <Logo
                linkStyle={{
                  display: "block",
                  height: "60px",
                  marginBottom: "25px",
                }}
                withMini
              />
            </div>
          </Drawer>
        </header>
      </div>
      {user && <DeleteAccountModal disclosureOptions={disclosureOptions} />}
    </div>
  );
}

function NavbarMobile() {
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("ddd  MMM DD, YYYY"),
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const accountsDrawerRef = useRef<any>(null);
  const disclosureOptions = useDisclosure();
  const { setOpen: openJoinModal } = useJoinModal();
  const bodyRef = useRef<any>(document.body);
  const router = useRouter();

  /** Framer Motion */
  const { scrollY } = useScroll({ container: bodyRef });
  const yTransform = useTransform(scrollY, [0, 100], [0, -100]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const scale = useTransform(scrollY, [70, 100], [1, 0.75]);
  const height = useTransform(scrollY, [70, 100], ["12px", "0px"]);
  const marginTop = useTransform(scrollY, [70, 100], [0.75, 0]);
  const chipMarginTop = useTransform(scrollY, [70, 100], [20, 6]);
  const borderWidth = useTransform(scrollY, [70, 100], [0, 1]);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const className =
    " flex-1 flex items-center font-helvetica justify-center rounded-full px-1.5 py-0.5 text-xs text-black bg-lightPrimary border border-dashed border-[#8e8e8db3] whitespace-nowrap";
  const activeClassName = " !bg-black !text-lightPrimary !border-solid";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime({
        time: dayjs().format("h:mm A"),
        date: dayjs().format("ddd  MMM DD, YYYY"),
      });
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const manageList = useMemo(() => {
    if (!user) return [];
    let filteredList = managePaths.filter((path) => path.href !== pathname);
    if (!user.is_author) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/posts/create"
      );
      filteredList = filteredList.filter(
        (path) => path.href !== "/signals/create"
      );
    }
    if (!user.is_event_creator) {
      filteredList = filteredList.filter(
        (path) => path.href !== "/events/create"
      );
    }
    return filteredList;
  }, [pathname, user]);

  const showCreatePostButton = !!user && manageList.length > 0;

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;
    const unsubscribe = yTransform.on("change", (latest) => {
      headerElement.style.transform = `translateY(${latest}px)`;
    });

    return () => unsubscribe();
  }, [yTransform]);

  useEffect(() => {
    const logoElement = logoRef.current;
    if (!logoElement) return;
    const unsubscribe = scale.on("change", (latest) => {
      logoElement.style.transform = `scale(${latest})`;
    });

    return () => unsubscribe();
  }, [scale]);

  useEffect(() => {
    const headerElement = headerRef.current;
    const sloganElement = sloganRef.current;
    const chipElement = chipRef.current;
    if (!sloganElement || !headerElement || !chipElement) return;
    const unsubscribe = height.on("change", (latest) => {
      sloganElement.style.height = latest;
      sloganElement.style.opacity = `${opacity.get()}`;
    });
    const unsubscribe2 = marginTop.on("change", (latest) => {
      sloganElement.style.marginTop = `${latest}rem`;
      // sloganElement.style.marginBottom = `${latest}rem`;
    });
    const unsubscribe3 = opacity.on("change", (latest) => {
      sloganElement.style.opacity = `${latest}`;
    });
    const unsubscribe4 = borderWidth.on("change", (latest) => {
      headerElement.style.borderBottomWidth = `${latest}px`;
    });
    // const unsubscribe5 = chipMarginTop.on("change", (latest) => {
    //   chipElement.style.marginTop = `${latest}px`;
    // });

    return () => {
      unsubscribe();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
      // unsubscribe5();
    };
  }, [height, marginTop, opacity, borderWidth, chipMarginTop]);

  const toggleLink = (href: string) => {
    if (pathname === href) return router.push("/");
    router.push(href);
  };

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/artificial-intelligence");
    router.prefetch("/technology");
    router.prefetch("/product-management");
    router.prefetch("/silicon-valley");
    router.prefetch("/others");
  }, [router]);

  return (
    <motion.div
      className="sticky top-0 w-full bg-primary max-w-[1100px] mx-auto py-2"
      ref={headerRef}
      style={{
        borderBottomStyle: "dashed",
        borderColor: "#1f1d1a4d",
        zIndex: 999,
      }}
    >
      <div className="flex">
        <div className="flex-1 ">
          <div className="flex items-center uppercase whitespace-nowrap font-helvetica gap-2 text-[10px]">
            <Image
              src={earthSpinning}
              alt="Spinning Earth"
              className="w-[12px] h-[12px]"
              style={{
                mixBlendMode: "multiply",
                transform: "translateZ(0)",
              }}
            />
            <span>{currentTime.time}</span>
            <span>{currentTime.date}</span>
          </div>
        </div>
        <div className="flex-1 flex items-start gap-3 justify-end">
          {showCreatePostButton && (
            // <Link
            //   href="/admin"
            //   className="text-[10px] flex justify-end font-helvetica text-primaryText"
            //   style={{
            //     fontWeight: 600,
            //     fontVariationSettings: '"wght" 700,"opsz" 10',
            //   }}
            // >
            //   <span>CREATE POST</span>
            // </Link>
            <Dropdown
              classNames={{
                content: "!bg-primary !rounded-[4px] p-0 !min-w-[unset]",
                base: "!p-[0_10px]",
              }}
            >
              <DropdownTrigger className="!scale-100 !opacity-100">
                <div className="flex items-center gap-1 cursor-pointer">
                  <p
                    className="text-[10px] flex justify-end font-helvetica text-primaryText"
                    style={{
                      fontWeight: 600,
                      fontVariationSettings: '"wght" 700,"opsz" 10',
                    }}
                  >
                    CREATE
                  </p>
                  <FaCaretDown className="text-[10px] flex justify-end font-helvetica text-primaryText" />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                classNames={{
                  list: "p-0 m-0 divide-y divide-dashed divide-[#1f1d1a4d] !gap-0",
                  base: "!p-[0_10px]",
                }}
              >
                {manageList.map((link) => (
                  <DropdownItem
                    key={link.key}
                    className="!p-[4px_0_2px] !rounded-none !bg-transparent"
                  >
                    <Link
                      href={link.href}
                      className="text-[10px] flex justify-start font-helvetica text-primaryText"
                      style={{
                        fontWeight: 600,
                        fontVariationSettings: '"wght" 700,"opsz" 10',
                      }}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {!user ? (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => openJoinModal(true)}
            >
              <p
                className="text-[10px] flex justify-end font-helvetica text-primaryText"
                style={{
                  fontWeight: 600,
                  fontVariationSettings: '"wght" 700,"opsz" 10',
                }}
              >
                SIGN IN
              </p>
            </div>
          ) : (
            <div
              onClick={() => {
                accountsDrawerRef.current?.showDrawer();
              }}
            >
              <SignOutButton noCaret />
            </div>
          )}
          {/* <div className="text-[10px] flex justify-end font-helvetica">
            <span>SIGN IN</span>
          </div> */}
        </div>
      </div>
      {/* <div className="flex justify-center items-center relative w-full mt-9">
        <div className="flex items-center gap-5 absolute left-0 bottom-0 text-[10px]">
          <Link
            className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Events
          </Link>
        </div>
        <div
          className="flex items-center gap-2 absolute -right-2 -bottom-[8px] text-[10px]"
          onClick={() => setIsNavOpen((c) => !c)}
        >
          <Image src={isNavOpen ? navClose : navOpen} alt="Open Navigation" />
        </div>
      </div> */}
      <div
        className="overflow-hidden transition-all mt-1"
        style={{
          maxHeight: isNavOpen ? "450px" : 0,
        }}
      >
        <div className="flex px-3 gap-2 divide-x divide-dashed divide-[#1f1d1a4d] py-4">
          <nav className="flex flex-1 flex-col gap-1 justify-between py-2 divide-y divide-dashed divide-[#1f1d1a4d]">
            {navLinks.map((link, i) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-appBlack font-featureBold flex items-center gap-2"
              >
                <span
                  className="font-featureHeadline text-[1.5rem] text-appBlack"
                  style={{
                    fontWeight: 395,
                    fontVariationSettings: '"wght" 495,"opsz" 10',
                  }}
                >
                  {link.label}
                </span>
                {i === 0 && (
                  <Image
                    className="h-5"
                    src={navYouAreHere}
                    alt={"You are here"}
                  />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col pl-2 gap-2 mt-4 font-featureHeadline">
            <Link
              href={url}
              style={{
                fontWeight: 395,
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              <span>About</span>
            </Link>
            <Link
              href={url}
              style={{
                fontWeight: 395,
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              <span>Speakers Bureau</span>
            </Link>
            <Link
              href={url}
              style={{
                fontWeight: 395,
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              <span>Careers</span>
            </Link>
          </div>
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] mt-3 mb-1" />
      <div className="items-center gap-4 grid grid-cols-6 py-2 ">
        {/* <Logo className="w-[310px] h-[auto]" /> */}
        <WorldClockWithLabel timezone={-7} label="SF" />
        <WorldClockWithLabel timezone={-4} label="NEW YORK" />
        <WorldClockWithLabel timezone={1} label="LONDON" />
        <WorldClockWithLabel timezone={5.5} label="DELHI" />
        <WorldClockWithLabel timezone={9} label="TOKYO" />
        <WorldClockWithLabel timezone={10} label="SYDNEY" />
      </div>
      {/* <div className="text-center">
        <Link href="/">
          <span
            className={
              "font-larkenExtraBold leading-[100%] text-[81px] flex items-center justify-center"
            }
          >
            <span>M</span>
            <span>I</span>
            <span>N</span>
            <span>E</span>
            <span>R</span>
            <span className="inline-block -ml-1">V</span>
            <span className="inline-block -ml-2">A</span>
          </span>
        </Link>
      </div> */}
      <div ref={logoRef}>
        <Logo
          style={{
            fontSize: "65px",
            lineHeight: 0,
            marginTop: "5px",
          }}
          linkStyle={{
            marginTop: "-10px",
            margin: "0 5px",
            display: "block",
          }}
          className="!w-full !h-auto"
        />
      </div>
      <div
        ref={sloganRef}
        className="flex-1 flex font-helvetica justify-center items-center gap-3 text-[10px] mt-3 overflow-hidden"
      >
        <span className="text-appBlack leading-[120%]">INTELLIGENT</span>
        <div className="w-1 h-1 rounded-full bg-appBlack" />
        <span className="text-appBlack leading-[120%]">EFFICIENT</span>
        <div className="w-1 h-1 rounded-full bg-appBlack" />
        <span className="text-appBlack leading-[120%]">RESPONSIBLE</span>
      </div>
      <div className="flex gap-x-2 gap-y-1 flex-wrap mt-3" ref={chipRef}>
        <button
          onClick={() => toggleLink("/")}
          className={
            "min-w-[120px] " +
            className +
            (pathname === "/" ? activeClassName : "")
          }
        >
          <span>
            <TiHome className="text-base" />
          </span>
        </button>
        <button
          onClick={() => toggleLink("/artificial-intelligence")}
          className={
            className +
            (pathname === "/artificial-intelligence" ? activeClassName : "")
          }
        >
          <span>Artificial Intelligence</span>
        </button>
        <button
          onClick={() => toggleLink("/technology")}
          className={
            className + (pathname === "/technology" ? activeClassName : "")
          }
        >
          <span>Technology</span>
        </button>
        <button
          onClick={() => toggleLink("/silicon-valley")}
          className={
            className + (pathname === "/silicon-valley" ? activeClassName : "")
          }
        >
          <span>Silicon Valley</span>
        </button>
        <button
          onClick={() => toggleLink("/product-management")}
          className={
            className +
            (pathname === "/product-management" ? activeClassName : "")
          }
        >
          <span>Product Management</span>
        </button>
        <button
          onClick={() => toggleLink("/others")}
          className={
            "min-w-[130px] " +
            className +
            (pathname === "/others" ? activeClassName : "")
          }
        >
          <span>Others</span>
        </button>
      </div>
      {/* <hr className="border-dashed border-[#1f1d1a4d] mt-0.5" /> */}

      {/* <hr className="border-dashed border-[#1f1d1a4d]" /> */}
      <AccountsDrawer
        ref={accountsDrawerRef}
        deleteAccountDisclosure={disclosureOptions}
      />
      {user && <DeleteAccountModal disclosureOptions={disclosureOptions} />}
    </motion.div>
  );
}

export default function Navbar({
  scrollRef,
}: {
  scrollRef?: React.RefObject<HTMLDivElement>;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isTabletScreen = useMediaQuery({ maxWidth: 1024, minWidth: 769 });
  const isDesktopScreen = useMediaQuery({ minWidth: 1025 });
  const isMobileScreen = useMediaQuery({ maxWidth: 768 });
  const { isSmallScreen } = useScreenSize();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isMobileScreen && pathname === "/events") return null;

  return mounted ? (
    <>
      {isDesktopScreen && <NavbarDesktop scrollRef={scrollRef} />}
      {isTabletScreen && <NavbarTablet scrollRef={scrollRef} />}
      {isMobileScreen && <NavbarMobile />}
    </>
  ) : (
    <div></div>
  );
}
