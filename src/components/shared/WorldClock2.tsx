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
  z-index: 2;
  top: 90px;
  left: 139px;
  width: 4px;
  height: 65px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 50px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 43200s
    linear infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 43200s linear
    infinite;
`;

const AnimatedMinuteDiv = styled.div`
  position: absolute;
  z-index: 3;
  top: 70px;
  left: 139px;
  width: 4px;
  height: 85px;
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 2px 70px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 3600s
    linear infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 3600s linear
    infinite;
`;

const AnimatedSecondDiv = styled.div`
  position: absolute;
  z-index: 4;
  top: 30px;
  left: 140px;
  width: 2px;
  height: 130px;
  background-color: #a00;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  transform-origin: 1px 110px;
  transition: 0.5s;
  -webkit-animation: ${(props: any) => generateKeyframes(props.deg)} 60s linear
    infinite;
  animation: ${(props: any) => generateKeyframes(props.deg)} 60s linear infinite;
`;

function getTimeForOffset(offsetInHours: number) {
  const date = new Date();
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000; // Convert local time to UTC
  const targetTime = new Date(utcTime + offsetInHours * 60 * 60000); // Apply the offset in minutes
  return targetTime;
}

export default function WorldClock2({ timezone }: { timezone: number }) {
  const hourDeg = useMemo(() => {
    var now = getTimeForOffset(timezone);
    return (now.getHours() / 12) * 360 + (now.getMinutes() / 60) * 30;
  }, [timezone]);

  const minuteDeg = useMemo(() => {
    var now = getTimeForOffset(timezone);
    return (now.getMinutes() / 60) * 360 + (now.getSeconds() / 60) * 6;
  }, [timezone]);

  const secondDeg = useMemo(() => {
    var now = getTimeForOffset(timezone);
    return (now.getSeconds() / 60) * 360;
  }, [timezone]);

  return (
    <div className="clock-wrapper" style={{ zoom: 0.12 }}>
      {/* @ts-ignore */}
      <AnimatedHourDiv deg={hourDeg} className="clock-hour"></AnimatedHourDiv>
      <AnimatedMinuteDiv
        // @ts-ignore
        deg={minuteDeg}
        className="clock-minute"
      ></AnimatedMinuteDiv>
      <AnimatedSecondDiv
        // @ts-ignore
        deg={secondDeg}
        className="clock-second"
      ></AnimatedSecondDiv>
    </div>
  );
}

export const WorldClockWithLabel = ({ timezone = -4, label = "D.C." }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-[8px] font-helvetica">{label}</p>
      <WorldClock2 timezone={timezone} />
    </div>
  );
};
