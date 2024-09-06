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

  return null;
}
