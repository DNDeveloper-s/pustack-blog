import { useJoinModal } from "@/context/JoinModalContext";
import { useUser } from "@/context/UserContext";
import {
  signInWithAppleAsync,
  signInWithGoogleAsync,
} from "@/lib/firebase/auth";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { linkedinAuth } from "./LinkedinAuth";
import { Drawer } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import useScreenSize from "@/hooks/useScreenSize";
import useAppleDevice from "@/hooks/useIsAppleDevice";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="25"
    height="25"
    x="0"
    y="0"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g>
      <path
        d="m492.668 211.489-208.84-.01c-9.222 0-16.697 7.474-16.697 16.696v66.715c0 9.22 7.475 16.696 16.696 16.696h117.606c-12.878 33.421-36.914 61.41-67.58 79.194L384 477.589c80.442-46.523 128-128.152 128-219.53 0-13.011-.959-22.312-2.877-32.785-1.458-7.957-8.366-13.785-16.455-13.785z"
        fill="#167EE6"
        data-original="#167ee6"
      ></path>
      <path
        d="M256 411.826c-57.554 0-107.798-31.446-134.783-77.979l-86.806 50.034C78.586 460.443 161.34 512 256 512c46.437 0 90.254-12.503 128-34.292v-.119l-50.147-86.81c-22.938 13.304-49.482 21.047-77.853 21.047z"
        fill="#12B347"
        data-original="#12b347"
      ></path>
      <path
        d="M384 477.708v-.119l-50.147-86.81c-22.938 13.303-49.48 21.047-77.853 21.047V512c46.437 0 90.256-12.503 128-34.292z"
        fill="#0F993E"
        data-original="#0f993e"
      ></path>
      <path
        d="M100.174 256c0-28.369 7.742-54.91 21.043-77.847l-86.806-50.034C12.502 165.746 0 209.444 0 256s12.502 90.254 34.411 127.881l86.806-50.034c-13.301-22.937-21.043-49.478-21.043-77.847z"
        fill="#FFD500"
        data-original="#ffd500"
      ></path>
      <path
        d="M256 100.174c37.531 0 72.005 13.336 98.932 35.519 6.643 5.472 16.298 5.077 22.383-1.008l47.27-47.27c6.904-6.904 6.412-18.205-.963-24.603C378.507 23.673 319.807 0 256 0 161.34 0 78.586 51.557 34.411 128.119l86.806 50.034c26.985-46.533 77.229-77.979 134.783-77.979z"
        fill="#FF4B26"
        data-original="#ff4b26"
      ></path>
      <path
        d="M354.932 135.693c6.643 5.472 16.299 5.077 22.383-1.008l47.27-47.27c6.903-6.904 6.411-18.205-.963-24.603C378.507 23.672 319.807 0 256 0v100.174c37.53 0 72.005 13.336 98.932 35.519z"
        fill="#D93F21"
        data-original="#d93f21"
      ></path>
    </g>
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="25"
    height="25"
    x="0"
    y="0"
    viewBox="0 0 176 176"
    xmlSpace="preserve"
  >
    <g>
      <g data-name="Layer 2">
        <rect
          width="176"
          height="176"
          fill="#0077B5"
          rx="24"
          opacity="1"
          data-original="#0077b5"
        ></rect>
        <g fill="#FFFFFF">
          <path
            d="M63.4 48a15 15 0 1 1-15-15 15 15 0 0 1 15 15zM60 73v66.27a3.71 3.71 0 0 1-3.71 3.73H40.48a3.71 3.71 0 0 1-3.72-3.72V73a3.72 3.72 0 0 1 3.72-3.72h15.81A3.72 3.72 0 0 1 60 73zM142.64 107.5v32.08a3.41 3.41 0 0 1-3.42 3.42h-17a3.41 3.41 0 0 1-3.42-3.42v-31.09c0-4.64 1.36-20.32-12.13-20.32-10.45 0-12.58 10.73-13 15.55v35.86A3.42 3.42 0 0 1 90.3 143H73.88a3.41 3.41 0 0 1-3.41-3.42V72.71a3.41 3.41 0 0 1 3.41-3.42H90.3a3.42 3.42 0 0 1 3.42 3.42v5.78c3.88-5.82 9.63-10.31 21.9-10.31 27.18 0 27.02 25.38 27.02 39.32z"
            fill="#FFFFFF"
            opacity="1"
            data-original="#ffffff"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={25}
    height={25}
    viewBox="0 0 22.773 22.773"
  >
    <path
      d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
      data-original="#000000"
    />
  </svg>
);

interface JoinDrawerProps {
  handleClick: (provider: "google" | "linkedin" | "apple") => () => void;
}

function JoinDrawer(props: JoinDrawerProps) {
  const { open, setOpen } = useJoinModal();
  const isAppleDevice = useAppleDevice();

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      classNames={{
        wrapper: "bg-primary h-screen w-screen",
      }}
      placement="bottom"
      styles={{
        header: {
          background: "#f8f5d7",
          borderBottom: 0,
          padding: "0",
        },
        body: {
          padding: 0,
        },
        wrapper: {
          height: "auto",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          overflow: "hidden",
        },
      }}
      title={
        <div className="w-full flex justify-between items-center px-3 py-3">
          <p className="text-xl font-featureBold">Login with</p>
          <IoIosCloseCircle
            className="text-appBlack text-xl"
            onClick={() => setOpen(false)}
          />
        </div>
      }
      closeIcon={null}
    >
      <div className="flex justify-evenly bg-primary pb-8">
        <div
          className="flex justify-center py-4 flex-col gap-1 items-center cursor-pointer"
          onClick={props.handleClick("google")}
        >
          <button className="w-12 h-12 bg-transparent flex justify-center items-center rounded-full border border-dashed border-[#4f4f4f52]">
            <GoogleIcon />
          </button>
          <p className="text-black font-light">Google</p>
        </div>
        <div
          className="flex justify-center py-4 flex-col gap-1 items-center cursor-pointer"
          onClick={props.handleClick("linkedin")}
        >
          <button className="w-12 h-12 bg-transparent flex justify-center items-center rounded-full border border-dashed border-[#4f4f4f52]">
            <LinkedinIcon />
          </button>
          <p className="text-black font-light">Linkedin</p>
        </div>
        {isAppleDevice && (
          <div
            className="flex justify-center py-4 flex-col gap-1 items-center cursor-pointer"
            onClick={props.handleClick("apple")}
          >
            <button className="w-12 h-12 bg-transparent flex justify-center items-center rounded-full border border-dashed border-[#4f4f4f52]">
              <AppleIcon />
            </button>
            <p className="text-black font-light">Apple</p>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default function JoinModal() {
  const { open, setOpen } = useJoinModal();
  const [loading, setLoading] = useState<
    "google" | "linkedin" | "apple" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { isSmallScreen } = useScreenSize();
  const isAppleDevice = useAppleDevice();

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClick =
    (provider: "google" | "linkedin" | "apple") => async () => {
      try {
        if (loading) return;
        setError(null);
        setLoading(provider);
        if (provider === "google") {
          await signInWithGoogleAsync();
        } else if (provider === "linkedin") {
          await linkedinAuth();
        } else if (provider === "apple") {
          await signInWithAppleAsync();
        }
      } catch (error: any) {
        setLoading(null);
        setError(error.message);
      }
    };

  useEffect(() => {
    if (user?.uid) {
      setLoading(null);
      onClose();
    }
  }, [user?.uid]);

  if (isSmallScreen) return <JoinDrawer handleClick={handleClick} />;

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "md:!max-w-[500px] md:!w-[90vw]",
      }}
      isDismissable={false}
      onClose={onClose}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-lightPrimary no-preflight rounded-[2px]">
        <ModalHeader className="flex justify-center">
          <span className="font-featureBold text-[23px]">Join MINERVA</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col pt-5 pb-8 w-full max-w-[450px] items-center gap-7">
            <Button
              isDisabled={!!loading}
              isLoading={loading === "google"}
              onClick={handleClick("google")}
              className="border border-appBlack !rounded-none bg-transparent w-full max-w-[260px] h-[45px] flex items-center justify-between px-4"
            >
              <GoogleIcon />
              <span className="flex-1 text-center mb-[-4px]">
                Join With Google
              </span>
            </Button>
            <Button
              isDisabled={!!loading}
              isLoading={loading === "linkedin"}
              onClick={handleClick("linkedin")}
              className="border border-appBlack !rounded-none bg-transparent w-full max-w-[260px] h-[45px] flex items-center justify-between px-4"
            >
              <LinkedinIcon />
              <span className="flex-1 text-center mb-[-4px]">
                Join With Linkedin
              </span>
            </Button>

            {isAppleDevice && (
              <Button
                isDisabled={!!loading}
                isLoading={loading === "apple"}
                onClick={handleClick("apple")}
                className="border border-appBlack !rounded-none bg-transparent w-full max-w-[260px] h-[45px] flex items-center justify-between px-4"
              >
                <AppleIcon />
                <span className="flex-1 text-center mb-[-4px]">
                  Join With Apple
                </span>
              </Button>
            )}

            {error && (
              <p className="text-xs mt-4 max-w-[350px] w-full text-center leading-[18px] text-danger-500">
                {error}
              </p>
            )}

            <p className="text-xs mt-4 max-w-[350px] w-full text-center leading-[18px] text-appBlack text-opacity-60">
              Click &quot;Join&quot; to agree to Minerva&apos;s{" "}
              <Link target="_blank" href="https://pustack.com/terms_of_service">
                <u>Terms of Service</u>
              </Link>{" "}
              and acknowledge that Minerva&apos;s{" "}
              <Link target="_blank" href="https://pustack.com/privacy_policy">
                <u>Privacy Policy</u>
              </Link>{" "}
              applies to you.
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
