import PoliticsCard, { PoliticsCardWithImage } from "./PoliticsCard";

export default function Politics() {
  return (
    <div className="my-4 py-5">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Politics
        </h2>
        <hr className="border-dashed border-[#1f1d1a4d] mt-6" />
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] py-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d]">
          <div className="pr-0 md:pr-3 grid grid-rows-[1fr_10px_1fr] divide-y divide-dashed divide-[#1f1d1a4d]">
            <div className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] pb-3">
              <div className="pr-3">
                <PoliticsCard />
              </div>
              <div className="pl-3">
                <PoliticsCard />
              </div>
            </div>
            {/* <hr className="border-secondary border-dashed border-[#1f1d1a4d] my-3" /> */}
            <div className="grid grid-cols-2 divide-x divide-dashed divide-[#1f1d1a4d] pt-3">
              <div className="pr-3">
                <PoliticsCard />
              </div>
              <div className="pl-3">
                <PoliticsCard />
              </div>
            </div>
          </div>
          <div className="pl-0 md:pl-3">
            <PoliticsCardWithImage />
          </div>
        </div>
      </div>
    </div>
  );
}
