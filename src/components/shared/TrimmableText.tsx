// import { useState, useEffect, useRef } from "react";

// function trimText(text: string, limit: number) {
//   if (text.length <= limit) return text;

//   let trimmed = text.slice(0, limit);

//   const lastPeriod = trimmed.lastIndexOf(".");
//   const lastExclamation = trimmed.lastIndexOf("!");
//   const lastQuestion = trimmed.lastIndexOf("?");

//   const trimIndex = Math.max(lastPeriod, lastExclamation, lastQuestion);

//   if (trimIndex === -1) {
//     return trimmed;
//   }

//   return trimmed.slice(0, trimIndex + 1);
// }

// export default function TrimmableText({
//   text,
//   paraClassName = "",
//   paraStyle = {},
// }: {
//   text: string;
//   paraClassName?: string;
//   paraStyle?: React.CSSProperties;
// }) {
// const [trimmedText, setTrimmedText] = useState(text);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const container = containerRef.current;

//     function isOverflowing() {
//       if (!container) return false;
//       return (
//         container.scrollHeight > container.clientHeight ||
//         container.scrollWidth > container.clientWidth
//       );
//     }

//     function adjustTextToFit() {
//       let start = 0;
//       let end = text.length;
//       let bestFit = text;

//       while (start < end) {
//         const mid = Math.floor((start + end) / 2);
//         const newTrimmedText = trimText(text, mid);
//         setTrimmedText(newTrimmedText);

//         if (!isOverflowing()) {
//           bestFit = newTrimmedText;
//           start = mid + 1;
//         } else {
//           end = mid;
//         }
//       }

//       setTrimmedText(bestFit);
//     }

//     adjustTextToFit();
//     window.addEventListener("resize", adjustTextToFit);

//     return () => {
//       window.removeEventListener("resize", adjustTextToFit);
//     };
//   }, [text]);

//   return (
{
  /* <div
  ref={containerRef}
  style={{
    width: "100%",
    height: "100%",
    overflow: "hidden",
  }}
>
  <p className={paraClassName} style={paraStyle}>
    {trimmedText}
  </p>
</div>; */
}
//   );
// }

import { useState, useEffect, useRef } from "react";

// Utility function to trim the text meaningfully at sentence boundaries
function trimText(text: string, limit: number) {
  if (text.length <= limit) return text;

  // Trim the text to the specified limit
  let trimmed = text.slice(0, limit);

  // Find the last sentence-ending punctuation
  const lastPeriod = trimmed.lastIndexOf(".");
  const lastExclamation = trimmed.lastIndexOf("!");
  const lastQuestion = trimmed.lastIndexOf("?");

  // Find the maximum valid boundary
  const trimIndex = Math.max(lastPeriod, lastExclamation, lastQuestion);

  // If no sentence-ending punctuation was found, return the original trim
  if (trimIndex === -1) {
    return trimmed; // Or return an empty string if needed
  }

  // Return text trimmed at the last sentence boundary
  return trimmed.slice(0, trimIndex + 1);
}

// Function to calculate the character limit per line based on container width and font properties
function getCharLimit(
  containerWidth: number,
  fontSize: number,
  lineHeight: number
) {
  const avgCharWidth = fontSize * 0.55; // Approximation of average character width
  const charsPerLine = Math.floor(containerWidth / avgCharWidth);
  return charsPerLine;
}

export default function TrimmableText({
  text,
  paraClassName = "",
  paraStyle = {},
}: {
  text: string;
  paraClassName?: string;
  paraStyle?: React.CSSProperties;
}) {
  const [trimmedText, setTrimmedText] = useState(text);
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const style = window.getComputedStyle(container);

    const containerWidth = container.clientWidth;
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight);

    // Calculate characters per line based on font properties and container width
    const charsPerLine = getCharLimit(containerWidth, fontSize, lineHeight);

    // Calculate how many lines fit in the container
    const totalLines = Math.floor(container.clientHeight / lineHeight);

    // Calculate the maximum number of characters that can fit
    const charLimit = charsPerLine * totalLines;

    // Trim the text based on this character limit and ensure it's meaningfully trimmed
    const newTrimmedText = trimText(text, charLimit);
    setTrimmedText(newTrimmedText);
  }, [text]);

  return (
    <p
      ref={containerRef}
      className={paraClassName}
      style={{ width: "100%", height: "100%", ...paraStyle }}
    >
      {trimmedText}
    </p>
  );
}
