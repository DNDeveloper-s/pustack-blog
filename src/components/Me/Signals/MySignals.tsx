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
import {
  useDeleteSignal,
  usePublishSignal,
  useQuerySignals,
  useUnPublishSignal,
} from "@/api/signal";
import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import parse from "html-react-parser";
import BlogPostCode from "../../BlogPost/BlogPostCode";
import ScrollableContent from "../../shared/ScrollableComponent";
import { BlogImageDefault } from "../../shared/BlogImage";
import { Spinner } from "@nextui-org/spinner";
import useInView from "@/hooks/useInView";
import Footer from "../../shared/Footer";
import MoreFromMinerva from "../../BlogPost/MoreFromMinerva";
import { Button } from "@nextui-org/button";
import useScreenSize from "@/hooks/useScreenSize";
import SlateEditor from "../../SlateEditor/SlateEditor";
import { CustomElement } from "../../../../types/slate";
import { useUser } from "@/context/UserContext";
import AppImage, { noImageUrl } from "@/components/shared/AppImage";
import { FaShare, FaStar } from "react-icons/fa6";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {
  getFirstExistingText,
  getFirstImage,
} from "@/components/SlateEditor/utils/helpers";
import { colorScheme } from "../Posts/PostItemDesktop";
import { Tooltip } from "antd";
import { MdDelete, MdModeEdit, MdPublish, MdUnpublished } from "react-icons/md";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { PostActionModalBase } from "@/components/BlogPost/v2/BlogPost";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function filterAndTrimStrings(arr: any[]) {
  return (
    arr?.map((c: any) => (typeof c === "string" ? c.trim() : "")).join(" ") ??
    ""
  );
}

function DeleteSignalModal({ signal }: { signal?: Signal }, ref: any) {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    handleChangeOpen: (open: boolean) => {
      console.log("open - ", open);
      if (open) onOpen();
      else onClose();
    },
  }));

  const {
    mutate: postDeleteSignal,
    isPending,
    isSuccess,
    error,
  } = useDeleteSignal({
    onSuccess(data, variables, context) {
      onClose();
      // @ts-ignore
      // window.location = "/me/signals";
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "!bg-primary",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Post
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete post &quot;
                <strong>{signal?.title}</strong>&quot;
              </p>
              {error && (
                <p className="text-sm my-1 text-gray-500 bg-[#fffdf2] p-[4px_8px] rounded">
                  Deletion Error:{" "}
                  <span className="italic pl-1 text-danger-500 ">
                    {error.message}
                  </span>
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  !!signal?.id && postDeleteSignal(signal.id);
                }}
                isLoading={isPending}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

const DeleteSignalModalRef = forwardRef(DeleteSignalModal);

export function SavedPostItemV2({ signal }: { signal: Signal }) {
  const [removed, setRemoved] = useState(false);

  const deleteModalRef = useRef<any>();

  const router = useRouter();
  const disclosureOptionsUnPublish = useDisclosure();
  const disclosureOptionsPublish = useDisclosure();

  const {
    mutate: postUnpublishSignal,
    isPending,
    error: unpublishError,
  } = useUnPublishSignal({
    onSuccess: () => {
      disclosureOptionsUnPublish.onClose();
    },
  });
  const {
    mutate: postPublishSignal,
    isPending: isPublishPending,
    error: publishError,
  } = usePublishSignal({
    onSuccess: () => {
      disclosureOptionsPublish.onClose();
    },
  });

  const handleRemove = () => {
    setRemoved(true);
  };

  const handleEdit = () => {
    router.push("/signals/create?signal_id=" + signal.id);
  };

  const isReadyToPublish =
    signal.status === "draft" || signal.status === "unpublished";

  return (
    <div
      className="font-featureRegular overflow-hidden"
      style={{
        maxHeight: removed ? "0px" : "450px",
        opacity: removed ? 0 : 1,
        transition: "opacity 300ms, max-height 300ms 300ms",
      }}
    >
      <div className={classes.connector}>
        {/* Author */}
        {/* <div className="flex items-center gap-3 mb-[16px] mt-[32px]">
          <div className="w-[20px] h-[20px]">
            <AppImage
              alt="sd"
              src={signal.author?.photoURL ?? noImageUrl}
              className="w-full h-full object-cover rounded-full"
              width={20}
              height={20}
            />
          </div>
          <div>
            <span>{signal.author.name}</span>
          </div>
        </div> */}
        {/* Post Content */}
        <div className="flex">
          {/* Post Text Content */}
          <div className="flex-1">
            <h2 className="text-[24px] mb-1 leading-[30px] line-clamp-3 font-bold font-featureBold">
              {signal.title}
            </h2>
            <div className={classes.signal_sources}>
              <div className="flex items-center">
                <div>
                  <Image
                    className="w-[14px]"
                    src={arrowSignalBlue}
                    alt="Sources"
                  />
                </div>
                <span className="ml-[8px]">Sources: &nbsp;</span>
              </div>
              <span>{signal.source}</span>
            </div>
            <div className="pt-[8px]">
              <p className="max-h-[40px] leading-[20px] line-clamp-2 text-[16px] text-[#6B6B6B] font-normal">
                {getFirstExistingText((signal.nodes as CustomElement[]) ?? [])}
              </p>
            </div>
            <div className="pt-[10px] flex items-center justify-between h-[48px]">
              <div className="flex items-center gap-3 text-xs text-appBlack">
                {/* <span className="flex items-center gap-1">
                  <FaStar className="text-[#d9c503] mb-0.5" />{" "}
                  <span>5 min read</span>
                </span> */}
                <span
                  className="flex-shrink-0 inline-block py-0.5 px-2 font-helvetica uppercase rounded text-[10px] text-white items-center"
                  style={{
                    backgroundColor:
                      colorScheme[signal.status]?.bg ?? "#FFA500",
                    fontVariationSettings: `'wght' 700`,
                  }}
                >
                  {signal.status}
                </span>
                {/* <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="uppercase">{signal.source}</span> */}
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span>2d ago</span>
                {signal.flagshipDate && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <span>
                      Flagged: {dayjs(signal.flagshipDate).format("DD-MM-YYYY")}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 text-base text-appBlack text-opacity-60">
                <span className="cursor-pointer" onClick={handleEdit}>
                  <MdModeEdit />
                </span>
                <Tooltip title={isReadyToPublish ? "Publish" : "Unpublish"}>
                  <span
                    className={
                      "flex items-center gap-1 cursor-pointer " +
                      (isReadyToPublish
                        ? " text-green-500 hover:text-green-700 text-lg"
                        : " text-danger-500 hover:text-danger-700")
                    }
                    onClick={() => {
                      isReadyToPublish
                        ? disclosureOptionsPublish.onOpen()
                        : disclosureOptionsUnPublish.onOpen();
                    }}
                  >
                    {isReadyToPublish ? <MdPublish /> : <MdUnpublished />}
                  </span>
                </Tooltip>
                <span
                  className="cursor-pointer text-danger-500"
                  onClick={() => {
                    deleteModalRef.current?.handleChangeOpen(true);
                  }}
                >
                  <MdDelete />
                </span>
              </div>
            </div>
          </div>
          {/* Post Image */}
          <div className="ml-[50px] h-[107px] w-[160px] ">
            {getFirstImage(signal.nodes ?? []) && (
              <AppImage
                alt="sd"
                src={getFirstImage(signal.nodes ?? []) ?? noImageUrl}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-[4px] bg-gray-400"
              />
            )}
          </div>
        </div>
        <hr className="border-none mt-[20px]" />
        <PostActionModalBase
          disclosureOptions={disclosureOptionsUnPublish}
          isLoading={isPending}
          onConfirm={() => {
            signal.id && postUnpublishSignal(signal.id);
          }}
          error={unpublishError}
          title={"Unpublish Signal"}
          content={
            <p>
              Are you sure you want to unpublish the signal &quot;
              <strong>{signal?.title}</strong>&quot;
            </p>
          }
          cancelButton={"Cancel"}
          confirmButton={"Unpublish"}
        />
        <PostActionModalBase
          disclosureOptions={disclosureOptionsPublish}
          isLoading={isPublishPending}
          onConfirm={() => {
            signal.id && postPublishSignal(signal.id);
          }}
          error={publishError}
          // post={post}
          title={"Publish Signal"}
          content={
            <p>
              Are you sure you want to publish the signal &quot;
              <strong>{signal?.title}</strong>&quot;
            </p>
          }
          cancelButton={"Cancel"}
          confirmButton={"Publish"}
        />
        <DeleteSignalModalRef signal={signal as Signal} ref={deleteModalRef} />
      </div>
    </div>
  );
}

function SignalComponent({ signal }: { signal: Signal }) {
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

function MySignals(props: any, ref: any) {
  const { user } = useUser();
  const {
    signals,
    isFetching,
    isFetched,
    isLoading,
    fetchStatus,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    error,
  } = useQuerySignals({ limit: 10, userId: user?.uid, enabled: !!user?.uid });

  console.log("error - ", error);

  const hasSignals = signals?.length > 0;

  const { ref: lastItemRef, isInView } = useInView();
  const { isMobileScreen, isTabletScreen } = useScreenSize();

  useEffect(() => {
    if (!isFetching && !isFetchingNextPage && isInView) fetchNextPage();
  }, [fetchNextPage, isFetching, isFetchingNextPage, isInView]);

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
            <div
              className={
                classes.signal_blue_header +
                " " +
                classes.start_line +
                " " +
                "mb-[50px]"
              }
            >
              <div>
                <Image alt="Signals" src={twoCirclesWhite} />
              </div>
              <h3>MY SIGNALS</h3>
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
              <div key={signal._id}>
                <SavedPostItemV2 signal={signal} />
              </div>
            ))}
          </>
        )}
        {!hasSignals && isFetched && !isLoading && (
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
      </div>
    </div>
  );
}

export default forwardRef(MySignals);
