import { minervaImage, minervaMiniImage, owlImage } from "@/assets";
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
  style = {},
  linkStyle = {},
  withMini = false,
  className = "",
  linkClassName = "",
}: {
  style?: React.CSSProperties;
  linkStyle?: React.CSSProperties;
  className?: string;
  linkClassName?: string;
  withMini?: boolean;
}) {
  return (
    <Link
      prefetch={true}
      href="/"
      style={linkStyle}
      className={"!flex items-center gap-1 " + linkClassName}
    >
      {/* <p
        className={
          "font-larkenExtraBold leading-[120%] " + styles[size].className
        }
        style={style}
      >
        MINERVA
      </p> */}
      {withMini && (
        <Image className="h-full w-auto" src={owlImage} alt="Minerva" />
      )}
      <Image
        className={"h-full w-auto " + className}
        style={style}
        src={minervaImage}
        alt="Minerva"
      />
    </Link>
  );
}
