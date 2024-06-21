import Link from "next/link";
import TrimmedPara from "../shared/TrimmedPara";
import { BlogBaseProps } from "./BlogWithAuthor";
import { useGetFlagshipPost } from "@/api/post";

export default function Flagship() {
  const { data: flagshipPost } = useGetFlagshipPost();
  return flagshipPost?.data() &&
    (flagshipPost.data()?.snippetData?.content ||
      flagshipPost.data()?.title) ? (
    <div className="bg-secondary p-[10px]">
      <h2 className="font-featureRegular text-[24px] leading-[110%] mb-[10px]">
        Today&apos;s Flagship
      </h2>
      <TrimmedPara
        className="leading-[120%] font-featureHeadline text-[18px]"
        style={{
          fontVariationSettings: '"wght" 300,"opsz" 10',
        }}
      >
        {flagshipPost.data()?.snippetData?.content ??
          flagshipPost.data()?.title ??
          ""}
      </TrimmedPara>
      <Link
        href={`/signals`}
        className="font-helvetica text-[14px] mt-[10px] block"
      >
        READ IT →
      </Link>
    </div>
  ) : null;
}
