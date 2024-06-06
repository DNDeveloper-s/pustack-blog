"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  Key,
  useCallback,
} from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppJoditEditor, Jodit } from "@/lib/jodit/editor";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import InsertImage from "./InsertImage";

interface JoditEditorProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function JoditEditor({ content, setContent }: JoditEditorProps) {
  const editor = useRef<any>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [editorData, setEditorData] = useState("");

  const editorRef = useCallback((node: any) => {
    console.log("node - ", node);
  }, []);

  const handleInsertImageUrl = (url: string) => {
    onClose();
    // editor.current?.focus();
    console.log("editor.current - ", editor.current?.selection, editorRef);
    editor.current?.selection?.insertHTML(`<img src="${url}" alt="image" />`);
  };

  return (
    <div>
      <AppJoditEditor
        value={content}
        config={{
          readonly: false, // all options from https://xdsoft.net/jodit/docs/,
          // placeholder: "Start typings...",
          removeButtons: ["image"],
          toolbar: true,
          controls: {
            font: {
              list: {
                "FeatureFlatHeadline, Times New Roman, Times, serif":
                  "FeatureFlatHeadline",
              },
            },
          },
          buttons: [
            // @ts-ignore
            ...Jodit.defaultOptions.buttons,
            {
              group: "insert",
              name: "insertImage",
              iconURL: "https://pustack-blog.vercel.app/vercel.svg",
              tooltip: "Insert Image",
              exec: async (editor: Jodit) => {
                const url = prompt("Enter the image URL");
                if (url) {
                  editor.selection.insertHTML(
                    `<img src="${url}" alt="image" />`
                  );
                }
              },
            },
            {
              name: "Enter Code",
              tooltip: "Insert Image",
              popup: (editor: Jodit, current: any, self: any, close: any) => {
                const input = editor.create.element(
                  "input",
                  {
                    type: "file",
                    class: "jodit-input",
                  },
                  ""
                );
                const child = editor.create.span("active", "Hello World");
                editor.create.div("active w-[200px]", child);
              },
              // exec: async (edtr: Jodit) => {
              //   editor.current = edtr;
              //   // const url = `https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-04%20at%2011.53.47%E2%80%AFAM.png?alt=media&token=5182d10a-bddb-4c9e-85f8-44481d5edbbc`;
              //   // editor.current.selection.insertHTML(
              //   //   `<img src="${url}" alt="image" />`
              //   // );
              //   onOpen();
              // },
            },
          ],
        }}
        //   tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {}}
      />
      {/* <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          wrapper: "bg-black bg-opacity-50",
          base: "!max-w-[900px] !w-[90vw]",
        }}
      >
        <ModalContent>
          <ModalHeader>Mathematics Formula</ModalHeader>
          <ModalBody>
            <iframe
              src="https://www.imatheq.com/imatheq/com/imatheq/math-equation-editor-latex-mathml.html"
              style={{
                width: "100%",
                height: "80vh",
                maxHeight: "800px",
              }}
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal> */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          wrapper: "bg-black bg-opacity-50",
          // base: "!max-w-[900px] !w-[90vw]",
        }}
      >
        <ModalContent>
          <ModalHeader>Insert Image</ModalHeader>
          <ModalBody>
            <InsertImage handleImageUrl={handleInsertImageUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
