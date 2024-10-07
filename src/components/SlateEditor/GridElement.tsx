import React from "react";
import { FaGear, FaPlus } from "react-icons/fa6";
import { FaDesktop } from "react-icons/fa";
import { FaTabletAlt } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import { Transforms } from "slate";
import { useEffect, useRef } from "react";
import { CustomElement } from "../../../types/slate";

const GridConfigModal = ({ element, disclosureOptions }: any) => {
  const editor = useSlate();
  const desktopRef = useRef<HTMLInputElement>(null);
  const tabletRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      !desktopRef.current ||
      !tabletRef.current ||
      !mobileRef.current ||
      !element
    )
      return;

    mobileRef.current.value = element.style?.["--mobile-cols"] || 1;
    tabletRef.current.value = element.style?.["--tablet-cols"] || 2;
    desktopRef.current.value = element.style?.["--desktop-cols"] || 3;

    console.log("element.style - ", element.style);
  }, [element, disclosureOptions.isOpen]);

  const setSaveConfig = () => {
    const path = ReactEditor.findPath(editor, element);
    // Adjust the path to point to the root
    const rootPath = path;
    // Get the current element's children
    const currentChildren = element.children || [];

    // Get the values from refs
    const mobileCols = mobileRef.current?.value || 1; // Default to 1 column if not provided
    const tabletCols = tabletRef.current?.value || 2;
    const desktopCols = desktopRef.current?.value || 3;

    // Replace the current element with the custom element
    let customElement: CustomElement = {
      type: "grid-container",
      style: {
        // @ts-ignore
        "--mobile-cols": mobileCols,
        "--tablet-cols": tabletCols,
        "--desktop-cols": desktopCols,
      },
      children: currentChildren as any,
    };

    // @ts-ignore
    Transforms.setNodes(editor, customElement, { at: rootPath });

    disclosureOptions.onClose();
  };

  return (
    <Modal
      isOpen={disclosureOptions.isOpen}
      onOpenChange={disclosureOptions.onOpenChange}
      classNames={{
        wrapper: "bg-black bg-opacity-50 !items-center !z-[9999] ",
        base: "min-h-[400px] overflow-auto !max-h-[70vh] w-[90vw] max-w-[500px] !bg-white rounded",
        closeButton:
          "text-black text-sm p-1 bg-gray-300 absolute right-2 top-2",
      }}
      isDismissable={false}
    >
      <ModalContent className="h-auto max-h-[90vh] overflow-auto jodit-table bg-primary no-preflight">
        <ModalHeader style={{ borderBottom: "1px dashed #1f1f1f1d" }}>
          <span className="font-featureBold">Grid Config Settings</span>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-[120px_1fr] py-5">
            <div className="flex items-center">
              <span className="text-sm">Number of Columns</span>
            </div>
            <div className="flex justify-evenly">
              <div className="flex flex-col gap-2 justify-start items-center">
                <div className="text-sm flex items-center justify-center gap-1.5">
                  <FaDesktop />
                  <span>Desktop</span>
                </div>
                <input
                  ref={desktopRef}
                  className="w-14 text-center bg-gray-100 py-1"
                  type="number"
                  min={1}
                  max={12}
                />
              </div>
              <div className="flex flex-col gap-2 justify-start items-center">
                <div className="text-sm flex items-center justify-center gap-1.5">
                  <FaTabletAlt />
                  <span>Tablet</span>
                </div>
                <input
                  ref={tabletRef}
                  className="w-14 text-center bg-gray-100 py-1"
                  type="number"
                  min={1}
                  max={12}
                />
              </div>
              <div className="flex flex-col gap-2 justify-start items-center">
                <div className="text-sm flex items-center justify-center gap-1.5">
                  <FaMobileAlt />
                  <span>Mobile</span>
                </div>
                <input
                  ref={mobileRef}
                  className="w-14 text-center bg-gray-100 py-1"
                  type="number"
                  min={1}
                  max={12}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            className="text-white bg-green-500 rounded-lg"
            onClick={() => {
              setSaveConfig();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const GridContainerElement = ({
  element,
  attributes,
  children,
}: any) => {
  const disclosureOptions = useDisclosure();
  const editor = useSlate();
  const readonly = useReadOnly();

  const handleAddItem = () => {
    const path = ReactEditor.findPath(editor, element);
    // Adjust the path to point to the root
    // Get the current element's children

    // Replace the current element with the custom element
    Transforms.insertNodes(
      editor,
      {
        type: "grid-item",
        children: [{ type: "paragraph", children: [{ text: "" }] }],
      },
      { at: [...path, element.children.length] }
    );

    // @ts-ignore
    // Transforms.setNodes(editor, customElement, { at: rootPath });
  };

  return (
    <div
      {...attributes}
      className={
        "w-full grid grid-cols-3 gap-4 group/grid-container slate-grid-container " +
        (element.className ?? "")
      }
      style={element.style}
    >
      {children}
      {!readonly && (
        <>
          <div
            className="group-hover/grid-container:opacity-100 opacity-0 transition-all flex items-center gap-2"
            contentEditable={false}
          >
            <div
              onClick={() => {
                handleAddItem();
              }}
              className="w-auto h-auto py-2 inline-flex items-center justify-center text-sm gap-2 bg-green-500 text-white px-5 rounded-lg cursor-pointer"
            >
              <FaPlus />
              {/* <span>Add Item</span> */}
            </div>
            <div
              onClick={() => {
                disclosureOptions.onOpen();
              }}
              className="w-auto h-auto py-2 inline-flex items-center justify-center text-sm gap-2 bg-blue-500 text-white px-5 rounded-lg cursor-pointer"
            >
              <FaGear />
              {/* <span>Config</span> */}
            </div>
          </div>
          <GridConfigModal
            disclosureOptions={disclosureOptions}
            element={element}
          />
        </>
      )}
    </div>
  );
};

export const GridItemElement = ({ element, attributes, children }: any) => {
  const readonly = useReadOnly();
  return (
    <div
      {...attributes}
      className={"h-full " + (!readonly ? "p-2 bg-gray-200" : "")}
    >
      {children}
    </div>
  );
};
