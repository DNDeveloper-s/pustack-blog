import { useMutateOpenAIGenerate } from "@/api/post";
import EventEmitter from "@/lib/EventEmitter";
import { Button } from "@nextui-org/button";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Descendant, Editor } from "slate";
import {
  extractFirstWordsFromPostNodes,
  extractTextFromEditor,
  getFirstImage,
} from "../SlateEditor/utils/helpers";
import { trimToSentence } from "@/lib/transformers/trimToSentence";
import BlogImage from "../shared/BlogImage";
import { useUser } from "@/context/UserContext";
import { aiShimmer, avatar } from "@/assets";
import AppImage, { noImageUrl } from "../shared/AppImage";
import { FaCheck } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { ConfigProvider, Segmented } from "antd";
import SwipeableViews from "react-swipeable-views";

export type SubTitleVariant = "short" | "medium" | "long" | "very_short";

function BlogWithAuthor({
  size = "lg",
  textContent,
  topic,
  title,
  image,
  zoom,
  variant,
  classNames,
  layout = "vertical",
}: {
  size?: "lg" | "sm" | "md";
  textContent: string;
  topic: string;
  title: string;
  image: string;
  zoom?: number;
  variant: SubTitleVariant;
  classNames?: {
    title?: string;
    content?: string;
  };
  layout?: "horizontal" | "vertical";
}) {
  const [status, setStatus] = useState<"accept" | "edit" | "pending">(
    "pending"
  );
  const { user } = useUser();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === "edit" && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [status]);

  const handleAccept = () => {
    setStatus("accept");
    EventEmitter.emit("accept-variant", {
      text: textAreaRef.current?.value ?? textContent,
      variant: variant,
    });
  };

  const content = (
    <div className="py-3 h-full flex flex-col" style={{ zoom: zoom ?? 1 }}>
      <div className="flex justify-between items-center">
        <div className="flex overflow-hidden">
          <div className="mr-1 lg:mr-2 flex-shrink-0">
            <AppImage
              className="w-[30px] h-[30px] lg:w-[30px] lg:h-[30px]"
              src={user?.image_url ?? avatar.src}
              alt="avatar"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="leading-[120%] text-[15px] w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {user?.name}
            </h3>
            <p
              className={
                "leading-[120%] text-[13px] text-tertiary font-helvetica uppercase "
              }
              style={{
                fontWeight: "300",
                fontVariationSettings: '"wght" 400,"opsz" 10',
              }}
            >
              {topic}
            </p>
          </div>
        </div>
        <div className="flex items-center text-[12px] gap-2 flex-shrink-0">
          {status === "pending" && (
            <>
              <div
                className="flex flex-col items-center p-1 justify-center text-green-500 border rounded bg-lightPrimary border-green-200 cursor-pointer"
                onClick={handleAccept}
              >
                <FaCheck className="text-xs" />
                <p>Accept</p>
              </div>
              <div
                className="flex flex-col items-center p-1 justify-center text-slate-500 border rounded bg-lightPrimary border-slate-200 cursor-pointer"
                onClick={() => setStatus("edit")}
              >
                <MdModeEdit className="text-xs" />
                <p>Edit</p>
              </div>
            </>
          )}
          {status === "accept" && (
            <>
              <div className="flex flex-col items-center p-1 justify-center text-white bg-green-500 border rounded  border-green-200">
                <FaCheck className="text-xs" />
                <p>Accepted</p>
              </div>
              <div
                className="flex flex-col items-center p-1 justify-center text-slate-500 border rounded bg-lightPrimary border-slate-200 cursor-pointer"
                onClick={() => setStatus("edit")}
              >
                <MdModeEdit className="text-xs" />
                <p>Edit</p>
              </div>
            </>
          )}
          {status === "edit" && (
            <>
              <div
                className="flex flex-col items-center p-1 justify-center text-green-500 border rounded bg-lightPrimary border-green-200 cursor-pointer"
                onClick={handleAccept}
              >
                <FaCheck className="text-xs" />
                <p>Accept</p>
              </div>
            </>
          )}
        </div>
      </div>
      <hr className="border-dashed border-[#1f1d1a4d] my-2 md:my-4" />
      <div className={layout === "horizontal" ? "flex gap-[10px]" : ""}>
        <div className="">
          {title && (
            <h2
              className={
                "font-featureHeadline leading-[120%] bg-animation " +
                classNames?.title
              }
              style={{
                fontWeight: "395",
                fontVariationSettings: '"wght" 495,"opsz" 10',
              }}
            >
              {title}
            </h2>
          )}
          {status !== "edit" && (
            <p
              className={"leading-[120%] opacity-80 " + classNames?.content}
              style={{
                paddingTop: size === "sm" ? "8px" : "10px",
              }}
            >
              {textContent}
            </p>
          )}
          {status === "edit" && (
            <textarea
              className={
                "mt-1 w-full leading-[120%] opacity-80  px-2 py-1 bg-lightPrimary border " +
                (size === "sm"
                  ? "text-[13px] lg:text-[15px]"
                  : size === "md"
                  ? "text-[14px] lg:text-[16px]"
                  : "text-[15px] lg:text-[17px]")
              }
              style={{
                paddingTop: size === "sm" ? "8px" : "10px",
              }}
              value={textContent}
              ref={textAreaRef}
              rows={size === "sm" ? 7 : size === "md" ? 5 : 3}
            ></textarea>
          )}
        </div>
        <BlogImage
          imageProps={{ className: "!w-full !object-cover !h-full" }}
          noZoom
          className={
            layout === "horizontal" ? "w-[37%] flex-shrink-0" : "mt-2 "
          }
          src={image}
        />
      </div>
    </div>
  );

  return content;
}

interface SubTitleComponentProps {
  onChange: () => void;
  title: string;
  customTopic: string;
  topic: string;
}
const SubTitleComponentRef = (
  { onChange, title, customTopic, topic }: SubTitleComponentProps,
  ref: any
) => {
  const [subTitleValue, setSubTitleValue] = useState("");
  const [index, setIndex] = useState(0);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);

  const {
    mutate: postGenerateTextVariants,
    data: _variantsData,
    isSuccess,
    isPending,
    error: _error,
  } = useMutateOpenAIGenerate();

  const [variantTabs, setVariantTabs] = useState<
    {
      key: SubTitleVariant;
      title: string;
      is_accepted: boolean;
    }[]
  >([
    {
      key: "very_short",
      title: "Very Short",
      is_accepted: false,
    },
    {
      key: "short",
      title: "Short",
      is_accepted: false,
    },
    {
      key: "medium",
      title: "Medium",
      is_accepted: false,
    },
    {
      key: "long",
      title: "Long",
      is_accepted: false,
    },
  ]);

  useEffect(() => {
    const unsub = EventEmitter.addListener(
      "accept-variant",
      (data: { text: string; variant: SubTitleVariant }) => {
        setVariantTabs((variantTabs) => {
          return variantTabs.map((tab) => {
            if (tab.key === data.variant) {
              return {
                ...tab,
                is_accepted: true,
              };
            }
            return tab;
          });
        });
      }
    );

    return () => {
      unsub.remove();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      EventEmitter.emit("get-slate-value");
    }, 2000);
    const unsub = EventEmitter.addListener(
      "slate-value-change",
      (data: { value: Descendant[]; editor: Editor }) => {
        const extractedTextFromEditor = extractTextFromEditor(data.editor);
        const _extractedImage = getFirstImage(data.value);

        const extractedText = trimToSentence(extractedTextFromEditor, 200);

        setSubTitleValue(extractedText);

        setExtractedImage((c) => {
          if (c) return c;
          return _extractedImage;
        });
      }
    );

    const unsub1 = EventEmitter.addListener(
      "thumbnail-change",
      (data: { url: string }) => {
        setExtractedImage(data.url);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsub.remove();
      unsub1.remove();
    };
  }, []);

  const onChangeIndex = (ind: number) => {
    setIndex(ind);
  };

  return (
    <>
      <div className="ml-1 mb-1 flex items-center gap-2">
        <h4 className="text-[12px] font-helvetica uppercase text-appBlack">
          Post Sub-Text
        </h4>
        <img width={17} height={17} src={aiShimmer.src} alt="" />
      </div>
      <textarea
        // disabled={isPending}
        className="border text-[16px] w-full flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2] placeholder:text-black placeholder:text-opacity-20"
        placeholder="Enter your sub-text here with at least 50 words, and we will automatically generate different variants for you."
        style={{
          fontVariationSettings: '"wght" 400,"opsz" 10',
          borderInlineEnd: 0,
        }}
        ref={ref}
        onChange={(e) => {
          setSubTitleValue(e.target.value);
          onChange();
        }}
        value={subTitleValue}
        rows={6}
      />
      {_error && (
        <div className="text-red-500 text-[12px] mt-1">
          {_error.message}, Please try again!
        </div>
      )}
      {subTitleValue && !isSuccess && (
        <Button
          isDisabled={isPending}
          isLoading={isPending}
          className="mt-2 transition-all before:top-0 before:left-0 before:bg-[linear-gradient(135deg,_rgba(171,71,188,0.7),_rgba(236,64,122,0.7))] before:backdrop-blur-[6px] before:absolute before:w-full before:h-full relative py-1 px-6 overflow-hidden rounded-lg text-white"
          style={{
            animation: "intense-blink-breath 1.5s infinite ease-in-out",
            backgroundImage: `url(/assets/images/colored-elements.webp)`,
            backgroundSize: "cover",
            boxShadow:
              "rgba(171, 71, 188, 0.7) 0px 0px 10px, rgba(236, 64, 122, 0.5) 0px 0px 20px",
          }}
          onClick={() => {
            postGenerateTextVariants({
              subText: subTitleValue,
            });
          }}
        >
          <span className="relative z-10 text-sm mb-[-2px]">
            Generate Sub-Text Variants
          </span>
        </Button>
      )}
      {_variantsData && (
        <div className="mt-5">
          <h4 className="text-[12px] font-helvetica uppercase ml-1 mb-1 text-appBlack">
            Post Sub-Text Variants
          </h4>
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
              options={variantTabs.map((tab) => ({
                label: (
                  <div
                    className={
                      "flex justify-center items-center gap-3 " +
                      (tab.is_accepted ? "text-green-500 " : "")
                    }
                  >
                    <span>{tab.title}</span>
                    {tab.is_accepted && (
                      <span className="ml-1">
                        <FaCheck />
                      </span>
                    )}
                  </div>
                ),
                value: tab.key,
              }))}
              onChange={(value) => {
                console.log(value); // string
                const ind = variantTabs.findIndex((c) => c.key === value);

                setIndex(ind);
                // setMode(value.split(" ")[0].toLowerCase() as any);
              }}
              label="Select a variant"
              style={{
                width: "100%",
              }}
              block
              // className="!bg-lightPrimary"
            />
          </ConfigProvider>
          <SwipeableViews index={index} onChangeIndex={onChangeIndex}>
            <div className="w-full mx-auto max-w-[570px]">
              <BlogWithAuthor
                image={extractedImage ?? noImageUrl}
                textContent={_variantsData?.very_short ?? ""}
                title={title}
                topic={topic === "others" ? customTopic ?? "Others" : topic}
                size="sm"
                variant="very_short"
                classNames={{
                  title: "text-[28px] lg:text-[32px]",
                  content: "text-[16px] lg:text-[18px]",
                }}
              />
            </div>
            <div className="w-full mx-auto max-w-[300px]">
              <BlogWithAuthor
                image={extractedImage ?? noImageUrl}
                textContent={_variantsData?.short ?? ""}
                title={title}
                topic={topic === "others" ? customTopic ?? "Others" : topic}
                size="md"
                variant="short"
                classNames={{
                  title: "text-[16px] lg:text-[18px]",
                  content: "text-[13px] lg:text-[15px]",
                }}
              />
            </div>
            <div className="w-full mx-auto max-w-[460px]">
              <BlogWithAuthor
                image={extractedImage ?? noImageUrl}
                textContent={_variantsData?.medium ?? ""}
                title={title}
                topic={topic === "others" ? customTopic ?? "Others" : topic}
                variant="medium"
                classNames={{
                  title: "text-[16px] lg:text-[18px]",
                  content: "text-[13px] lg:text-[15px]",
                }}
              />
            </div>
            <div className="w-full mx-auto max-w-[700px]">
              <BlogWithAuthor
                image={extractedImage ?? noImageUrl}
                textContent={_variantsData?.long ?? ""}
                title={title}
                topic={topic === "others" ? customTopic ?? "Others" : topic}
                variant="long"
                classNames={{
                  title: "text-[16px] lg:text-[18px]",
                  content: "text-[13px] lg:text-[15px]",
                }}
                layout="horizontal"
              />
            </div>
          </SwipeableViews>
        </div>
      )}
    </>
  );
};

const SubTitleComponent = forwardRef(SubTitleComponentRef);

export default SubTitleComponent;
