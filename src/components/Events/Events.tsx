import Link from "next/link";
import classes from "./Events.module.css";

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
          threats. Join Minerva senior editors for a consequential discussion
          on how policymakers and business leaders can work together to
          establish a more proactive and innovative cybersecurity ecosystem.
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

export default function Events() {
  return (
    <div className="min-h-screen">
      <div>
        <h1 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          Events
        </h1>
      </div>
      <div className="grid grid-cols-3 mt-8 pb-[100px] gap-[45px]">
        <EventCard isUpcoming />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
}
