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
import {
  DocumentIcon,
  EventIcon,
  SignalIcon,
} from "@/components/AuthorPage/AuthorPage";

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
