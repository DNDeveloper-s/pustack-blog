import { Post } from "@/firebase/post-v2";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

interface PostScheduleModalProps {
  disclosureOptions: ReturnType<typeof useDisclosure>;
  handleSchedulePost: (scheduledTime: Dayjs) => void;
  handlePostNow: () => void;
  isPending?: boolean;
  post: Post;
}
export default function PostScheduleModal({
  disclosureOptions,
  handleSchedulePost,
  handlePostNow,
  isPending,
  post,
}: PostScheduleModalProps) {
  const [scheduledTime, setScheduledTime] = useState<Dayjs>(
    dayjs().add(1, "hour")
  );

  useEffect(() => {
    if (post?.scheduledTime) {
      setScheduledTime(dayjs(post.scheduledTime));
    }
  }, [post]);

  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[500px] !w-[90vw]",
      }}
      isDismissable={false}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          <span className="font-featureBold">Schedule Post</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-1 mt-2">
            <label htmlFor="" className="text-[13px] ml-1 font-helvetica">
              Publish Date:
            </label>
            <DatePicker
              value={scheduledTime}
              onPickerValueChange={(value) => {
                setScheduledTime(value);
              }}
              format={"dddd, MMMM D, YYYY [at] hh:mm A | Z"}
              className="!h-[40px] !w-full"
              showTime
              variant="filled"
              popupClassName="schedule-date-picker"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-4">
            <Button
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-lightPrimary font-featureBold text-appBlue text-xs uppercase"
              onClick={() => {
                if (isPending) return;
                disclosureOptions.onClose();
              }}
              variant="flat"
              color="primary"
            >
              {/* <IoIosCreate /> */}
              <span>Cancel</span>
            </Button>
            <Button
              isDisabled={isPending}
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-appBlue font-featureBold  text-primary text-xs uppercase"
              onClick={() => {
                if (isPending) return;
                handleSchedulePost(scheduledTime);
              }}
              variant="flat"
              color="primary"
              isLoading={isPending}
            >
              {/* <IoIosCreate /> */}
              <span>
                {post?.scheduledTime ? "Update Schedule" : "Create Schedule"}
              </span>
            </Button>
            {post.scheduledTime && (
              <Button
                isDisabled={isPending}
                className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-appBlue font-featureBold  text-primary text-xs uppercase"
                onClick={() => {
                  if (isPending) return;
                  handlePostNow();
                }}
                variant="flat"
                color="primary"
                isLoading={isPending}
              >
                {/* <IoIosCreate /> */}
                <span>Post Now</span>
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
