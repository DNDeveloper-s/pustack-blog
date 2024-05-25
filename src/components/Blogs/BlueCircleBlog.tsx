import { circlesBlue } from "@/assets";
import { url } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function BlueCircleBlog() {
  return (
    <Link href={url}>
      <div className="py-3 group">
        <div className="flex group-hover:text-appBlue items-center gap-3 text-[12px] font-featureHeadline mb-1">
          <span>10 HR</span>
          <span>UK</span>
        </div>
        <div>
          <Image
            src={circlesBlue}
            alt="circles blue"
            className="w-[16px] h-[13px] float-left mt-[5px] mr-[5px]"
          />
          <h2
            className="font-featureHeadline group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            UK&apos;s infected blood scandal exacerbated by &apos;chilling&apos;
            cover-up, inquiry finds{" "}
          </h2>
        </div>
      </div>
    </Link>
  );
}
