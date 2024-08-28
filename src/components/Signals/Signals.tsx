"use client";

import {
  arrowSignalBlue,
  emptyBox,
  twoCirclesBlack,
  twoCirclesWhite,
} from "@/assets";
import Image from "next/image";
import classes from "./Signals.module.css";
import { Signal } from "@/firebase/signal";
import { useQuerySignals } from "@/api/signal";
import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import parse from "html-react-parser";
import BlogPostCode from "../BlogPost/BlogPostCode";
import ScrollableContent from "../shared/ScrollableComponent";
import { BlogImageDefault } from "../shared/BlogImage";
import { Spinner } from "@nextui-org/spinner";
import useInView from "@/hooks/useInView";
import Footer from "../shared/Footer";
import MoreFromMinerva from "../BlogPost/MoreFromMinerva";
import { Button } from "@nextui-org/button";
import useScreenSize from "@/hooks/useScreenSize";
import SlateEditor from "../SlateEditor/SlateEditor";
import { CustomElement } from "../../../types/slate";

function filterAndTrimStrings(arr: any[]) {
  return (
    arr?.map((c: any) => (typeof c === "string" ? c.trim() : "")).join(" ") ??
    ""
  );
}

function SignalComponent({ signal }: { signal: Signal }) {
  console.log("signal - ", signal);
  return (
    <div className={classes.body_block} id={signal.id}>
      <div className={classes.connector}>
        <h3 className={classes.signal_title}>{signal.title}</h3>
        <div className={classes.signal_sources}>
          <div className="flex items-center">
            <div>
              <Image className="w-[14px]" src={arrowSignalBlue} alt="Sources" />
            </div>
            <span className="ml-[8px]">Sources: &nbsp;</span>
          </div>
          <span>{signal.source}</span>
        </div>
        <div className={classes.signal_para}>
          <SlateEditor readonly value={signal.nodes as CustomElement[]} />
        </div>
      </div>
    </div>
  );
}

function Signals(
  {
    signals: _serverSignals,
    startAt,
  }: {
    signals: any;
    startAt: string | string[] | undefined;
  },
  ref: any
) {
  const {
    signals: _clientSignals,
    isFetching,
    isLoading,
    fetchStatus,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    error,
  } = useQuerySignals({ limit: 10, status: "published" });

  console.log("error - ", error);

  const _serverFormedSignals = useMemo(() => {
    return _serverSignals.map(
      (data: any) =>
        new Signal(
          data.title,
          data.nodes,
          data.author,
          data.source,
          data.id,
          data.timestamp
        )
    );
  }, [_serverSignals]);

  const signals = _clientSignals || _serverFormedSignals;
  const hasSignals = signals?.length > 0;

  const { ref: lastItemRef, isInView } = useInView();
  const targetRef = useRef<HTMLDivElement>(null);
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

  useEffect(() => {
    if (!targetRef.current) return;
    const targetEl = targetRef.current;
    const timeout = setTimeout(
      () =>
        targetEl?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      400
    );

    return () => clearTimeout(timeout);
  }, [_serverFormedSignals, isMobileScreen]);

  return (
    <div
      className={
        isTabletScreen
          ? "h-[calc(100vh-220px)]"
          : isMobileScreen
          ? ""
          : "h-[calc(100vh-150px)]"
      }
      style={{
        overflow: isMobileScreen ? "unset" : "auto",
      }}
      ref={ref}
    >
      <div className="w-full max-w-[720px] mx-auto pt-[40px] pb-[80px] mb-2">
        {hasSignals && (
          <>
            <div className={classes.signal_blue_header}>
              <div>
                <Image alt="Signals" src={twoCirclesWhite} />
              </div>
              <h3>MINERVA SIGNALS</h3>
            </div>
            <div className={classes.label}>
              {/* <strong>Minerva Signals:</strong> */}
              {" Global insights on today's biggest stories."}
            </div>
            {/* {hasPreviousPage && (
              <div className={classes.button_holder}>
                <Button
                  className={classes.button}
                  isLoading={isFetchingPreviousPage}
                  onClick={() => {
                    if (!isFetchingPreviousPage) fetchPreviousPage();
                  }}
                >
                  {isFetchingPreviousPage
                    ? "Loading Newer Posts..."
                    : "Load Newer Posts"}
                </Button>
              </div>
            )} */}
            {signals.map((signal: Signal) => (
              <div
                key={signal._id}
                className={signal.id === startAt ? classes.quadrat : ""}
              >
                <div ref={signal.id === startAt ? targetRef : undefined}></div>
                <SignalComponent signal={signal} />
              </div>
            ))}
          </>
        )}
        {!hasSignals && (
          <div className="flex flex-col gap-5 items-center justify-center text-lg py-4 font-featureRegular text-gray-600">
            <Image
              alt="No Signals Found"
              src={emptyBox}
              className="w-[150px]"
            />
            <p>No Signals Found</p>
          </div>
        )}
        {(hasNextPage || isFetching || isLoading) && (
          <div
            ref={lastItemRef}
            className="w-full flex items-center justify-center py-4"
          >
            <Spinner
              classNames={{
                circle1: "blue-border-b",
                circle2: "blue-border-b",
              }}
              color="warning"
              size="lg"
              label="Fetching more signals..."
            />
          </div>
        )}
        {!hasNextPage && !isFetching && !isLoading && (
          <>
            <MoreFromMinerva />
          </>
        )}
      </div>
    </div>
  );
}

export default forwardRef(Signals);
