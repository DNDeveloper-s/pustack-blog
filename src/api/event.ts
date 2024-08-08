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
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
