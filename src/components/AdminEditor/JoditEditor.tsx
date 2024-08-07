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
import { Irish_Grover } from "next/font/google";
import { handleUpload } from "@/lib/firebase/upload";
import hljs from "highlight.js";

interface JoditEditorProps {
  content: string;
  setContent: (str: string) => void;
  updateLiveContent: (content: string) => void;
}

export default function JoditEditor({
  content,
  setContent,
  updateLiveContent,
}: JoditEditorProps) {
  const editor = useRef<any>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  // const [editorData, setEditorData] = useState("");

  const handleInsertImageUrl = (url: string) => {
    onClose();
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
          extraPlugins: ["pasteCode"],
          className: "no-preflight jodit-table",
          // @ts-ignore
          pasteCode: {
            globalHighlightLib: true,
            insertTemplate: (jodit: any, language: any, value: any) =>
              `<pre><code class="hljs language-${language}">${Jodit.modules.Helpers.htmlspecialchars(
                value
              )}</code></pre>`,
            highlightLib: {
              js: [
                "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js",
              ],

              isLangLoaded(lang: any) {
                if (lang === "html") {
                  return true;
                }
                return Boolean(hljs.listLanguages()[lang]);
              },

              langUrl: (lang: any) =>
                `//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/languages/${lang}.min.js`,
              css: [
                "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css",
              ],

              highlight: (code: any, language: any) => {
                return hljs.highlight(code, { language: language }).value;
              },
            },
          },
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
              name: "Insert Image",
              icon: "image",
              tooltip: "Insert Image",
              group: "insert",
              popup: (
                editor: Jodit,
                current: any,
                close: any,
                _button: any
              ) => {
                const para1 = editor.create.element(
                  "p",
                  { class: "font-bold" },
                  "Drop Image"
                );
                const para2 = editor.create.element(
                  "p",
                  {},
                  "or click to upload"
                );
                const textAreaContainer = editor.create.element(
                  "div",
                  {
                    class:
                      "pointer-events-none cursor-pointer text-center w-[150px] py-4 px-2",
                  },
                  [para1, para2]
                );
                const input = editor.create.element(
                  "input",
                  {
                    type: "file",
                    accept: "image/*",
                    class:
                      "cursor-pointer w-full top-0 left-0 h-full opacity-0",
                    style: "position: absolute;",
                  },
                  ""
                );
                const inputContainer = editor.create.div(
                  "cursor-pointer relative flex items-center justify-center border border-dashed",
                  [input, textAreaContainer]
                );

                const hr = editor.create.element("hr", {
                  class: "my-2 border-dashed border-gray-400",
                });

                const urlInput = editor.create.element(
                  "input",
                  {
                    class:
                      "border text-[13px] flex-1 flex-shrink py-1 px-2 bg-lightPrimary focus:outline-appBlack focus:outline-offset-[-2]",
                    placeholder: "Insert Image URL",
                    type: "text",
                    style:
                      'fontVariationSettings: "wght" 400,"opsz" 10; borderInlineEnd: 0;',
                  },
                  ""
                );

                const urlButton = editor.create.element(
                  "button",
                  {
                    class:
                      "h-7 px-5 ml-2 rounded bg-appBlue text-primary text-xs font-featureRegular",
                    style:
                      "border: none; letter-spacing: 1px; cursor: pointer;",
                  },
                  "Insert"
                );

                urlButton.addEventListener("click", async () => {
                  const response = await fetch(
                    `/api/fetch-image?imageUrl=${encodeURIComponent(
                      urlInput.value
                    )}&original=true`
                  );
                  const blob = await response.blob();
                  const filename = `image_${Date.now()}.${
                    blob.type.split("/")[1]
                  }`;
                  const file = new File([blob], filename, {
                    type: blob.type,
                  });

                  handleUpload(file, {
                    setIsPending: (value: boolean) => {
                      if (value) {
                        urlButton.innerHTML = "Uploading...";
                      }
                    },
                    setProgress: (value: number) => {
                      urlButton.innerHTML = `Uploading ${value.toFixed(2)}%`;
                    },
                    handleComplete: (url: string) => {
                      urlButton.innerHTML = "Insert";
                      editor.selection.insertHTML(
                        `<img class="blog-image" src="${url}" alt="image" />`
                      );
                      close();
                    },
                  });

                  // editor.selection.insertHTML(
                  //   `<img class="blog-image" src="${urlInput.value}" alt="image" />`
                  // );
                  // close();
                });

                textAreaContainer.addEventListener("drop", (e) => {
                  e.preventDefault();
                  // @ts-ignore
                  const file = e.dataTransfer.files[0];
                  handleUpload(file, {
                    setIsPending: (value: boolean) => {
                      if (value) {
                        textAreaContainer.innerHTML = "Uploading...";
                      }
                    },
                    setProgress: (value: number) => {
                      textAreaContainer.innerHTML = `Uploading ${value.toFixed(
                        2
                      )}%`;
                    },
                    handleComplete: (url: string) => {
                      textAreaContainer.innerHTML = "";
                      textAreaContainer.append(para1, para2);
                      editor.selection.insertHTML(
                        `<img class="blog-image" src="${url}" alt="image" />`
                      );
                      close();
                    },
                  });
                });

                const wrapper = editor.create.div("relative active w-[200px]", [
                  inputContainer,
                  hr,
                  urlInput,
                  urlButton,
                ]);

                input.addEventListener("change", (e) => {
                  // @ts-ignore
                  const file = e.target?.files[0];
                  input.disabled = true;
                  handleUpload(file, {
                    setIsPending: (value: boolean) => {
                      if (value) {
                        textAreaContainer.innerHTML = "Uploading...";
                      }
                    },
                    setProgress: (value: number) => {
                      textAreaContainer.innerHTML = `Uploading ${value.toFixed(
                        2
                      )}%`;
                    },
                    handleComplete: (url: string) => {
                      textAreaContainer.innerHTML = "";
                      textAreaContainer.append(para1, para2);
                      input.disabled = false;
                      editor.selection.insertHTML(
                        `<img class="blog-image" src="${url}" alt="image" />`
                      );
                      close();
                    },
                  });
                });

                return wrapper;
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
            // {
            //   name: "Insert Section",
            //   tooltip: "Insert Section",
            //   group: "insert",
            //   exec: async (edtr: Jodit) => {
            //     console.log("edtr.places - ", edtr.editor.childNodes[0]);
            //     // @ts-ignore
            //     edtr.selection.setCursorAfter(
            //       edtr.editor.childNodes[edtr.editor.childNodes.length - 1]
            //     );
            //     // onOpen();
            //     edtr.selection.insertHTML(
            //       `<section class="">
            //         <div class="styles_divider"></div>
            //         <div class="styles_title">
            //           <h2>Title</h2>
            //         </div>
            //         <div class="styles_text">
            //           <p>Text</p>
            //         </div>
            //       </section>`
            //     );

            //     // edtr.selection.wrapInTag("spam");
            //   },
            // },
            // {
            //   name: "Insert Icon",
            //   // iconURL:
            //   // "https://pustack-blog.vercel.app/assets/images/selection.png",
            //   tooltip: "Insert Icon",
            //   group: "insert",
            //   popup: (
            //     editor: Jodit,
            //     current: any,
            //     close: any,
            //     _button: any
            //   ) => {
            //     const imageNames = [
            //       "youtube",
            //       "whatsapp",
            //       "Twitter",
            //       "reddit",
            //       "problem",
            //       "network",
            //       "maps",
            //       "linkedin",
            //       "ladder",
            //       "label",
            //       "handshake",
            //       "google",
            //       "github",
            //       "function",
            //       "formula",
            //       "discussion",
            //       "chemical",
            //       "chemical-bond",
            //       "bulb",
            //       "broken-bulb",
            //     ];

            //     const imageUrls = imageNames.map((name) => {
            //       return `https://pustack-blog.vercel.app/assets/images/svgs/${name}.svg`;
            //     });

            //     const pngImageNames = [
            //       "furtherreading",
            //       "github",
            //       "google-maps",
            //       "google",
            //       "link",
            //       "linkedin",
            //       "quiz",
            //       "reporterstake",
            //       "selection",
            //       "social",
            //       "thenews",
            //       "viewfrom",
            //       "youtube",
            //     ];

            //     const pngImageUrls = pngImageNames.map((name) => {
            //       return `https://pustack-blog.vercel.app/assets/images/${name}.png`;
            //     });

            //     const images = [...imageUrls, ...pngImageUrls].map((url) => {
            //       const image = editor.create.element("img", {
            //         src: url,
            //         alt: "icon",
            //         style: "width: 20px; height: auto",
            //       });

            //       const colorPicker = editor.create.element("color-picker");

            //       const imageDiv = editor.create.div(
            //         "cursor-pointer w-6 h-6 flex justify-center items-center",
            //         {},
            //         [image]
            //       );

            //       imageDiv.addEventListener("click", () => {
            //         editor.selection.insertHTML(
            //           `<span class="image-icon" style="display: inline-flex;"><img src="${url}" alt="icon" style="height: 16px; object-fit: contain; display: inline;" /></span>`,
            //           true
            //         );
            //         close();
            //       });

            //       return imageDiv;
            //     });

            //     const grid = editor.create.div(
            //       "grid gap-2",
            //       {
            //         style:
            //           "grid-template-columns: repeat(4, 1fr); gap: 0.85rem;",
            //       },
            //       images
            //     );

            //     const wrapper = editor.create.div(
            //       "relative active w-[200px] p-1",
            //       [grid]
            //     );

            //     return wrapper;
            //   },
            //   // exec: async (edtr: Jodit) => {
            //   //   editor.current = edtr;
            //   //   // const url = `https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-04%20at%2011.53.47%E2%80%AFAM.png?alt=media&token=5182d10a-bddb-4c9e-85f8-44481d5edbbc`;
            //   //   // editor.current.selection.insertHTML(
            //   //   //   `<img src="${url}" alt="image" />`
            //   //   // );
            //   //   onOpen();
            //   // },
            // },
          ],
        }}
        //   tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {
          updateLiveContent(newContent);
        }}
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
