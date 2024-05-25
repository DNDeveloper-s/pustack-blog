import PoliticsCard, { PoliticsCardWithImage } from "./PoliticsCard";

export default function Politics() {
  return (
    <div className="w-full max-w-[1100px] mx-auto my-4 py-5 px-3">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Politics
        </h2>
        <hr className="border-secondary border-dashed mt-6" />
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] py-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-secondary">
          <div className="pr-0 md:pr-3">
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
          <div className="pl-0 md:pl-3">
            <PoliticsCardWithImage />
          </div>
        </div>
      </div>
    </div>
  );
}
