import PoliticsCard, {
  PoliticsCardWithImage,
} from "@/components/Politics/PoliticsCard";

export default function Media() {
  return (
    <div className="w-full max-w-[1100px] mx-auto my-4 py-5 md:px-0 px-3">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Media
        </h2>
        <hr className="border-secondary border-dashed mt-6" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] py-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-secondary">
          <div className="md:pr-3">
            <PoliticsCardWithImage />
          </div>
          <div className="md:pl-3">
            <div className="grid grid-cols-2 divide-x divide-dashed divide-secondary">
              <div className="pr-3">
                <PoliticsCard />
              </div>
              <div className="pl-3">
                <PoliticsCard />
              </div>
            </div>
            <hr className="border-secondary border-dashed my-3" />
            <div className="grid grid-cols-2 divide-x divide-dashed divide-secondary">
              <div className="pr-3">
                <PoliticsCard />
              </div>
              <div className="pl-3">
                <PoliticsCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
