// const sampleJSON = {
//   id: "123",
//   title: "Sample Event",
//   description: "This is a description of the event.",
//   startTime: 1672531199000,
//   endTime: 1672617599000,
//   organizer: {
//     name: "John Doe",
//     photoURL: "https://example.com/photo.jpg",
//     description: "Organizer of the event.",
//     email: "john.doe@example.com",
//     contact: "+1234567890",
//   },
//   venue: {
//     name: "Conference Hall",
//     image: "https://example.com/venue.jpg",
//   },
//   displayImage: "https://example.com/display.jpg",
//   isAllDay: false,
//   background: getRandomDarkHexColor(),
// };

import { API_QUERY } from "@/config/api-query";
import { Event } from "@/firebase/event";
import {
  QueryFunctionContext,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "@/lib/dayjsConfig";
import { useMemo } from "react";
import { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

export const useCreateEvent = (
  options?: UseMutationOptions<Event, Error, Event>
) => {
  const qc = useQueryClient();

  const createEvent = async (event: Event) => {
    const newEvent = await event.saveToFirestore();
    return newEvent;
  };

  return useMutation({
    mutationFn: createEvent,
    onSettled: (data, error, variables) => {
      qc.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === API_QUERY.QUERY_EVENTS()[0];
        },
      });

      qc.invalidateQueries({
        queryKey: API_QUERY.GET_EVENT_BY_ID(data?.id),
      });

      qc.invalidateQueries({
        queryKey: API_QUERY.GET_EVENTS_FOR_DATE_RANGE,
      });
    },
    ...(options ?? {}),
  });
};

export const useGetEventById = (eventId?: string | null) => {
  const getEventById = async ({ queryKey }: QueryFunctionContext) => {
    const [, eventId] = queryKey;
    if (!eventId || typeof eventId !== "string") {
      throw new Error("Event ID is required");
    }
    const event = await Event.get(eventId, true);
    return event;
  };

  return useQuery({
    queryKey: API_QUERY.GET_EVENT_BY_ID(eventId),
    queryFn: getEventById,
    enabled: !!eventId,
  });
};

export const useGetClosestEvent = (
  options?: Omit<
    UseQueryOptions<Event | null | undefined>,
    "queryKey" | "queryFn"
  >
) => {
  const getClosestEvent = async () => {
    const event = await Event.getClosestEvent();
    return event;
  };

  return useQuery({
    queryKey: API_QUERY.GET_CLOSEST_EVENT,
    queryFn: getClosestEvent,
    ...options,
  });
};

export interface TransformedEvent {
  id: string;
  month_name: string;
  full_year: string;
  isCurrent: boolean;
  events: Event[];
}

/**
 * id: "no-events-today",
          title: "No events",
          startTime: Timestamp.fromDate(today.toDate()),
          description: "",
 */

type ActualEvent = {
  exists: true;
  data: Event;
};

type NoEventToday = {
  exists: false;
  data: {
    id: string;
    title: string;
    startTime: Timestamp;
    description: string;
  };
};

type StructureEventType = ActualEvent | NoEventToday;

export interface TransformedEventWeekStructure {
  id: string;
  month_name: string;
  full_year: string;
  isCurrent: boolean;
  weeks: {
    id: string;
    start: string;
    end: string;
    isCurrentWeek: boolean;
    events: StructureEventType[];
  }[];
}

const transformEventsToWeekStructure = (
  events: (Event | undefined)[],
  currentDate: Dayjs
): TransformedEventWeekStructure[] => {
  const months: TransformedEventWeekStructure[] = [];

  // Generate the list of months
  for (let i = -2; i <= 2; i++) {
    const monthDate = currentDate.add(i, "month");
    const month = {
      id: monthDate.format("MMMM").toLowerCase(),
      month_name: monthDate.format("MMMM"),
      full_year: monthDate.format("YYYY"),
      isCurrent: i === 0,
      weeks: [],
    };

    // Get all weeks within the month
    const startOfMonth = monthDate.startOf("month");
    const endOfMonth = monthDate.endOf("month");

    let currentWeekStart = startOfMonth.startOf("week");
    let currentWeekEnd = currentWeekStart.endOf("week");

    while (currentWeekStart.isBefore(endOfMonth)) {
      const isCurrentWeek =
        currentDate.isSameOrAfter(currentWeekStart) &&
        currentDate.isSameOrBefore(currentWeekEnd);
      const week = {
        id: `${currentWeekStart.format("MMM D")} - ${currentWeekEnd.format(
          "MMM D"
        )}`,
        start: currentWeekStart.toISOString(),
        end: currentWeekEnd.toISOString(),
        events: [],
        isCurrentWeek,
      };

      // @ts-ignore
      month.weeks.push(week);

      currentWeekStart = currentWeekStart.add(1, "week");
      currentWeekEnd = currentWeekStart.endOf("week");
    }

    months.push(month);
  }

  // Assign events to the correct week
  events.forEach((event) => {
    if (!event) return;
    const eventDate = dayjs(event.startTime.toDate());
    const eventMonth = eventDate.format("MMMM");
    const month = months.find((m: any) => m.month_name === eventMonth);

    if (month) {
      const week = month.weeks.find(
        (w: any) =>
          eventDate.isSameOrAfter(dayjs(w.start)) &&
          eventDate.isSameOrBefore(dayjs(w.end))
      );

      if (week) {
        week.events.push({
          exists: true,
          data: event,
        });
      }
    }
  });

  // Ensure today's date is always included
  const today = currentDate.startOf("day");
  const todayMonth = today.format("MMMM");
  const month = months.find((m) => m.month_name === todayMonth);

  if (month) {
    const todayWeek = month.weeks.find(
      (w) =>
        today.isSameOrAfter(dayjs(w.start)) &&
        today.isSameOrBefore(dayjs(w.end))
    );

    if (todayWeek) {
      const isTodayIncluded = todayWeek.events.some((event) =>
        dayjs(event.data.startTime.toDate()).isSame(today, "day")
      );

      if (!isTodayIncluded) {
        todayWeek.events.push({
          exists: false,
          data: {
            id: "no-events-today",
            title: "No events",
            startTime: Timestamp.fromDate(today.toDate()),
            description: "",
          },
        });
      }
    }
  }

  return months;
};

const transformEventsToMonthlyStructure = (
  events: (Event | undefined)[],
  currentDate: Dayjs
): TransformedEvent[] => {
  const months: TransformedEvent[] = [];

  // Generate the list of months
  for (let i = -2; i <= 2; i++) {
    const monthDate = currentDate.add(i, "month");
    months.push({
      id: monthDate.format("MMMM").toLowerCase(),
      month_name: monthDate.format("MMMM"),
      full_year: monthDate.format("YYYY"),
      events: [],
      isCurrent: i === 0,
    });
  }

  // Assign events to the correct month
  events.forEach((event) => {
    if (!event) return;
    const eventMonth = dayjs(event.startTime.toDate()).format("MMMM");
    const month = months.find((m) => m.month_name === eventMonth);
    if (month) {
      month.events.push(event);
    }
  });

  return months;
};

export const useGetEventsForDateRange = (
  options?: Omit<
    UseQueryOptions<(Event | undefined)[] | null | undefined>,
    "queryKey" | "queryFn"
  >
) => {
  const getEventsForDateRange = async () => {
    const events = await Event.fetchEventsForDateRange();
    console.log("Testing Date Range | events - ", events);
    return events;
  };

  const queryData = useQuery({
    queryKey: API_QUERY.GET_EVENTS_FOR_DATE_RANGE,
    queryFn: getEventsForDateRange,
    ...options,
  });

  const transformedEvents = useMemo(() => {
    if (!queryData.data) return null;
    console.log(
      "transformEventsToWeekStructure - ",
      transformEventsToWeekStructure(queryData.data, dayjs())
    );
    return transformEventsToWeekStructure(queryData.data, dayjs());
  }, [queryData.data]);

  return { ...queryData, transformedEvents };
};
