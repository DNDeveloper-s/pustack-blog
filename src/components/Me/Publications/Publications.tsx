"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import PostsEntry from "../Posts/PostsEntry";
import SignalsEntry from "../Signals/SignalsEntry";
import { ConfigProvider, Segmented } from "antd";
import { useEffect, useState } from "react";
import useScreenSize from "@/hooks/useScreenSize";
import EventsEntry from "../Events/EventsEntry";
import { IoChevronBack } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DocumentIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M106 512h300c24.814 0 45-20.186 45-45V150H346c-24.814 0-45-20.186-45-45V0H106C81.186 0 61 20.186 61 45v422c0 24.814 20.186 45 45 45zm60-301h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h180c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15zm0 60h120c8.291 0 15 6.709 15 15s-6.709 15-15 15H166c-8.291 0-15-6.709-15-15s6.709-15 15-15z"
      data-original="#000000"
    />
    <path
      d="M346 120h96.211L331 8.789V105c0 8.276 6.724 15 15 15z"
      data-original="#000000"
    />
  </svg>
);

export const SignalIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22.2}
    fillRule="evenodd"
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 100 101"
    {...props}
  >
    <path
      d="M73.064 31.973a3.92 3.92 0 0 0-3.92-3.919H56.793a3.92 3.92 0 0 0-3.92 3.92v61.753a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM21.191 81.376a3.92 3.92 0 0 0-3.92-3.919L4.92 77.456A3.92 3.92 0 0 0 1 81.376v12.351a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM99 7.272a3.92 3.92 0 0 0-3.92-3.92H82.729a3.92 3.92 0 0 0-3.92 3.92v86.455a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92zM47.127 56.675a3.92 3.92 0 0 0-3.92-3.92H30.856a3.92 3.92 0 0 0-3.92 3.92v37.051a3.92 3.92 0 0 0 3.92 3.921l12.351-.001a3.919 3.919 0 0 0 3.92-3.92z"
      data-original="#000000"
    />
  </svg>
);

export const EventIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={props.width ?? 22}
    height={props.height ?? 22}
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 48 48"
    {...props}
  >
    <rect width={4} height={6} x={11} y={3} data-original="#000000" rx={2} />
    <rect width={4} height={6} x={33} y={3} data-original="#000000" rx={2} />
    <path
      d="M4 18v23a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V18zm12 20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm6-11v-6a4 4 0 0 0-4-4h-1v1c0 2.206-1.794 4-4 4s-4-1.794-4-4V6H17v1c0 2.206-1.794 4-4 4S9 9.206 9 7V6H8a4 4 0 0 0-4 4v6z"
      data-original="#000000"
    />
  </svg>
);

export const contentTabs = [
  { title: "Posts", key: "posts", Icon: DocumentIcon },
  { title: "Signals", key: "signals", Icon: SignalIcon },
  { title: "Events", key: "events", Icon: EventIcon },
];

export default function Publications() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [mode, setMode] = useState("posts");
  const router = useRouter();
  const { isSmallScreen } = useScreenSize();

  useEffect(() => {
    if (searchParams.has("mode")) {
      setMode(searchParams.get("mode") || "posts");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.has("mode")) {
      const _searchParams = new URLSearchParams(searchParams.toString());

      _searchParams.set("mode", "posts");

      router.replace(pathname + `?${_searchParams.toString()}`);
    }
  }, [mode, pathname, router, searchParams]);

  if (isSmallScreen) {
    return (
      <div className="py-2">
        <div className="mb-6">
          <h2 className="text-appBlack text-[22px] md:text-[30px] flex items-center gap-2 font-featureBold">
            <IoChevronBack
              onClick={() => {
                router.back();
              }}
              className="text-2xl cursor-pointer"
            />
            <span className="mb-[-5px]">My Publications</span>
          </h2>
          {/* <div className="flex items-center gap-4">
              <SortByModal handleApply={handleSortApply} />
              <FilterModal filters={filters} handleApply={handleFiltersApply} />
            </div> */}
        </div>
        <div>
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  /* here is your component tokens */
                  itemActiveBg: "#1f1d1a",
                  itemColor: "#1f1d1a",
                  itemHoverColor: "#1f1d1a",
                  itemSelectedBg: "#1f1d1a",
                  itemSelectedColor: "#fff",
                  trackBg: "#fcfae4",
                },
              },
            }}
          >
            <Segmented<string>
              size={"large"}
              options={contentTabs.map((tab) => ({
                label: (
                  <div className={"flex justify-center items-center gap-3"}>
                    <tab.Icon
                      width={18}
                      height={18}
                      fill={tab.key === mode ? "#fff" : "#1f1d1a"}
                    />
                    <span
                      style={{ color: tab.key === mode ? "#fff" : "#1f1d1a" }}
                    >
                      {tab.title}
                    </span>
                  </div>
                ),
                value: tab.key,
              }))}
              onChange={(value) => {
                console.log(value); // string
                // setMode(value.toLowerCase());

                const _searchParams = new URLSearchParams(
                  searchParams.toString()
                );

                _searchParams.set("mode", value.toLowerCase());

                router.push(pathname + `?${_searchParams.toString()}`);
              }}
              style={{
                width: "100%",
              }}
              value={mode}
              // className="!bg-lightPrimary"
            />
          </ConfigProvider>
        </div>
        {mode?.toLowerCase() === "signals" && <SignalsEntry />}
        {mode?.toLowerCase() === "posts" && <PostsEntry />}
        {mode?.toLowerCase() === "events" && <EventsEntry />}
      </div>
    );
  }
  return (
    <div className="py-10">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-appBlack text-[22px] md:text-[30px] font-larkenExtraBold">
          My Publications
        </h2>
        {/* <div className="flex items-center gap-4">
              <SortByModal handleApply={handleSortApply} />
              <FilterModal filters={filters} handleApply={handleFiltersApply} />
            </div> */}
        <div>
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  /* here is your component tokens */
                  itemActiveBg: "#1f1d1a",
                  itemColor: "#1f1d1a",
                  itemHoverColor: "#1f1d1a",
                  itemSelectedBg: "#1f1d1a",
                  itemSelectedColor: "#fff",
                  trackBg: "#fcfae4",
                },
              },
            }}
          >
            <Segmented<string>
              size={"large"}
              options={contentTabs.map((tab) => ({
                label: (
                  <div className={"flex justify-center items-center gap-3"}>
                    <tab.Icon
                      width={18}
                      height={18}
                      fill={tab.key === mode ? "#fff" : "#1f1d1a"}
                    />
                    <span
                      style={{ color: tab.key === mode ? "#fff" : "#1f1d1a" }}
                    >
                      {tab.title}
                    </span>
                  </div>
                ),
                value: tab.key,
              }))}
              onChange={(value) => {
                console.log(value); // string
                // setMode(value.toLowerCase());

                const _searchParams = new URLSearchParams(
                  searchParams.toString()
                );

                _searchParams.set("mode", value.toLowerCase());

                router.push(pathname + `?${_searchParams.toString()}`);
              }}
              value={mode}
              // className="!bg-lightPrimary"
            />
          </ConfigProvider>
        </div>
      </div>
      {mode?.toLowerCase() === "signals" && <SignalsEntry />}
      {mode?.toLowerCase() === "posts" && <PostsEntry />}
      {mode?.toLowerCase() === "events" && <EventsEntry />}
    </div>
  );
}
