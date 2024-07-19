import { Descendant, BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type BlockQuoteElement = {
  type: "block-quote";
  align?: string;
  children: Descendant[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  align?: string;
  children: Descendant[];
};

export type CheckListItemElement = {
  type: "check-list-item";
  checked: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: "editable-void";
  children: EmptyText[];
};

export type HeadingElement = {
  type: "heading";
  align?: string;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: "heading-two";
  align?: string;
  children: Descendant[];
};

export type MathElement = {
  type: "math-block";
  latex: string;
  children: EmptyText[];
};

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ButtonElement = { type: "button"; children: Descendant[] };

export type BadgeElement = { type: "badge"; children: Descendant[] };

export type ListItemElement = { type: "list-item"; children: Descendant[] };

export type ImageElement = {
  type: "image-block";
  src: string;
  width?: number;
  height?: number;
  maxConstraints?: [number, number];
  minConstraints?: [number, number];
  align?: "center" | "left" | "right";
  children: Descendant[];
};

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
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
  | EnterEmbedVideoUrlUIElement
  | ImageElement
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
  | MathElement
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
