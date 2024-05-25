"use client";

import { Clock } from "@/lib/clock";
import { useEffect, useRef } from "react";

export default function WorldClock({ timezone = "-4" }) {
  const handSecondsRef = useRef<HTMLDivElement>(null);
  const handMinutesRef = useRef<HTMLDivElement>(null);
  const handHoursRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !handSecondsRef.current ||
      !handMinutesRef.current ||
      !handHoursRef.current
    )
      return;
    const clock = new Clock(
      timezone,
      handSecondsRef.current,
      handMinutesRef.current,
      handHoursRef.current
    );

    return () => {
      clock.destroy();
    };
  }, [timezone]);

  return (
    <div className="widget clock">
      {/* <div className="shadow"></div> */}
      <div ref={handSecondsRef} className="hand seconds"></div>
      <div ref={handMinutesRef} className="hand minutes"></div>
      <div ref={handHoursRef} className="hand hours"></div>
      <div className="hand-cap"></div>
    </div>
  );
}

export const WorldClockWithLabel = ({ timezone = "-4", label = "D.C." }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-[8px] font-helvetica">{label}</p>
      <WorldClock timezone={timezone} />
    </div>
  );
};
