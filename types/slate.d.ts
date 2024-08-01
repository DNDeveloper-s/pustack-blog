import { Descendant, BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type BlockQuoteElement = {
  type: "block-quote";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type CheckListItemElement = {
  type: "check-list-item";
  checked: boolean;
  dropdown?: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: "editable-void";
  dropdown?: boolean;
  children: EmptyText[];
};

export type HeadingElement = {
  type: "heading-one";
  align?: string;
  children: Descendant[];
  dropdown?: boolean;
};

export type HeadingTwoElement = {
  type: "heading-two";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: "heading-three";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type HeadingFourElement = {
  type: "heading-four";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type HeadingFiveElement = {
  type: "heading-five";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type HeadingSixElement = {
  type: "heading-six";
  align?: string;
  dropdown?: boolean;
  children: Descendant[];
};

export type MathElement = {
  type: "math-block";
  latex: string;
  dropdown?: boolean;
  children: EmptyText[];
  isInnerLevel?: boolean;
};

export type MathContainerElement = {
  type: "math-block-container";
  align?: string;
  children: MathElement[];
};

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ButtonElement = { type: "button"; children: Descendant[] };

export type BadgeElement = { type: "badge"; children: Descendant[] };

export type ListItemElement = { type: "list-item"; children: Descendant[] };

export type ImageElement = {
  type: "image-block";
  src: string;
  width?: number;
  dropdown?: boolean;
  height?: number;
  maxConstraints?: [number, number];
  minConstraints?: [number, number];
  align?: "center" | "left" | "right";
  children: Descendant[];
};

export type ImageCarouselElement = {
  type: "image-carousel";
  images: { src: string; caption: string }[];
  children: EmptyText[];
};

export type MentionElement = {
  type: "mention";
  character: string;
  dropdown?: boolean;
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
  dropdown?: boolean;
  align?: string;
  children: Descendant[];
};

export type TableElement = { type: "table"; children: TableRow[] };

export type TableCellElement = { type: "table-cell"; children: CustomText[] };

export type TableRowElement = { type: "table-row"; children: TableCell[] };

export type TitleElement = { type: "title"; children: Descendant[] };

export type VideoElement = {
  type: "video";
  url: string;
  children: EmptyText[];
};

export type TableCellElement = {
  type: "table-cell";
  backgroundColor?: string;
  children: Descendant[];
};

export type TableRowElement = {
  type: "table-row";
  children: TableCellElement[];
};

export type TableElement = {
  type: "table";
  children: TableRowElement[];
};

export type CodeBlockElement = {
  type: "code-block";
  language: string;
  code: string;
  children: Descendant[];
};

export type CodeLineElement = {
  type: "code-line";
  children: Descendant[];
};

export type ChooseImageElement = {
  type: "choose-image-ui";
  children: EmptyText[];
};

export type HRElement = {
  type: "horizontal-line";
  children: EmptyText[];
};

export type NumberedListElement = {
  type: "numbered-list";
  align?: string;
  children: Descendant[];
};

export type AlphabetListElement = {
  type: "alphabet-list";
  align?: string;
  children: Descendant[];
};

export type SectionHeaderElement = {
  type: "section-header";
  children: Descendant[];
  title: string;
  icon: string;
  id: string;
};

export type EmbedVideoElement = {
  type: "embed-video";
  url: string;
  width: number;
  height: number;
  children: EmptyText[];
};

export type EnterEmbedVideoUrlUIElement = {
  type: "enter-embed-video-url-ui";
  children: EmptyText[];
};

type CustomElement =
  | BlockQuoteElement
  | HRElement
  | BulletedListElement
  | CheckListItemElement
  | SectionHeaderElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | EnterEmbedVideoUrlUIElement
  | ImageElement
  | ImageCarouselElement
  | LinkElement
  | ChooseImageElement
  | ButtonElement
  | BadgeElement
  | AlphabetListElement
  | NumberedListElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | EmbedVideoElement
  | VideoElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | MathElement
  | MathContainerElement
  | CodeBlockElement
  | CodeLineElement;

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

export type EmptyText = {
  text: string;
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
    showDropdownMenu: (props: {
      top: number;
      left: number;
      query?: string;
    }) => void;
    hideDropdownMenu: () => void;
  };

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
    Node: CustomElement | Element | Text;
  }
}
