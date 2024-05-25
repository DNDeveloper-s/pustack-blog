import PoliticsCard from "../Politics/PoliticsCard";
import TechnologyCard from "../Technology/TechnologyCard";

export default function Africa() {
  return (
    <div className="w-full max-w-[1100px] mx-auto my-4 py-5 md:px-0 px-3">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Africa
        </h2>
        <hr className="border-secondary border-dashed mt-6 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-secondary">
          <div className="pr-3">
            <TechnologyCard />
          </div>
          <div className="px-3">
            <TechnologyCard />
          </div>
          <div className="pl-3">
            <PoliticsCard />
            <PoliticsCard />
            <PoliticsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
