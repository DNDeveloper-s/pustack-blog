"use client";

import dynamic from "next/dynamic";

// Dynamically import pdfjs-dist, disabling SSR for the component
// @ts-ignore
const PDFViewer = dynamic(() => import("../../components/PDFComponent"), {
  ssr: false,
});

export default function PrivacyPolicy() {
  const privacyPolicy =
    "https://firebasestorage.googleapis.com/v0/b/avian-display-193502.appspot.com/o/legal%2FPrivacy%20Policy.pdf?alt=media&token=7233bfb7-dd7b-4587-ba0b-e72bc78bbe4d";

  return <PDFViewer url={privacyPolicy} />;
}
