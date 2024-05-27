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
}: {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  style?: React.CSSProperties;
}) {
  return (
    <Link href="/">
      <p
        className={
          "font-larkenExtraBold leading-[120%] " + styles[size].className
        }
        style={style}
      >
        MINERVA
      </p>
    </Link>
  );
}
