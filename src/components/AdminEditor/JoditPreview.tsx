import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { createElement, useEffect, useState } from "react";
import parse from "html-react-parser";
import BlogPostCode from "../BlogPost/BlogPostCode";
import ScrollableContent from "../shared/ScrollableComponent";
import { BlogImageDefault } from "../shared/BlogImage";
import { filterAndTrimStrings } from "../BlogPost/BlogPost";
import { Section } from "./Sections/Section";
import BlogPostSection from "../BlogPost/v2/BlogPostSection";

export default function JoditPreview({
  disclosureOptions,
  sections,
}: {
  disclosureOptions: ReturnType<typeof useDisclosure>;
  sections?: Section[];
}) {
  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50",
        base: "!max-w-[900px] !w-[90vw]",
      }}
    >
      <ModalContent className="h-auto min-h-[400px] max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          Preview
        </ModalHeader>
        <ModalBody>
          {sections?.map((section, index) => (
            <BlogPostSection
              className="blog-post-container relative mb-2 py-2"
              key={section.id}
              section={section}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
