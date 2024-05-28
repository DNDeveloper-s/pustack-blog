"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import AppJoditEditor, { Jodit } from "jodit-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface JoditEditorProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function JoditEditor({ content, setContent }: JoditEditorProps) {
  const editor = useRef<Jodit | null>(null);

  return (
    <AppJoditEditor
      ref={editor}
      value={content}
      config={{
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        // placeholder: "Start typings...",
        controls: {
          font: {
            list: {
              "FeatureFlatHeadline, Times New Roman, Times, serif":
                "FeatureFlatHeadline",
            },
          },
        },
      }}
      //   tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => {}}
    />
  );
}
