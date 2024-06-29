import { HiOutlineExternalLink } from "react-icons/hi";

export default function NavigatorShare({
  handleShare,
}: {
  handleShare: () => void;
}) {
  return (
    typeof navigator?.canShare === "function" &&
    navigator?.canShare() && (
      <div className="flex gap-2 items-center" onClick={handleShare}>
        <button className="text-[13px] font-helvetica font-bold text-appBlue underline uppercase leading-[1px]">
          Share
        </button>
        <HiOutlineExternalLink className="text-appBlue" />
      </div>
    )
  );
}
