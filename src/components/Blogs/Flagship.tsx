import Link from "next/link";
import TrimmedPara from "../shared/TrimmedPara";
import { useGetFlagshipSignal } from "@/api/signal";

interface FlagshipProps {
  title: string;
}
export default function Flagship(props: FlagshipProps) {
  const { data: flagshipSignal, error } = useGetFlagshipSignal();

  console.log("error - ", error);

  return flagshipSignal ? (
    <Link href={`/signals?id=${flagshipSignal.id}`}>
      <div className="bg-[#dde0f3] p-[10px]">
        <h2 className="font-featureRegular text-[#233bb5] text-[24px] leading-[110%] mb-[10px]">
          Today&apos;s Flagship
        </h2>
        <TrimmedPara
          className="text-[#233bb5] leading-[120%] font-featureHeadline text-[18px]"
          style={{
            fontVariationSettings: '"wght" 300,"opsz" 10',
          }}
        >
          {flagshipSignal.title}
        </TrimmedPara>
        <p className="font-helvetica text-[#233bb5] text-[14px] mt-[10px] block">
          READ IT →
        </p>
      </div>
    </Link>
  ) : null;
}
