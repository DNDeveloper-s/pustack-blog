"use client";

// import { useCreateLog } from "@/api/util";
// import Logo from "@/components/Logo";
// import useIsProduction from "@/hooks/useIsProduction";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
// import errorAnimJson from "@/assets/lottie/error_anim.json";
// import Lottie from "lottie-re";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/button";
import Logo from "./Logo";
import Footer from "./Footer";
import Navbar from "../Navbar/Navbar";
import { TbCaretDown } from "react-icons/tb";

interface ErrorComponentProps {
  error: Error;
  reset: () => void;
}

function formatErrorMessage(message: string) {
  return `ClientError: - ${message ?? "Something went wrong"}`;
}

export const ErrorMasterComponent = (props: ErrorComponentProps) => {
  const [expand, setExpand] = useState(false);
  // const isProduction = useIsProduction();
  // const { mutate: postCreateLog } = useCreateLog();

  // useEffect(() => {
  //   console.log("props.error - ", props.error);
  //   const logData = {
  //     userAgent: window.navigator.userAgent,
  //     origin: window.location.origin,
  //     error: {
  //       stack: props.error.stack,
  //       message: props.error.message,
  //       name: props.error.name,
  //     },
  //     href: window.location.href,
  //     userAgentData: window.navigator.userAgentData,
  //     vendorSub: navigator.vendorSub,
  //     vendor: navigator.vendor,
  //     platform: navigator.platform,
  //     deviceMemory: navigator.deviceMemory,
  //   };

  //   const logObject = {
  //     type: "error",
  //     data: logData,
  //     message: "ClientError",
  //     route: window.location.href,
  //   };
  //   postCreateLog(logObject);
  // }, [props.error, postCreateLog]);

  return (
    <div className="w-screen h-screen flex flex-col max-w-[1440px] px-3 mx-auto">
      <Navbar />
      <div className="w-full py-20 mx-auto flex-1 max-w-[1440px] flex flex-col gap-4 justify-center items-center">
        {/* <div>
          <Lottie
            className={"w-48 h-48"}
            animationData={errorAnimJson}
            loop={true}
          />
        </div> */}
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="font-extrabold text-[50px]">Oops!</h1>
          <p className="font-medium text-[40px]">Something went wrong</p>
          <div className="w-[90vw] max-w-[750px] rounded overflow-hidden">
            <div
              className="text-danger text-base font-bold cursor-pointer flex items-center bg-[#ddd8ad] py-3 px-5 justify-between"
              onClick={() => setExpand((c) => !c)}
            >
              <span>{formatErrorMessage(props.error.message)}</span>
              <TbCaretDown />
            </div>
            <div
              className="overflow-hidden transition-all"
              style={{ maxHeight: expand ? "500px" : "0" }}
            >
              <pre className="bg-[#d0cb9f] overflow-auto py-3 px-5 text-appBlack text-sm">
                {props.error.stack}
              </pre>
            </div>
          </div>

          <p className="text-[20px] mt-1">
            Don&apos;t worry, our team is here to help
          </p>
          <Link className="text-appBlue cursor-pointer" href="/">
            Go to Home Page
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function ErrorComponent(props: ErrorComponentProps) {
  // const isProduction = useIsProduction();

  return (
    <div className="flex justify-center items-center my-1">
      <p className="text-danger text-sm font-bold">
        {formatErrorMessage(props.error.message)}
      </p>
    </div>
  );
}
