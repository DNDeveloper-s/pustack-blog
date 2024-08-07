"use client";

import Link from "next/link";
import classes from "./Events.module.css";
import useScreenSize from "@/hooks/useScreenSize";
import { useGetClosestEvent } from "@/api/event";
import { useEffect } from "react";
import { redirect } from "next/navigation";

function EventCard({ isUpcoming }: { isUpcoming?: boolean }) {
  return (
    <Link
      className={
        classes.card_wrapper +
        " " +
        (isUpcoming ? classes.upcoming : classes.past)
      }
      href="#"
    >
      <div className={classes.event_title_label}>
        <p className={classes.event_label + " " + classes.past}>
          {isUpcoming ? "UPCOMING" : "PAST"}
        </p>
      </div>
      <div className={classes.link_title}>
        <span style={{ fontWeight: "bold" }}>
          Cybersecurity: Tackling the Policy Puzzle
        </span>
      </div>
      <div className={classes.link_info}>
        <p className="mb-0 p-[0_10px]">June 18, 2024</p>
      </div>
      <p className={classes.link_para}>
        <span style={{ fontWeight: "bold" }}>
          The cybersecurity landscape is dynamic and ever-changing, with new
          threats, vulnerabilities, and attack techniques emerging regularly.
          Yet even in a technologically advanced environment, humans remain at
          the core of cybersecurity as both defenders and perpetrators of cyber
          threats. Join Minerva senior editors for a consequential discussion on
          how policymakers and business leaders can work together to establish a
          more proactive and innovative cybersecurity ecosystem.
        </span>
      </p>
      <div>
        <div className={classes.link_dashed_holder}>
          <div className={classes.link_dashed}></div>
        </div>
        <div className={classes.link_cta}>Learn More →</div>
      </div>
    </Link>
  );
}

export default function Events({ eventId }: { eventId?: string | null }) {
  const { isMobileScreen } = useScreenSize();

  const { data: event, error } = useGetClosestEvent({ enabled: true });

  useEffect(() => {
    if (!event?.id) return;
    if (!isMobileScreen) {
      redirect("/events?event_id=" + event.id);
    } else {
      redirect("/events/list");
    }
  }, [isMobileScreen, event]);

  return <div></div>;
}
