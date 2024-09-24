"use client";

import { FormProvider, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const CreateEventForm = dynamic(() => import("./CreateEventForm"), {
  ssr: false,
});
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGetEventById } from "@/api/event";
import { useUser } from "@/context/UserContext";
import { useNotification } from "@/context/NotificationContext";
import { SnackbarContent } from "../AdminEditor/AdminPage";

/**
 *
 * Venue can be either "online" or "offline"
 * if online, location is not required and link is required
 * if offline, venue details and venue image is required but link is not required
 */

export interface CreateEventFormValues {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  description: string;
  event_image: string;
  organizer_name: string;
  organizer_image: string;
  organizer_info: string;
  contact_email: string;
  contact_phone: string;
  venue: "online" | "offline";
  meetingLink?: string;
  venue_name?: string;
  venue_maps_link?: string;
  venue_address?: string | null;
  // venue_image?: string;
  isAllDay: boolean;
}

const createEventSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  eventDate: Yup.string()
    .required("StartTime is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
      "Date must be in ISO format"
    ),
  startTime: Yup.string()
    .required("StartTime is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
      "Date must be in ISO format"
    ),
  description: Yup.string().required("Description is required"),
  event_image: Yup.string(),
  organizer_name: Yup.string().required("Organizer name is required"),
  organizer_image: Yup.string(),
  organizer_info: Yup.string().required("Organizer info is required"),
  contact_email: Yup.string()
    .email("Invalid email")
    .required("Contact email is required"),
  isAllDay: Yup.boolean().required("Is All Day required"),
  endTime: Yup.string().when("isAllDay", (isAllDay, schema) =>
    isAllDay && isAllDay.includes(false)
      ? schema.required("EndTime is required")
      : schema.notRequired()
  ),
  contact_phone: Yup.string().required("Contact phone is required"),
  venue: Yup.string()
    .required("Venue type is required")
    .oneOf(["online", "offline"]),
  meetingLink: Yup.string().when("venue", (venue, schema) =>
    venue && venue.includes("online")
      ? schema.required("Link is required for online events")
      : schema.notRequired()
  ),
  venue_name: Yup.string().when("venue", (venue, schema) =>
    venue && venue.includes("offline")
      ? schema.required("Venue name is required for offline events")
      : schema.notRequired()
  ),
  venue_maps_link: Yup.string().when("venue", (venue, schema) =>
    venue && venue.includes("offline")
      ? schema.required("Venue Maps Link is required for offline events")
      : schema.notRequired()
  ),
  // venue_image: Yup.string(),
  venue_address: Yup.string().nullable(),
});

export default function CreateEventEntry() {
  const searchParams = useSearchParams();
  const { openNotification } = useNotification();

  const methods = useForm<CreateEventFormValues>({
    resolver: useYupValidationResolver(createEventSchema),
    defaultValues: {
      venue: "online",
      isAllDay: false,
    },
  });
  const eventId = searchParams.get("event_id");
  const { data: event } = useGetEventById(eventId);
  const { user, getUserAsync } = useUser();
  const router = useRouter();

  useEffect(() => {
    getUserAsync().then((user) => {
      if (!user) {
        // Redirect to login
        event
          ? router.push("/events?event_id=" + event.id)
          : router.push("/events");
        return;
      }
      if (event && event.author.uid !== user.uid && !user?.is_admin) {
        // Redirect to login
        router.push("/events?event_id=" + event.id);
        return;
      }
    });
  }, [event, user, router, getUserAsync]);

  useEffect(() => {
    if (user?.is_admin) return;
    if (user && !user.is_event_creator) {
      router.push("/events");
    }
  }, [router, user]);

  useEffect(() => {
    if (event) {
      // Fetch the event details
      methods.setValue("title", event.title);
      methods.setValue("eventDate", event.eventDate.toDate().toISOString());
      methods.setValue("startTime", event.startTime.toDate().toISOString());
      methods.setValue("endTime", event.endTime?.toDate().toISOString());
      methods.setValue("description", event.description);
      methods.setValue("event_image", event.displayImage);
      methods.setValue("organizer_name", event.organizer.name);
      methods.setValue("organizer_image", event.organizer.photoURL);
      methods.setValue("organizer_info", event.organizer.description);
      methods.setValue("contact_email", event.organizer.email);
      methods.setValue("contact_phone", event.organizer.contact);
      methods.setValue("venue", event.venue.type);
      if (event.venue.type === "online") {
        methods.setValue("meetingLink", event.venue.meetingLink);
      } else {
        // Offline venue
        methods.setValue("venue_name", event.venue.name);
        methods.setValue("venue_maps_link", event.venue.mapsLink);
        // methods.setValue("venue_image", event.venue.image);
        methods.setValue("venue_address", event.venue.address);
      }
      methods.setValue("isAllDay", event.isAllDay);

      console.log("event - ", event);
    }
  }, [event, methods]);

  return (
    <div className="w-full pb-20 max-w-[900px] mx-auto">
      <div>
        <h2 className="text-appBlack text-[30px] mt-8 font-larkenExtraBold">
          {event ? "Edit Event" : "Create Event"}
        </h2>
      </div>
      <FormProvider {...methods}>
        <CreateEventForm event={event} />
      </FormProvider>
    </div>
  );
}
