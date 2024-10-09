"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// You can separate the PDF rendering logic into a new component
const PDFViewerComponent = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPDF = async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.mjs";

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      // Clear the container before rendering new content
      const container = containerRef.current;
      if (container) {
        container.innerHTML = ""; // Clear previously rendered pages
      }

      // Loop through all the pages and render each page
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({ scale: 2 });

        // Create a canvas element for each page
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        const context = canvas.getContext("2d");

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };

        // Render the page on the canvas
        await page.render(renderContext).promise;

        // Append the canvas to the container
        if (container) {
          container.appendChild(canvas);
        }
      }
    };

    loadPDF();
  }, [url]);

  return (
    <div className="w-full max-w-[900px] mx-auto" ref={containerRef}></div>
  );
};

export default PDFViewerComponent;
