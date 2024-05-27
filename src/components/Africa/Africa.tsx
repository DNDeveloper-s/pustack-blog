import PoliticsCard from "../Politics/PoliticsCard";
import TechnologyCard from "../Technology/TechnologyCard";

export default function Africa() {
  return (
    <div className="my-4 py-5 md:px-0">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Africa
        </h2>
        <hr className=" border-dashed border-[#1f1d1a4d] mt-6 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d]">
          <div className="pr-3">
            <TechnologyCard />
          </div>
          <div className="px-3">
            <TechnologyCard />
          </div>
          <div className="pl-3 grid divide-y divide-dashed divide-[#1f1d1a4d]">
            <PoliticsCard />
            <PoliticsCard />
            <PoliticsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
