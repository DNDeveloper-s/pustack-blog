"use client";

import { runCanvasScript } from "@/lib/canvas";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import Orbit from "@/assets/blaze/orbit.png";
import Saturn from "@/assets/blaze/pro_planet_yellow.svg";
import BluePlanet from "@/assets/blaze/pro_planet_blue.svg";
import PurplePlanet from "@/assets/blaze/pro_planet_purple.svg";
import zoox from "@/assets/blaze/zoox.png";
import google from "@/assets/blaze/google.png";
import meta from "@/assets/blaze/meta.png";
import godaddy from "@/assets/blaze/godaddy.png";
import openai from "@/assets/blaze/openai.png";
import owl from "@/assets/blaze/owl-24.png";
import Link from "next/link";

const OwlIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={28} height={48} {...props}>
    <path d="M9.9 29c-3.6-.9-6.7-3.1-8.9-6v17.2c6.6-3.9 8.5-9.6 8.9-11.2ZM13.8 29.5c-.6 0-1.3 0-1.9-.1-.4 1.8-2.6 8.8-10.8 13.1V48c7 0 13.4-2.9 18-7.5 4.5-4.5 7.3-10.7 7.5-17.5-2.9 3.9-7.6 6.5-12.8 6.5ZM21.5 2.4C19.3.9 16.7 0 13.8 0 11 0 8.3.9 6.1 2.3c1.9.2 4.7.9 7.7 3.9 2.8-3 5.8-3.7 7.7-3.8Z" />
    <path d="M14.6 8.4c-.2.2-.5.3-.8.4-.3 0-.6-.1-.8-.3-5.1-5.7-8.4-3.6-9.3-4C1.4 7 0 10.3 0 13.9c0 7.6 6.2 13.8 13.8 13.8 7.6 0 13.8-6.2 13.8-13.8 0-3.6-1.4-7-3.7-9.4-.9.3-5-1.4-9.3 3.9Zm-7.5 6.9c-1.7 0-3-1.3-3-3 0-1.6 1.3-3 3-3s3 1.4 3 3c0 1.7-1.3 3-3 3Zm6.7 5-2.1-5H16l-2.2 5Zm6.7-5c-1.7 0-3-1.3-3-3 0-1.6 1.3-3 3-3s3 1.4 3 3c0 1.7-1.4 3-3 3Z" />
  </svg>
);

const config = {
  zoox: {
    border: "1px solid #4faf8b66",
    borderActive: "1px solid #4faf8b",
    background: "#5ebf9c91",
  },
  openai: {
    border: "1px solid #ffffff5e",
    borderActive: "1px solid #ffffff",
    background: "#fdfdfd91",
  },
  godaddy: {
    border: "1px solid #3dcbc775",
    borderActive: "1px solid #3dcbc7",
    background: "#25d5db87",
  },
  meta: {
    border: "1px solid #005ecc66",
    borderActive: "1px solid #005ecc",
    background: "#005ecc73",
  },
  google: {
    border: "1px solid #e942396e",
    borderActive: "1px solid #e94239",
    background: "#e7452e7a",
  },
};

function HoveredContent({ background }: { background: string }) {
  const [rightMode, setRightMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!containerRef.current) return;
      const { left, right } = containerRef.current.getBoundingClientRect();
      if (!rightMode && right > window.innerWidth) {
        setRightMode(true);
      }
      if (rightMode && left < 0) {
        setRightMode(false);
      }
    }, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, [rightMode]);

  let classNames = "left-[16px] pl-[30px]";
  if (rightMode) {
    classNames = "right-[16px] pr-[30px] pl-[12px]";
  }

  return (
    <div
      ref={containerRef}
      className={
        "absolute top-0 group-hover:opacity-100 opacity-0 transition-opacity h-full w-[120px] rounded text-white  py-1 " +
        classNames
      }
      style={{
        background,
      }}
    >
      <h2 className="text-[13px]">Facebook</h2>
      <p className="text-[9px]">Content Partner</p>
    </div>
  );
}

function TeacherElement({
  src,
  onHoverChange,
  isActive,
  config,
}: {
  src: StaticImageData;
  onHoverChange: (isHovered: boolean) => void;
  isActive?: boolean;
  config?: {
    border: string;
    borderActive: string;
    background: string;
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const handleMouseEnter = () => {
      // console.log("entered");
      // containerEl.classList.add("hovered");
      onHoverChange(true);
    };

    const handleMouseLeave = () => {
      // console.log("left");
      // containerEl.classList.remove("hovered");
      onHoverChange(false);
    };

    containerEl.addEventListener("mouseenter", handleMouseEnter);
    containerEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("mouseenter", handleMouseEnter);
        containerEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [onHoverChange]);

  return (
    <div
      className="teacher__content group"
      ref={containerRef}
      style={
        {
          // animationPlayState: isActive ? "paused" : "running",
        }
      }
    >
      <Image
        width={100}
        height={100}
        className="teacher__img relative z-10"
        src={src}
        alt="teacher"
        style={{
          border: !isActive
            ? config?.border ?? "1px solid #ffffff5e"
            : config?.borderActive ?? "1px solid #ffffff",
        }}
      />
      <HoveredContent background={config?.background ?? "#fdfdfd91"} />
    </div>
  );
}

function OrbitOne() {
  const [isHovered, setIsHovered] = useState(false);
  const onHoverChange = (_isHovered: boolean) => {
    setIsHovered(_isHovered);
  };
  return (
    <div className="orbit__3">
      <div
        className="orbit__wrapper"
        style={{
          zIndex: isHovered ? 12 : 1,
          // animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        <Image
          width={100}
          height={100}
          src={Orbit}
          alt="Orbit 1"
          className="orbit__img"
          draggable={false}
        />
        <div className="teacher__wrapper__1">
          <TeacherElement
            src={zoox}
            isActive={isHovered}
            onHoverChange={onHoverChange}
            config={config.zoox}
          />
        </div>

        <div className="teacher__wrapper__2">
          <TeacherElement
            src={google}
            isActive={isHovered}
            onHoverChange={onHoverChange}
            config={config.google}
          />
        </div>

        <div className="teacher__wrapper__2 t3">
          <TeacherElement
            src={godaddy}
            isActive={isHovered}
            onHoverChange={onHoverChange}
            config={config.godaddy}
          />
        </div>
      </div>
    </div>
  );
}

function OrbitTwo() {
  const [isHovered, setIsHovered] = useState(false);
  const onHoverChange = (_isHovered: boolean) => {
    setIsHovered(_isHovered);
  };

  return (
    <div className="orbit__2">
      <div
        className="orbit__wrapper"
        style={{
          zIndex: isHovered ? 12 : 1,
          // animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        <Image
          width={100}
          height={100}
          src={Orbit}
          alt="Orbit 1"
          className="orbit__img"
          draggable={false}
        />

        <div className="saturn">
          <Image
            width={100}
            height={100}
            src={Saturn}
            alt="saturn"
            draggable={false}
          />
        </div>
        <div className="teacher__wrapper__2 t4">
          {/* <div className="teacher__content group">
            <Image
              width={100}
              height={100}
              className="teacher__img relative z-10"
              src={openai}
              alt="shreya"
            />
            <HoveredContent />
          </div> */}
          <TeacherElement
            src={openai}
            isActive={isHovered}
            onHoverChange={onHoverChange}
            config={config.openai}
          />
        </div>
      </div>
    </div>
  );
}

function OrbitThree() {
  const [isHovered, setIsHovered] = useState(false);
  const onHoverChange = (_isHovered: boolean) => {
    setIsHovered(_isHovered);
  };

  return (
    <div className="orbit__1">
      <div
        className="orbit__wrapper"
        style={{
          zIndex: isHovered ? 12 : 1,
          // animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        <Image
          width={100}
          height={100}
          src={Orbit}
          alt="Orbit 1"
          className="orbit__img"
          draggable={false}
        />
        <div className="teacher__wrapper__2 t2">
          <TeacherElement
            src={meta}
            isActive={isHovered}
            onHoverChange={onHoverChange}
            config={config.meta}
          />
        </div>

        <div className="teacher__wrapper__2 t5">
          <div className="teacher__content">
            <Image
              width={100}
              height={100}
              className="teacher__img"
              src={BluePlanet}
              alt="rupal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  useEffect(() => {
    const canvasEl = document.getElementById("space-canvas");
    if (canvasEl) {
      // @ts-ignore
      runCanvasScript(canvasEl, canvasEl.clientWidth, canvasEl.clientHeight);
    }
  }, []);

  return (
    <div className="w-screen overflow-hidden bg-[#0e1525] h-full flex-1 relative">
      <div className="absolute top-2">
        <h2 className="contact-heading-btn px-4 font-helvetica">Contact</h2>
      </div>
      <canvas
        id="space-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></canvas>
      <div className={"blaze__sidebar__nosessions__wrapper show__tabs fadeIn"}>
        <div className="sidebar-particle-wrapper">
          <div className="blaze__circle">
            <div className="orbits__wrapper">
              <OrbitOne />
              <OrbitTwo />
              <OrbitThree />

              <div
                className="!w-10 !h-10 p-2 rounded-full bg-black border border-gray-500"
                style={{
                  animation: "glow 3s infinite both",
                }}
              >
                <Image
                  className="w-full h-full rounded-full object-contain"
                  width={100}
                  height={100}
                  src={owl}
                  alt="user"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 absolute bottom-28 w-full">
        <h6 className="text-white font-light text-lg font-helvetica">Hello!</h6>
        <h2 className="text-white font-semibold text-2xl font-helvetica">
          Let&apos;s talk AI & more.
        </h2>
        <Link
          className="schedule-meeting-btn w-full font-helvetica block text-center"
          href={`mailto:?subject=Hey There!&body=Hello Minerva, how are you doing?`}
          target="_blank"
        >
          Schedule Meeting
        </Link>
      </div>
    </div>
  );
}
