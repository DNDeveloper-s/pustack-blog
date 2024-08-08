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
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";

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
  events: Event[];
}

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
      events: [],
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
    return transformEventsToMonthlyStructure(queryData.data, dayjs());
  }, [queryData.data]);

  return { ...queryData, transformedEvents };
};
