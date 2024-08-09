import { useCallback, useMemo } from "react";
import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { CustomElement } from "../../../types/slate";
import { Range } from "slate";
import { Text } from "slate";

const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    align: "left",
    children: [
      {
        text: "",
      },
    ],
  },
];
const insertLink = (editor: Editor, url: string) => {
  const { selection } = editor;

  if (selection) {
    const link = {
      type: "link",
      url,
      children: [{ text: url }],
    };

    if (Range.isCollapsed(selection)) {
      Editor.addMark(editor, "link", true);
      Transforms.insertText(editor, url);
      Editor.removeMark(editor, "link");
    } else {
      // @ts-ignore
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  }
};
const isUrl = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  return !!pattern.test(url);
};

const withLinks = (editor: Editor) => {
  const { insertData, isInline, insertText } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text) => {
    // console.log("text - ", text);
    if (isUrl(text)) {
      insertLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    // console.log("insertData | text - ", text);

    if (isUrl(text)) {
      console.log("IsURl - ");
      insertLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

function DescriptionSlateElement(props: any) {
  const { attributes, children, element } = props;

  if (element.type === "link") {
    return (
      <div {...attributes}>
        <span className="underline text-blue-500">{children}</span>
      </div>
    );
  }

  return <div {...attributes}>{children}</div>;
}

export default function DescriptionEditor() {
  const editor = useMemo(
    () => withLinks(withReact(withHistory(createEditor()))),
    []
  );

  const renderElement = useCallback(
    (props: any) => <DescriptionSlateElement {...props} editor={editor} />,
    [editor]
  );

  const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.link) {
      return (
        <span
          {...attributes}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {children}
        </span>
      );
    }

    return <span {...attributes}>{children}</span>;
  };

  return (
    <div
      className="cursor-text w-full h-full overflow-auto"
      onClick={() => {
        ReactEditor.focus(editor);
      }}
    >
      <Slate
        editor={editor}
        initialValue={initialValue}
        onValueChange={(e) => console.log("value - ", e)}
      >
        <Editable
          spellCheck
          autoFocus
          renderElement={renderElement}
          renderLeaf={(props) => <Leaf {...props} />}
        />
      </Slate>
    </div>
  );
}
