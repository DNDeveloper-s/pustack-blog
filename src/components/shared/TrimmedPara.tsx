import { trimToSentence } from "@/lib/transformers/trimToSentence";

interface TrimmedParaProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: string;
  wordLimit?: number;
}

/**
 * TrimmedPara component
 * @param children Description to be trimmed
 * @param wordLimit Word limit for the description
 * @returns {JSX.Element} Trimmed description
 */
export default function TrimmedPara({
  children,
  wordLimit = 20,
  ...props
}: TrimmedParaProps) {
  const trimmedDescription = trimToSentence(children, wordLimit);
  return <p {...props}>{trimmedDescription}</p>;
}
// Path: src/components/shared/TrimmedPara.tsx
