import { useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";

const generateKeyframes = (deg: number) => keyframes`
  from {
    transform: rotate(${deg}deg);
  }
  to {
    transform: rotate(${deg + 360}deg);
  }
`;

// position: absolute;
//   z-index: 2;
//   top: 80px;
//   left: 128px;
//   width: 4px;
//   height: 65px;
//   background-color: #555;
//   border-radius: 2px;
//   box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//   transform-origin: 2px 50px;
//   transition: 0.5s;
//   -webkit-animation: rotate-hour 43200s linear infinite;
//   -moz-animation: rotate-hour 43200s linear infinite;

const AnimatedHourDiv = styled.div`
  position: absolute;
  top: 50%;
  transform-origin: center 0;
  animation-name: styles_rotation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  height: 0.375rem;
  width: 0.0625rem;
  left: calc(50% - 0.0625rem / 2);
  background-color: #1f1d1a;
  animation-duration: 43200s;
`;

const AnimatedMinuteDiv = styled.div`
  position: absolute;
  top: 50%;
  transform-origin: center 0;
  animation-name: styles_rotation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  height: 0.625rem;
  width: 0.0625rem;
  left: calc(50% - 0.0625rem / 2);
  background-color: #1f1d1a;
  animation-duration: 3600s;
`;

const AnimatedSecondDiv = styled.div`
  position: absolute;
  top: 50%;
  transform-origin: center 0;
  animation-name: styles_rotation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  height: 0.75rem;
  width: 0.03125rem;
  left: calc(50% - 0.03125rem / 2);
  background-color: #af1f1b;
  animation-duration: 60s;
`;

function getTimeForOffset(offsetInHours: number) {
  const date = new Date();
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000; // Convert local time to UTC
  const targetTime = new Date(utcTime + offsetInHours * 60 * 60000); // Apply the offset in minutes
  return targetTime;
}

function calculateDelays(timezoneOffset: number) {
  const now = getTimeForOffset(timezoneOffset);

  const hours = now.getHours() % 12; // Get hours in 12-hour format
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDelay = -((hours * 3600 + minutes * 60 + seconds) % 43200); // Total seconds in 12 hours
  const minuteDelay = -((minutes * 60 + seconds) % 3600); // Total seconds in an hour
  const secondDelay = -(seconds % 60); // Total seconds in a minute

  return {
    hourDelay,
    minuteDelay,
    secondDelay,
  };
}

export default function WorldClock2({
  timezone,
  delay,
}: {
  timezone: number;
  delay?: number;
}) {
  const { hourDelay, minuteDelay, secondDelay } = useMemo(
    () => calculateDelays(timezone),
    [timezone]
  );

  return (
    <div className="clock-wrapper">
      <AnimatedHourDiv
        style={{ animationDelay: `${hourDelay}s` }}
        className="clock-hour"
      />
      <AnimatedMinuteDiv
        style={{ animationDelay: `${minuteDelay}s` }}
        className="clock-minute"
      />
      <AnimatedSecondDiv
        style={{ animationDelay: `${secondDelay}s` }}
        className="clock-second"
      />
    </div>
  );
}

export const WorldClockWithLabel = ({
  timezone = -4,
  delay = 0,
  label = "D.C.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-[8px] font-helvetica">{label}</p>
      <WorldClock2 timezone={timezone} delay={delay} />
    </div>
  );
};
