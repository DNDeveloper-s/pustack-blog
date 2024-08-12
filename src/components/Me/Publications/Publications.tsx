"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/shared/Footer";
import PostsEntry from "../Posts/PostsEntry";
import SignalsEntry from "../Signals/SignalsEntry";
import { ConfigProvider, Segmented } from "antd";
import { useEffect, useState } from "react";
import useScreenSize from "@/hooks/useScreenSize";
import EventsEntry from "../Events/EventsEntry";

export default function Publications() {
  const [mode, setMode] = useState("posts");
  const { isMobileScreen } = useScreenSize();

  useEffect(() => {
    if (mode !== "posts" && mode !== "signals" && mode !== "events") {
      setMode("posts");
    }
  }, [mode]);

  return (
    <div className="max-w-[1440px] w-screen overflow-auto px-3 mx-auto">
      <Navbar />
      <div className="py-10 min-h-[calc(100vh-150px)]">
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
                    itemActiveBg: "#243bb5",
                    itemColor: "#1f1d1a",
                    itemHoverColor: "#1f1d1a",
                    itemSelectedBg: "#243bb5",
                    itemSelectedColor: "#fff",
                    trackBg: "#fcfae4",
                  },
                },
              }}
            >
              <Segmented<string>
                size={isMobileScreen ? "small" : "large"}
                options={["Posts", "Signals", "Events"]}
                onChange={(value) => {
                  console.log(value); // string
                  setMode(value.toLowerCase());
                }}
                // className="!bg-lightPrimary"
              />
            </ConfigProvider>
          </div>
        </div>
        {mode?.toLowerCase() === "signals" && <SignalsEntry />}
        {mode?.toLowerCase() === "posts" && <PostsEntry />}
        {mode?.toLowerCase() === "events" && <EventsEntry />}
      </div>
      <Footer />
    </div>
  );
}
