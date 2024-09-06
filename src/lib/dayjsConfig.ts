import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import isoWeek from "dayjs/plugin/isoWeek"; // To group by weeks
import weekOfYear from "dayjs/plugin/weekOfYear"; // To get the week of the year
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // To compare dates
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // To compare dates
import utc from "dayjs/plugin/utc"; // To convert to UTC
import timezone from "dayjs/plugin/timezone"; // To convert to timezone

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);

export function pstDayjs(
  dateInput: string | number | Date | Dayjs | null | undefined
) {
  return dayjs(dateInput).tz("America/Los_Angeles");
}

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a sec",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%M",
    y: "1y",
    yy: "%dy",
  },
});
export default dayjs;
