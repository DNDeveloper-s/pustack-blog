"use client";

import Image from "next/image";
import Logo from "../shared/Logo";
import earthSpinning from "@/assets/images/spinning-earth.gif";
import navOpen from "@/assets/svgs/nav-open.svg";
import navClose from "@/assets/svgs/nav-close.svg";
import Link from "next/link";
import { WorldClockWithLabel } from "../shared/WorldClock";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { url } from "@/constants";
import { navYouAreHere } from "@/assets";
import { usePathname } from "next/navigation";

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

export default function Navbar() {
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

  const showCreatePostButton = !pathname.includes("/admin");

  return (
    <header className="w-full max-w-[1100px] mx-auto py-2 px-3">
      <div className="flex">
        <div className="flex-1 ">
          <div className="flex items-center uppercase font-helvetica gap-2 text-[10px]">
            <Image
              src={earthSpinning}
              alt="Spinning Earth"
              className="w-[12px] h-[12px]"
            />
            <span>{currentTime.time}</span>
            <span>{currentTime.date}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 justify-center ">
          {/* <Logo className="w-[310px] h-[auto]" /> */}
          <WorldClockWithLabel timezone="-4" label="D.C." />
          <WorldClockWithLabel timezone="+2" label="BXL" />
          <WorldClockWithLabel timezone="+1" label="LAGOS" />
          <Logo size="xxl" />
          <WorldClockWithLabel timezone="+4" label="DUBAI" />
          <WorldClockWithLabel timezone="+8" label="BEIJING" />
          <WorldClockWithLabel timezone="+8" label="SG" />
        </div>
        <div className="flex-1 flex items-start gap-5 justify-end">
          {showCreatePostButton && (
            <Link
              href="/admin"
              className="text-[10px] flex justify-end font-helvetica"
            >
              <span>CREATE POST</span>
            </Link>
          )}
          <div className="text-[10px] flex justify-end font-helvetica">
            <span>SIGN IN</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center relative w-full my-3">
        <div className="flex items-center gap-5 absolute left-0 bottom-0 text-[10px]">
          <Link
            className="text-primaryText leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Events
          </Link>
          <Link
            className="text-primaryText leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Newsletters
          </Link>
        </div>
        <div className="flex-1 flex font-helvetica justify-center items-center gap-2 text-[10px]">
          <span className="text-primaryText leading-[120%]">INTELLIGENT</span>
          <div className="w-1 h-1 rounded-full bg-primaryText" />
          <span className="text-primaryText leading-[120%]">TRANSPARENT</span>
          <div className="w-1 h-1 rounded-full bg-primaryText" />
          <span className="text-primaryText leading-[120%]">GLOBAL</span>
        </div>
        <div className="flex items-center gap-2 absolute right-0 -bottom-[8px] text-[10px]">
          <Image src={navOpen} alt="Open Navigation" />
        </div>
      </div>
      <hr />
      <hr className="border-dashed mt-0.5" />
      <nav className="flex justify-between py-2">
        {navLinks.map((link) => (
          <Link
            key={link.key}
            href={link.key}
            className="text-primaryText font-featureBold"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <hr className="border-dashed" />
    </header>
  );
}

export function NavbarMobile() {
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: dayjs().format("h:mm A"),
    date: dayjs().format("dddd MMMM DD, YYYY"),
  });
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  return (
    <header className="w-full max-w-[1100px] mx-auto py-2">
      <div className="flex px-3">
        <div className="flex-1 ">
          <div className="flex items-center uppercase whitespace-nowrap font-helvetica gap-2 text-[10px]">
            <Image
              src={earthSpinning}
              alt="Spinning Earth"
              className="w-[12px] h-[12px]"
            />
            <span>{currentTime.time}</span>
            <span>{currentTime.date}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] flex justify-end font-helvetica">
            <span>SIGN IN</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center relative w-full mt-9">
        <div className="flex items-center gap-5 absolute left-3 bottom-0 text-[10px]">
          <Link
            className="text-primaryText leading-[120%] text-[1rem] font-featureHeadline"
            href="#"
            style={{
              fontWeight: 395,
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            Events
          </Link>
          <Link
            className="text-primaryText leading-[120%] text-[1rem] font-featureHeadline"
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
          className="flex items-center gap-2 absolute right-0 -bottom-[8px] text-[10px]"
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
        <div className="flex px-3 gap-2 divide-x divide-dashed divide-secondary py-4">
          <nav className="flex flex-1 flex-col gap-1 justify-between py-2 divide-y divide-dashed divide-secondary">
            {navLinks.map((link, i) => (
              <Link
                key={link.key}
                href={link.key}
                className="text-primaryText font-featureBold flex items-center gap-2"
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
      <hr className="border-dashed mt-3 mb-1 mx-3 border-secondary" />
      <div className="flex-1 flex items-center gap-3 justify-evenly py-2 ">
        {/* <Logo className="w-[310px] h-[auto]" /> */}
        <WorldClockWithLabel timezone="-4" label="D.C." />
        <WorldClockWithLabel timezone="+2" label="BXL" />
        <WorldClockWithLabel timezone="+1" label="LAGOS" />
        <WorldClockWithLabel timezone="+4" label="DUBAI" />
        <WorldClockWithLabel timezone="+8" label="BEIJING" />
        <WorldClockWithLabel timezone="+8" label="SG" />
      </div>
      <div className="text-center">
        <p className="font-larkenExtraBold text-[70px] leading-[120%]">
          MINERVA
        </p>
      </div>
      <div className="flex-1 flex font-helvetica justify-center items-center gap-2 text-[10px]">
        <span className="text-primaryText leading-[120%]">INTELLIGENT</span>
        <div className="w-1 h-1 rounded-full bg-primaryText" />
        <span className="text-primaryText leading-[120%]">TRANSPARENT</span>
        <div className="w-1 h-1 rounded-full bg-primaryText" />
        <span className="text-primaryText leading-[120%]">GLOBAL</span>
      </div>
      {/* <hr className="border-dashed mt-0.5" /> */}

      {/* <hr className="border-dashed" /> */}
    </header>
  );
}
