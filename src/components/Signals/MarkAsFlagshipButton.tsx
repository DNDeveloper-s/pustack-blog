import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MdClose } from "react-icons/md";

function MarkAsFlagshipButtonRef(props: { value?: string | null }, ref: any) {
  const [value, setValue] = useState<Dayjs | undefined>(
    dayjs(props.value ?? "").isValid() ? dayjs(props.value) : undefined
  );
  const [selectedValue, setSelectedValue] = useState<Dayjs | undefined>(
    dayjs(props.value ?? "").isValid() ? dayjs(props.value) : undefined
  );
  const [finalValue, setFinalValue] = useState<Dayjs | undefined | null>(
    dayjs(props.value ?? "").isValid() ? dayjs(props.value) : undefined
  );

  const disclosureOptions = useDisclosure();

  useImperativeHandle(
    ref,
    () => ({
      getFlagshipDate: () => finalValue,
    }),
    [finalValue]
  );

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (dayjs(props.value ?? "").isValid() && dayjs(props.value)) {
      setValue(dayjs(props.value));
      setSelectedValue(dayjs(props.value));
      setFinalValue(dayjs(props.value));
    }
  }, [props.value]);

  return (
    <>
      {!finalValue ? (
        <Button
          isDisabled={false}
          className="font-featureHeadline email_button flex items-center justify-center"
          onClick={() => {
            if (!finalValue) disclosureOptions.onOpen();
          }}
          variant="flat"
          color="primary"
          // isLoading={isPending}
          isLoading={false}
        >
          Mark As Flagship
        </Button>
      ) : (
        <div className="font-featureRegular !cursor-default email_button text-[12px] gap-2 flex items-center justify-center">
          <span>
            <span>Flagship:</span>{" "}
            <span>{finalValue.format("YYYY-MM-DD")}</span>
          </span>
          <MdClose
            className="cursor-pointer text-base text-danger-400"
            onClick={() => setFinalValue(undefined)}
          />
        </div>
      )}
      <Modal
        isOpen={disclosureOptions.isOpen}
        onOpenChange={disclosureOptions.onOpenChange}
        classNames={{
          wrapper: "bg-black bg-opacity-50",
          base: "!max-w-[800px] !w-[90vw]",
        }}
        isDismissable={false}
      >
        <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
          <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
            <span className="font-featureBold">Select Flagship Date</span>
          </ModalHeader>
          <ModalBody>
            <Calendar
              value={value}
              onSelect={onSelect}
              onPanelChange={onPanelChange}
              fullscreen={false}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center gap-4">
              <Button
                className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-lightPrimary font-featureBold text-appBlue text-xs uppercase"
                onClick={() => {
                  disclosureOptions.onClose();
                }}
                variant="flat"
                color="primary"
              >
                {/* <IoIosCreate /> */}
                <span>Cancel</span>
              </Button>
              <Button
                // isDisabled={isPending}
                className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-appBlue font-featureBold  text-primary text-xs uppercase"
                onClick={() => {
                  // if (isPending) return;
                  // handleSchedulePost(scheduledTime);
                  disclosureOptions.onClose();
                  setFinalValue(value);
                }}
                variant="flat"
                color="primary"
                // isLoading={isPending}
              >
                {/* <IoIosCreate /> */}
                <span>Save</span>
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const MarkAsFlagshipButton = forwardRef(MarkAsFlagshipButtonRef);

export default MarkAsFlagshipButton;
