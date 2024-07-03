import useRenderHtml from "@/hooks/useRenderHtml";
import { Section } from "./Section";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { MdEdit } from "react-icons/md";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import useScroller from "@/hooks/useScroller";
import styles from "@/components/shared/ScrollableComponent.module.css";

interface SectionPreviewProps {
  section: Section;
  handleViewMode: (viewMode: boolean) => void;
}
export default function SectionPreview({
  section,
  handleViewMode,
}: SectionPreviewProps) {
  const elements = useRenderHtml(section.content, true);

  const { scrollRef, hasScrollBottom, hasScrollTop } = useScroller();

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 cursor-pointer flex items-center justify-center gap-3 z-[5]">
        <button
          onClick={() => handleViewMode(false)}
          className="text-sm rounded bg-appBlue text-white px-2 py-1 shadow-sm flex gap-1 justify-center items-center"
        >
          <MdEdit />
          <span
            style={{
              marginBottom: "-2px",
              marginRight: "2px",
            }}
          >
            Edit
          </span>
        </button>
      </div>
      <div className={styles.wrapper + " my-5"}>
        <div
          className={`${styles.shadow} ${hasScrollTop ? styles.visible : ""} ${
            styles.top
          }`}
        />
        <div
          className={`${styles.shadow} ${
            hasScrollBottom ? styles.visible : ""
          } ${styles.bottom}`}
        />
        <div
          className="blog-post-container relative max-h-[250px] overflow-auto p-[15px] bg-lightPrimary"
          style={{ border: "1px dashed #1f1f1f1d" }}
          ref={scrollRef}
        >
          {/* <div className="styles_divider"></div> */}
          <div className="styles_title">
            <h2>
              <span className="inline-flex mr-2">
                <img
                  style={{ height: "16px", width: "auto", display: "inline" }}
                  src={section.icon}
                  alt="Icon"
                />
              </span>
              {section.title}
            </h2>
          </div>
          <div className="styles_text">
            <MathJaxContext>
              <MathJax>{elements}</MathJax>
            </MathJaxContext>
          </div>
        </div>
      </div>
    </div>
  );
}
