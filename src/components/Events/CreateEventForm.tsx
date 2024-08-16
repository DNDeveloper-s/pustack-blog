import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  GetProp,
  Radio,
  RadioChangeEvent,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TbFileUpload } from "react-icons/tb";
import { CreateEventFormValues } from "./CreateEventEntry";
import dayjs, { Dayjs } from "dayjs";
import { Spinner } from "@nextui-org/spinner";
import { useNotification } from "@/context/NotificationContext";
import { handleUploadAsync } from "@/lib/firebase/upload";
import { Button } from "@nextui-org/button";
import { IoIosCreate } from "react-icons/io";
import { NotificationPlacements } from "antd/es/notification/interface";
import { SnackbarContent } from "../AdminEditor/AdminPage";
import { getRandomDarkHexColor } from "@/lib/colors";
import { Event, EventVenueType } from "@/firebase/event";
import { useCreateEvent, useUpdateEvent } from "@/api/event";
import { Timestamp } from "firebase/firestore";
import DescriptionEditor from "./DescriptionEditor";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface CreateEventAttachments {
  event_image: string;
  organizer_image: string;
  venue_image?: string;
}

export default function CreateEventForm({ event }: { event?: Event }) {
  // Third Party Hooks
  const router = useRouter();

  // Context
  const {
    formState,
    getValues,
    watch,
    setValue,
    unregister,
    handleSubmit,
    setError,
  } = useFormContext<CreateEventFormValues>();
  const { openNotification } = useNotification();
  const { user } = useUser();

  // Local State
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // React Queries
  const { mutate: postCreateEvent, isPending: isCreatePending } =
    useCreateEvent({
      onSuccess: (event: Event) => {
        router.push("/events?event_id=" + event.id);
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Event created successfully."} />,
            closable: true,
            duration: 5,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
      },
      onError: (error) => {
        openNotification(
          NotificationPlacements[5],
          {
            message: (
              <SnackbarContent
                label={
                  error.message ?? "Something went wrong, Please try again."
                }
              />
            ),
            closable: true,
            duration: 5,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "error"
        );
      },
    });
  const { mutate: postUpdateEvent, isPending: isUpdatePending } =
    useUpdateEvent({
      onSuccess: (event: Event) => {
        router.push("/events?event_id=" + event.id);
        openNotification(
          NotificationPlacements[5],
          {
            message: <SnackbarContent label={"Event updated successfully."} />,
            closable: true,
            duration: 5,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "success"
        );
      },
      onError: (error) => {
        openNotification(
          NotificationPlacements[5],
          {
            message: (
              <SnackbarContent
                label={
                  error?.message ?? "Something went wrong, Please try again."
                }
              />
            ),
            closable: true,
            duration: 5,
            key: "drafts-notification",
            className: "drafts-notification",
          },
          "error"
        );
      },
    });
  const isPending = isCreatePending || isUpdatePending;

  // Watchers
  const venueValue = watch("venue");
  const isAllDayValue = watch("isAllDay");
  const startTimeValue = watch("startTime");
  const endTimeValue = watch("endTime");

  // UseEffects
  useEffect(() => {
    if (venueValue === "online") {
      unregister("venue_name");
      unregister("venue_maps_link");
      unregister("venue_address");

      // Set the meeting link
      if (event?.venue.type === "online") {
        setValue("meetingLink", event.venue.meetingLink);
      }
    } else if (venueValue === "offline") {
      unregister("meetingLink");

      // Set the offline venue details
      if (event?.venue.type === "offline") {
        setValue("venue_name", event.venue.name);
        setValue("venue_maps_link", event.venue.mapsLink);
        setValue("venue_address", event.venue.address ?? null);
      }
    }
  }, [venueValue, event]);
  useEffect(() => {
    if (isAllDayValue) {
      unregister("endTime");
    }
  }, [isAllDayValue]);

  const getAttachment = (key: keyof CreateEventAttachments) => {
    return getValues()[key];
  };

  // Validators
  const validateAttachments = (key: keyof CreateEventAttachments) => {
    if (!getAttachment(key)) {
      setError(key, {
        message: key.split("_").join(" ").toUpperCase() + " is required.",
      });
      throw new Error(key.split("_").join(" ").toUpperCase() + " is required.");
    }
    return true;
  };

  // Uploaders
  const uploadAttachment = async (key: keyof CreateEventAttachments) => {
    const localUrl = getAttachment(key);
    if (!localUrl || localUrl.startsWith("http")) return;
    const blobFile = await fetch(localUrl as string).then((res) => res.blob());

    const url = await handleUploadAsync(
      new File(
        [blobFile],
        "event-image-" + Date.now() + Math.random().toString(),
        {
          type: blobFile.type,
        }
      ),
      {
        setProgress: (progress) => {},
      }
    );

    setValue(key, url);

    return url;
  };

  // Handlers
  const createEventHandler = async (data: CreateEventFormValues) => {
    console.log("data - ", data);
    try {
      if (isUploading || isPending || !user) return;
      setIsUploading(true);
      validateAttachments("event_image");
      validateAttachments("organizer_image");
      if (venueValue === "offline") {
        validateAttachments("venue_image");
      }

      // Check for the start time and end time. If the end time is before the start time, throw an error
      if (dayjs(data.startTime).isAfter(dayjs(data.endTime))) {
        setError("endTime", {
          message: "End Time cannot be before the Start Time.",
        });
        throw new Error("End Time cannot be before the Start Time.");
      }

      // Upload the attachments
      await uploadAttachment("event_image");
      await uploadAttachment("organizer_image");

      if (venueValue === "offline") {
        await uploadAttachment("venue_image");
      }

      const values = getValues();

      let venueObject: EventVenueType = {
        type: "offline",
        name: values.venue_name as string,
        image: values.venue_image as string,
        mapsLink: values.venue_maps_link as string,
        address: (values.venue_address as string) ?? null,
      };

      if (venueValue === "offline") {
        venueObject = {
          type: "offline",
          name: values.venue_name as string,
          image: values.venue_image as string,
          mapsLink: values.venue_maps_link as string,
          address: (values.venue_address as string) ?? null,
        };
      } else {
        venueObject = {
          type: "online",
          meetingLink: values.meetingLink as string,
        };
      }

      const eventObj = {
        id: event?.id ?? undefined,
        title: values.title,
        description: values.description,
        startTime: Timestamp.fromDate(dayjs(values.startTime).toDate()),
        endTime: Timestamp.fromDate(dayjs(values.endTime).toDate()),
        organizer: {
          name: values.organizer_name,
          photoURL: values.organizer_image as string,
          description: values.organizer_info,
          email: values.contact_email,
          contact: values.contact_phone,
        },
        author: {
          name: user.name,
          email: user.email,
          uid: user.uid,
          photoURL: user.image_url,
        },
        status: "published",
        venue: venueObject,
        displayImage: values.event_image as string,
        isAllDay: event?.isAllDay ?? values.isAllDay ?? false,
        background: event?.background ?? getRandomDarkHexColor(),
      };

      console.log("eventObj - ", eventObj);

      // @ts-ignore
      const _event = new Event(eventObj);

      event ? postUpdateEvent(_event) : postCreateEvent(_event);

      setIsUploading(false);
    } catch (e: any) {
      setIsUploading(false);
      openNotification(
        NotificationPlacements[5],
        {
          message: (
            <SnackbarContent
              label={e.message ?? "Something went wrong, Please try again."}
            />
          ),
          closable: true,
          duration: 5,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "error"
      );
    }
  };
  const handleChange =
    (key: keyof CreateEventAttachments): UploadProps["onChange"] =>
    (info) => {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj as FileType, (url) => {
          setLoading(false);
          // setAttachments((prev) => ({ ...prev, [key]: url }));
          setValue(key, url);
        });
      }
    };
  const createEventErrorHandler = async (errors: any) => {
    console.log("errors - ", errors);
    openNotification(
      NotificationPlacements[5],
      {
        message: (
          <SnackbarContent label={"Please fill in all the required fields."} />
        ),
        closable: true,
        duration: 5,
        key: "drafts-notification",
        className: "drafts-notification",
      },
      "error"
    );
  };

  // Getters/Renderers
  const getImageUrl = (key: keyof CreateEventAttachments) => {
    return getValues()[key];
  };
  // const disabledDate: DatePickerProps["disabledDate"] = (current) => {
  //   return current && current < dayjs(startTimeValue);
  // };
  const uploadButton = (label?: string) => (
    <button
      style={{ border: 0, background: "none" }}
      className="flex flex-col items-center justify-center py-3"
      type="button"
    >
      {loading ? (
        <Spinner size="md" />
      ) : (
        <TbFileUpload className="text-5xl text-black text-opacity-65" />
      )}
      <div className="text-base" style={{ marginTop: 8 }}>
        {label ?? "Upload Event Image"}
      </div>
    </button>
  );

  const disabledDate = (current: any) => {
    return current && current < dayjs(startTimeValue).startOf("day");
  };

  const disabledTime = (current: any) => {
    if (dayjs(startTimeValue).isSame(current, "day")) {
      return {
        disabledHours: () =>
          Array.from({ length: 24 }, (_, i) => i).splice(
            0,
            dayjs(startTimeValue).hour()
          ),
        disabledMinutes: () =>
          Array.from({ length: 60 }, (_, i) => i).splice(
            0,
            dayjs(startTimeValue).minute()
          ),
        disabledSeconds: () =>
          Array.from({ length: 60 }, (_, i) => i).splice(
            0,
            dayjs(startTimeValue).second()
          ),
      };
    }
    return {};
  };

  return (
    <form
      className="minerva-create-form"
      onSubmit={handleSubmit(createEventHandler, createEventErrorHandler)}
    >
      <div className="mt-7">
        <div>
          <span className="uppercase block text-sm mb-1 font-larkenExtraBold text-black text-opacity-60">
            Event Details
          </span>
          <hr />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Controller
            name="title"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Event Title
                </h4>
                <input
                  // disabled={isPending}
                  className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter the Event Title"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div>
            <div className="flex justify-between items-center">
              <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                Event Date
              </h4>
              <Controller
                name="isAllDay"
                render={({ field, fieldState, formState }) => (
                  <>
                    <Checkbox
                      onChange={(e: any) => {
                        field.onChange(e.target.checked);
                      }}
                      value={field.value}
                      checked={field.value}
                      ref={field.ref}
                      name={field.name}
                      disabled={field.disabled}
                    >
                      Is All Day
                    </Checkbox>
                    {fieldState.error?.message && (
                      <p className="text-xs mt-1 text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="flex items-stretch gap-2">
              <Controller
                name="startTime"
                render={({ field, fieldState, formState }) => (
                  <DatePicker
                    showTime
                    onOk={(date: any) => {
                      field.onChange(dayjs(date).toISOString());
                    }}
                    placeholder="Start Time"
                    ref={field.ref}
                    name={field.name}
                    disabled={field.disabled}
                    className="ant-picker-minerva-date"
                    value={field.value ? dayjs(field.value) : undefined}
                  />
                )}
              />
              {!isAllDayValue && (
                <Controller
                  name="endTime"
                  render={({ field, fieldState, formState }) => (
                    <>
                      <DatePicker
                        showTime
                        onOk={(date: any) => {
                          field.onChange(dayjs(date).toISOString());
                        }}
                        placeholder="End Time"
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                        ref={field.ref}
                        name={field.name}
                        disabled={field.disabled}
                        className="ant-picker-minerva-date"
                        value={field.value ? dayjs(field.value) : undefined}
                      />
                      {fieldState.error?.message && (
                        <p className="text-xs mt-1 text-danger-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              )}
            </div>
          </div>

          <Controller
            name="description"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Event Description
                </h4>
                <textarea
                  // disabled={isPending}
                  className="border text-[16px] w-full resize-none flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter the Event Description, links are supported"
                  rows={4}
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {/* <div className="w-full h-[108px] border bg-lightPrimary py-1 px-2 description-editor">
                  <DescriptionEditor />
                </div> */}
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div
            className="flex flex-col"
            style={{
              gridRow: "2 / 4",
              gridColumn: "2",
            }}
          >
            <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
              Image
            </h4>
            <Upload
              name="avatar"
              listType="picture-card"
              className="minerva-event-image-uploader"
              showUploadList={false}
              // beforeUpload={beforeUpload}
              onChange={handleChange("event_image")}
            >
              {getImageUrl("event_image") ? (
                <img
                  src={getImageUrl("event_image")}
                  alt="avatar"
                  className="h-full w-full object-contain"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton()
              )}
            </Upload>
            {formState.errors.event_image && (
              <p className="text-xs mt-1 text-danger-500">
                {formState.errors.event_image.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="venue"
              render={({ field, fieldState, formState }) => (
                <>
                  <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                    Venue
                  </h4>
                  <Radio.Group
                    className="minerva-venue-radio w-full grid grid-cols-2"
                    // onChange={onChange}
                    // value={value}
                    {...field}
                  >
                    <Radio value={"offline"}>Offline</Radio>
                    <Radio value={"online"}>Online</Radio>
                  </Radio.Group>
                </>
              )}
            />
            <div className="w-full mt-3">
              {venueValue === "online" && (
                <Controller
                  name="meetingLink"
                  render={({ field, fieldState, formState }) => (
                    <div className="w-full flex-1 mb-2">
                      <input
                        // disabled={isPending}
                        className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                        placeholder="Link to the meeting"
                        type="text"
                        style={{
                          fontVariationSettings: '"wght" 400,"opsz" 10',
                        }}
                        {...field}
                      />

                      {fieldState.error?.message && (
                        <p className="text-xs mt-1 text-danger-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}
              {venueValue === "offline" && (
                <>
                  <Controller
                    name="venue_name"
                    render={({ field, fieldState, formState }) => (
                      <div className="w-full flex-1 mb-2">
                        <input
                          // disabled={isPending}
                          className="border text-[16px] w-full flex-1 flex-shrink-0 py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                          placeholder="Event Venue Name"
                          type="text"
                          style={{
                            fontVariationSettings: '"wght" 400,"opsz" 10',
                          }}
                          {...field}
                        />
                        {fieldState.error?.message && (
                          <p className="text-xs mt-1 text-danger-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="venue_address"
                    render={({ field, fieldState, formState }) => (
                      <div className="w-full flex-1 mb-2">
                        <input
                          // disabled={isPending}
                          className="border text-[16px] w-full flex-1 flex-shrink-0 py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                          placeholder="Event Venue Address"
                          type="text"
                          style={{
                            fontVariationSettings: '"wght" 400,"opsz" 10',
                          }}
                          {...field}
                        />
                        {fieldState.error?.message && (
                          <p className="text-xs mt-1 text-danger-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="venue_maps_link"
                    render={({ field, fieldState, formState }) => (
                      <div className="w-full flex-1 mb-2">
                        <input
                          // disabled={isPending}
                          className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                          placeholder="Event Venue Maps Link"
                          type="text"
                          style={{
                            fontVariationSettings: '"wght" 400,"opsz" 10',
                          }}
                          {...field}
                        />
                        {fieldState.error?.message && (
                          <p className="text-xs mt-1 text-danger-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="minerva-venue-image-uploader"
                    showUploadList={false}
                    // beforeUpload={beforeUpload}
                    onChange={handleChange("venue_image")}
                  >
                    {getImageUrl("venue_image") ? (
                      <img
                        src={getImageUrl("venue_image")}
                        alt="avatar"
                        className="h-full w-full object-contain"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton("Upload Venue Image")
                    )}
                  </Upload>
                  {formState.errors.venue_image && (
                    <p className="text-xs mt-1 text-danger-500">
                      {formState.errors.venue_image.message}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div>
          <span className="uppercase block text-sm mb-1 font-larkenExtraBold text-black text-opacity-60">
            Organizer Info
          </span>
          <hr />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Controller
            name="organizer_name"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Organizer Name
                </h4>
                <input
                  // disabled={isPending}
                  className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter the name of the organizer"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="organizer_info"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Organizer Info
                </h4>
                <textarea
                  // disabled={isPending}
                  className="border text-[16px] w-full resize-none flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter the Organizer Info"
                  rows={4}
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div
            className="flex flex-col"
            style={{
              gridRow: "1 / 3",
              gridColumn: "2",
            }}
          >
            <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
              Organizer Image
            </h4>
            <Upload
              name="avatar"
              listType="picture-card"
              className="minerva-organizer-image-uploader"
              showUploadList={false}
              // beforeUpload={beforeUpload}
              onChange={handleChange("organizer_image")}
            >
              {getImageUrl("organizer_image") ? (
                <img
                  src={getImageUrl("organizer_image")}
                  alt="avatar"
                  className="h-full w-full object-contain"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton("Upload Organizer Image")
              )}
            </Upload>
            {formState.errors.organizer_image && (
              <p className="text-xs mt-1 text-danger-500">
                {formState.errors.organizer_image.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div>
          <span className="uppercase block text-sm mb-1 font-larkenExtraBold text-black text-opacity-60">
            Contact Info
          </span>
          <hr />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Controller
            name="contact_email"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Contact Email
                </h4>
                <input
                  // disabled={isPending}
                  className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter contact email"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="contact_phone"
            render={({ field, fieldState, formState }) => (
              <div>
                <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
                  Contact Phone
                </h4>
                <input
                  // disabled={isPending}
                  className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                  placeholder="Enter contact phone"
                  type="text"
                  style={{
                    fontVariationSettings: '"wght" 400,"opsz" 10',
                  }}
                  {...field}
                />
                {fieldState.error?.message && (
                  <p className="text-xs mt-1 text-danger-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      <div className="w-full flex justify-end items-center mt-7">
        <Button
          type="submit"
          isDisabled={isPending || isUploading}
          className="font-featureHeadline email_button flex items-center justify-center !bg-appBlue !text-primary"
          // onClick={() => handleSavePost()}
          variant="flat"
          color="primary"
          isLoading={isPending || isUploading}
        >
          <IoIosCreate />
          <span>{event ? "Update" : "Create"} Event</span>
        </Button>
      </div>
    </form>
  );
}
