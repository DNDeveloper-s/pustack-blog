"use client";

import { useDeleteAccount } from "@/api/user";
import { SnackbarContent } from "@/components/AdminEditor/AdminPage";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { NotificationPlacements } from "antd/es/notification/interface";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteAccountModalProps {
  disclosureOptions: ReturnType<typeof useDisclosure>;
}
export default function DeleteAccountModal({
  disclosureOptions,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const { openNotification } = useNotification();
  const [value, setValue] = useState("");
  const {
    mutate: postDeleteUser,
    error,
    isPending,
  } = useDeleteAccount({
    onSuccess: () => {
      disclosureOptions.onClose();
      router.push("/");
      openNotification(
        NotificationPlacements[5],
        {
          message: <SnackbarContent label={"Your account has been deleted."} />,
          closable: true,
          key: "drafts-notification",
          className: "drafts-notification",
        },
        "success"
      );
    },
  });
  const onClose = () => {
    setValue("");
  };

  const handleDelete = () => {
    postDeleteUser();
  };

  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50 !z-[9999]",
        base: "!max-w-[500px] !w-[100vw]",
      }}
      isDismissable={false}
      onClose={onClose}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          <span className="font-featureBold">Delete Account?</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-1 mt-2">
            <label htmlFor="" className="text-[14px] font-helvetica">
              Deleting your account will irreversibly remove all your data.
            </label>
            <label htmlFor="" className="text-[14px] font-helvetica">
              This action is permanent.
            </label>
            <label htmlFor="" className="text-[13px] font-helvetica mt-2">
              <span className="text-gray-500">
                To confirm this, type &quot;DELETE&quot;
              </span>
              <input
                // disabled={isPending}
                className="border text-[13px] w-full mt-1 flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]"
                placeholder="Type here to confirm"
                type="text"
                style={{
                  fontVariationSettings: '"wght" 400,"opsz" 10',
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            {error && (
              <p className="text-sm my-1 text-gray-500 bg-[#fffdf2] p-[4px_8px] rounded">
                Deletion Error:{" "}
                <span className="italic pl-1 text-danger-500 ">
                  {/* This is some weird error */}
                  {error.message}
                </span>
              </p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-4">
            <Button
              //   isDisabled={isPending}
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-transparent border-none font-featureBold text-appBlue text-xs uppercase"
              variant="flat"
              //   onClick={handleLeave}
            >
              {/* <IoIosCreate /> */}
              <span>Cancel</span>
            </Button>
            <Button
              isDisabled={value.trim() !== "DELETE"}
              className="h-9 px-5 rounded flex items-center justify-center gap-2 bg-red-600 font-featureBold  text-primary text-xs uppercase"
              variant="flat"
              color="primary"
              onClick={handleDelete}
              //   onClick={handleConfirm}
              isLoading={isPending}
            >
              {/* <IoIosCreate /> */}
              <span>Delete Account</span>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
