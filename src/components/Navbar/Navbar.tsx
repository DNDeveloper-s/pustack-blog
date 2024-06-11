"use client";

import Image from "next/image";
import Logo from "../shared/Logo";
import earthSpinning from "@/assets/images/spinning-earth.gif";
import navOpen from "@/assets/svgs/nav-open.svg";
import navClose from "@/assets/svgs/nav-close.svg";
import Link from "next/link";
import { WorldClockWithLabel } from "../shared/WorldClock2";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { url } from "@/constants";
import { navYouAreHere } from "@/assets";
import { usePathname } from "next/navigation";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import useUserSession from "@/hooks/useUserSession";
import { useUser } from "@/context/UserContext";
import { useMediaQuery } from "react-responsive";

const navLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "politics", label: "Politics", href: "/politics" },
  { key: "business", label: "Business", href: "/business" },
  { key: "technology", label: "Technology", href: "/technology" },
  { key: "netzero", label: "NetZero", href: "/netzero" },
  { key: "africa", label: "Africa", href: "/africa" },
  { key: "security", label: "Security", href: "/security" },
  { key: "media", label: "Media", href: "/media" },
  {
    key: "global-elections",
    label: "Global Elections",
    href: "/global-elections",
  },
];

interface CurrentTime {
  time: string;
  date: string;
}

export function NavbarDesktop() {
  const { user } = useUser();

  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });

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

  const showCreatePostButton = !pathname.includes("/admin") && !!user;

  return (
    <header className="w-full max-w-[1440px] mx-auto py-2">
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
            />
            <span>{currentTime.time}</span>
            <span>{currentTime.date}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 justify-center mt-[10px] ">
          {/* <Logo className="w-[310px] h-[auto]" /> */}
          <WorldClockWithLabel timezone={-4} label="D.C." />
          <WorldClockWithLabel timezone={2} label="BXL" />
          <WorldClockWithLabel timezone={1} label="LAGOS" />
          <Logo
            size="xxl"
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
          <WorldClockWithLabel timezone={4} label="DUBAI" />
          <WorldClockWithLabel timezone={8} label="BEIJING" />
          <WorldClockWithLabel timezone={8} label="SG" />
        </div>
        <div className="flex-1 flex items-start gap-5 justify-end">
          {showCreatePostButton && (
            <Link
              href="/admin"
              className="text-[10px] flex justify-end font-helvetica text-primaryText"
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>CREATE POST</span>
            </Link>
          )}
          {!user ? (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signInWithGoogle();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN IN</span>
            </div>
          ) : (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signOut();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN OUT</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center relative w-full my-3">
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
          <Link
            className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Newsletters
          </Link>
        </div>
        <div className="flex-1 flex font-helvetica justify-center items-center gap-3 text-[10px]">
          <span className="text-appBlack leading-[120%]">INTELLIGENT</span>
          <div className="w-1 h-1 rounded-full bg-appBlack" />
          <span className="text-appBlack leading-[120%]">TRANSPARENT</span>
          <div className="w-1 h-1 rounded-full bg-appBlack" />
          <span className="text-appBlack leading-[120%]">GLOBAL</span>
        </div>
        <div className="flex items-center gap-2 absolute right-0 -bottom-[8px] text-[10px]">
          <Image src={navOpen} alt="Open Navigation" />
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
    </header>
  );
}

export function NavbarTablet() {
  const { user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });

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

  const showCreatePostButton = !pathname.includes("/admin") && !!user;

  return (
    <header className="w-full max-w-[1440px] mx-auto py-2">
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
            <Link
              href="/admin"
              className="text-[10px] flex justify-end font-helvetica text-primaryText"
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>CREATE POST</span>
            </Link>
          )}
          {!user ? (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signInWithGoogle();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN IN</span>
            </div>
          ) : (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signOut();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN OUT</span>
            </div>
          )}
          {/* <div className="text-[10px] flex justify-end font-helvetica">
        <span>SIGN IN</span>
      </div> */}
        </div>
      </div>
      <div className="flex justify-center items-center relative w-full mt-9">
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
          <Link
            className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Newsletters
          </Link>
        </div>
        <div
          className="flex items-center gap-2 absolute -right-2 -bottom-[8px] text-[10px]"
          onClick={() => setIsNavOpen((c) => !c)}
        >
          <Image src={isNavOpen ? navClose : navOpen} alt="Open Navigation" />
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
      <div className="p-[.1rem_0_.65rem]">
        <div className="flex-1 flex items-center gap-3 justify-between mt-0 ">
          {/* <Logo className="w-[310px] h-[auto]" /> */}
          <div className="flex items-center gap-3">
            <WorldClockWithLabel timezone={-4} label="D.C." />
            <WorldClockWithLabel timezone={2} label="BXL" />
            <WorldClockWithLabel timezone={1} label="LAGOS" />
          </div>
          <div>
            <Logo
              size="xxl"
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
              <span className="text-appBlack leading-[120%]">INTELLIGENT</span>
              <div className="w-1 h-1 rounded-full bg-appBlack" />
              <span className="text-appBlack leading-[120%]">TRANSPARENT</span>
              <div className="w-1 h-1 rounded-full bg-appBlack" />
              <span className="text-appBlack leading-[120%]">GLOBAL</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WorldClockWithLabel timezone={4} label="DUBAI" />
            <WorldClockWithLabel timezone={8} label="BEIJING" />
            <WorldClockWithLabel timezone={8} label="SG" />
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
    </header>
  );
}

export function NavbarMobile() {
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

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
  const showCreatePostButton = !pathname.includes("/admin") && !!user;

  return (
    <header className="w-full max-w-[1100px] mx-auto py-2 px-3 md:px-0">
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
            <Link
              href="/admin"
              className="text-[10px] flex justify-end font-helvetica text-primaryText"
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>CREATE POST</span>
            </Link>
          )}
          {!user ? (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signInWithGoogle();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN IN</span>
            </div>
          ) : (
            <div
              className="text-[10px] flex justify-end font-helvetica cursor-pointer text-primaryText"
              onClick={() => {
                signOut();
              }}
              style={{
                fontWeight: 600,
                fontVariationSettings: '"wght" 700,"opsz" 10',
              }}
            >
              <span>SIGN OUT</span>
            </div>
          )}
          {/* <div className="text-[10px] flex justify-end font-helvetica">
            <span>SIGN IN</span>
          </div> */}
        </div>
      </div>
      <div className="flex justify-center items-center relative w-full mt-9">
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
          <Link
            className="text-appBlack leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Newsletters
          </Link>
        </div>
        <div
          className="flex items-center gap-2 absolute -right-2 -bottom-[8px] text-[10px]"
          onClick={() => setIsNavOpen((c) => !c)}
        >
          <Image src={isNavOpen ? navClose : navOpen} alt="Open Navigation" />
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
      <div className="flex-1 flex items-center gap-3 justify-between py-2 ">
        {/* <Logo className="w-[310px] h-[auto]" /> */}
        <WorldClockWithLabel timezone={-4} label="D.C." />
        <WorldClockWithLabel timezone={2} label="BXL" />
        <WorldClockWithLabel timezone={1} label="LAGOS" />
        <WorldClockWithLabel timezone={4} label="DUBAI" />
        <WorldClockWithLabel timezone={8} label="BEIJING" />
        <WorldClockWithLabel timezone={8} label="SG" />
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
      <Logo
        size="xxl"
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
      />
      <div className="flex-1 flex font-helvetica justify-center items-center gap-3 text-[10px] mt-2">
        <span className="text-appBlack leading-[120%]">INTELLIGENT</span>
        <div className="w-1 h-1 rounded-full bg-appBlack" />
        <span className="text-appBlack leading-[120%]">TRANSPARENT</span>
        <div className="w-1 h-1 rounded-full bg-appBlack" />
        <span className="text-appBlack leading-[120%]">GLOBAL</span>
      </div>
      {/* <hr className="border-dashed border-[#1f1d1a4d] mt-0.5" /> */}

      {/* <hr className="border-dashed border-[#1f1d1a4d]" /> */}
    </header>
  );
}

export default function Navbar() {
  const isTabletScreen = useMediaQuery({ maxWidth: 1024, minWidth: 769 });
  const isDesktopScreen = useMediaQuery({ minWidth: 1025 });
  const isMobileScreen = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      {isDesktopScreen && <NavbarDesktop />}
      {isTabletScreen && <NavbarTablet />}
      {isMobileScreen && <NavbarMobile />}
    </>
  );
}
