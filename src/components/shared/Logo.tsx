import { minervaImage } from "@/assets";
import Image from "next/image";
import Link from "next/link";

const styles = {
  xs: {
    className: "text-[20px]",
  },
  sm: {
    className: "text-[30px]",
  },
  md: {
    className: "text-[40px]",
  },
  lg: {
    className: "text-[50px]",
  },
  xl: {
    className: "text-[60px]",
  },
  xxl: {
    className: "text-[70px]",
  },
};

export default function Logo({
  size = "sm",
  style = {},
  linkStyle = {},
  className = "",
  linkClassName = "",
}: {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  style?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <Link href="/" style={linkStyle} className={linkClassName}>
      {/* <p
        className={
          "font-larkenExtraBold leading-[120%] " + styles[size].className
        }
        style={style}
      >
        MINERVA
      </p> */}
      <Image
        className={"w-full " + className}
        style={style}
        src={minervaImage}
        alt="Minerva"
      />
    </Link>
  );
}
