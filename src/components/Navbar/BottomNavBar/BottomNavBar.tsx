"use client";

import Link from "next/link";
import newsIcon from "@/assets/images/icons/news.svg";
import newsActiveIcon from "@/assets/images/icons/news-active.svg";
import eventsIcon from "@/assets/images/icons/events.svg";
import eventsActiveIcon from "@/assets/images/icons/events-active.svg";
import blazeIcon from "@/assets/images/icons/flash.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useScreenSize from "@/hooks/useScreenSize";
import { useNavbar } from "@/context/NavbarContext";
import { useEffect, useRef, useState } from "react";

export default function BottomNavBar() {
  const pathname = usePathname();
  const { isSmallScreen } = useScreenSize();
  const { setIsBottomNavOpen } = useNavbar();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  const speedThreshold = 0.55; // Adjust this value to set the speed threshold (pixels per millisecond)

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime.current;

    // Calculate scroll speed in pixels per millisecond
    const scrollSpeed =
      Math.abs(currentScrollY - lastScrollY.current) / timeDiff;

    // If the user is scrolled all the way down
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 50
    ) {
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      setIsVisible(true);
      return;
    }

    if (scrollSpeed > speedThreshold && currentScrollY > lastScrollY.current) {
      // If scroll speed exceeds the threshold and user is scrolling down, hide the navbar
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      // If user scrolls up, show the navbar
      setIsVisible(true);
    }

    // Update the last scroll position and time
    lastScrollY.current = currentScrollY;
    lastTime.current = currentTime;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsBottomNavOpen(!!isSmallScreen);
  }, [isSmallScreen]);

  const isEventActive = pathname.startsWith("/events");
  const isNewsActive = pathname === "/";

  const isContactScreen = pathname.startsWith("/contact");
  const eventsScreen = pathname.startsWith("/events");

  if (!isSmallScreen) return null;
  return (
    <div
      className={
        "w-full transition-height " +
        (!eventsScreen && (isContactScreen || !isVisible) ? "h-0" : "h-[100px]")
      }
    >
      <div
        className="fixed bottom-[-1px] z-[999] left-0 w-full h-[60px] transition-all duration-300 ease-in-out"
        style={{
          transform: `translateY(${isVisible ? "0" : "100%"})`,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div className="w-full flex justify-between relative h-full">
          <div
            className={
              "left__menu flex-1 flex items-stretch justify-start " +
              (isContactScreen ? " !bg-transparent" : "")
            }
          >
            <Link
              href="/"
              onClick={(e) => {}}
              style={{
                textDecoration: "inherit",
                border: isContactScreen ? "none" : "",
              }}
              id="homeIntro"
              className={
                "w-[92%] flex items-center justify-center mobile-border " +
                (isNewsActive ? "news-border" : "")
              }
            >
              <div className="nav__box__wrapper flex flex-col items-center justify-center">
                <Image
                  height={100}
                  width={100}
                  className="nav__icon__img w-5 h-5"
                  src={!isNewsActive ? newsIcon : newsActiveIcon}
                  alt="News Icon"
                />
                <p
                  className={
                    "text-xs mt-0.5 " +
                    (isNewsActive ? " text-[#4c72fa]" : " text-[#B6B6B6]")
                  }
                >
                  News
                </p>
              </div>
            </Link>
          </div>
          <div className="middle__menu w-[104px] flex-shrink-0">
            <svg
              width={115}
              height={76}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                opacity: isContactScreen ? 0 : 1,
              }}
            >
              <g filter="url(#a)">
                <path
                  d="M104.5 12.845V19L57 66 10 19v-5.065c0-1.723 2.033-2.64 3.324-1.5l43.351 38.288a4 4 0 0 0 5.483-.177l38.924-39.112c1.259-1.264 3.418-.373 3.418 1.41Z"
                  fill="#232323"
                  fillOpacity={0.07}
                />
              </g>
              <path
                d="M109 16.603V71H6V16.603c0-1.781 2.154-2.674 3.414-1.414L50.43 56.204c3.905 3.905 10.237 3.905 14.142 0l41.015-41.015c1.26-1.26 3.414-.367 3.414 1.414Z"
                fill="#f8f5d7"
              />
              <defs>
                <filter
                  id="a"
                  x={0}
                  y={0.841}
                  width={114.5}
                  height={75.159}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation={5}
                    result="effect1_foregroundBlur_126_19"
                  />
                </filter>
              </defs>
            </svg>
            <Link
              href="/contact"
              onClick={(e) => {}}
              style={{
                textDecoration: "inherit",
              }}
              className="diamond"
              id="blazeIntro"
            >
              <div className="nav__box__wrapper diamond__blaze">
                <Image
                  height={100}
                  width={100}
                  className="nav__icon__img"
                  src={blazeIcon}
                  alt="Blaze Icon"
                />
              </div>
            </Link>
          </div>
          <div
            className={
              "right__menu flex-1 flex items-stretch justify-end " +
              (isContactScreen ? " !bg-transparent" : "")
            }
          >
            <Link
              href="/events"
              style={{
                textDecoration: "inherit",
                border: isContactScreen ? "none" : "",
              }}
              onClick={(e) => {}}
              id="classesIntro"
              className={
                "w-[92%] flex items-center justify-center mobile-border " +
                (isEventActive ? "events-border " : "")
              }
            >
              <div className="nav__box__wrapper flex flex-col items-center justify-center">
                <Image
                  height={100}
                  width={100}
                  className="w-5"
                  src={!isEventActive ? eventsIcon : eventsActiveIcon}
                  alt="Events Icon"
                />
                <p
                  className={
                    "text-xs mt-0.5 " +
                    (isEventActive ? "text-[#dd2476]" : " text-[#B6B6B6]")
                  }
                >
                  Events
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
