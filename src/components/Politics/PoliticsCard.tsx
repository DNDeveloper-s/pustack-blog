import { imageOne } from "@/assets";
import { url } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function PoliticsCard() {
  return (
    <Link href={url}>
      <div className="py-3 group">
        <div>
          <h2
            className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: "24px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            As Democrats double down on border bill, some progressives grow
            uneasy
          </h2>
          <p
            className="leading-[120%] group-hover:text-appBlue"
            style={{
              fontSize: "16px",
              paddingTop: "10px",
            }}
          >
            Senate Majority Leader Chuck Schumer is eager to put Republicans on
            defense with a vote on a bipartisan border bill. Not every Democrat
            is so excited.
          </p>
        </div>
      </div>
    </Link>
  );
}

export const PoliticsCardWithImage = () => {
  return (
    <Link href={url}>
      <div className="py-3 group">
        <div>
          <h2
            className="font-featureHeadline leading-[120%] group-hover:text-appBlue bg-animation group-hover:bg-hover-animation"
            style={{
              fontSize: "24px",
              fontWeight: "395",
              fontVariationSettings: '"wght" 495,"opsz" 10',
            }}
          >
            As Democrats double down on border bill, some progressives grow
            uneasy
          </h2>
          <p
            className="leading-[120%] group-hover:text-appBlue"
            style={{
              fontSize: "16px",
              paddingTop: "8px",
            }}
          >
            Senate Majority Leader Chuck Schumer is eager to put Republicans on
            defense with a vote on a bipartisan border bill. Not every Democrat
            is so excited.
          </p>
        </div>
        <figure className="mt-2">
          <Image src={imageOne} alt="Image One" />
        </figure>
        <p
          className="leading-[120%] text-[12px] mt-1.5 text-tertiary"
          style={{
            fontFamily: "Courier,monospace",
          }}
        >
          REUTERS/Leah Millis
        </p>
      </div>
    </Link>
  );
};
