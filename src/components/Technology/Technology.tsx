import TechnologyCard from "./TechnologyCard";

export default function Technology() {
  return (
    <div className="w-full max-w-[1100px] mx-auto my-4 py-5 md:px-0 px-3">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          Technology
        </h2>
        <hr className="border-secondary border-dashed mt-6 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-secondary ">
          <div className="md:pr-3">
            <TechnologyCard />
          </div>
          <div className="md:px-3">
            <TechnologyCard />
          </div>
          <div className="md:px-3">
            <TechnologyCard />
          </div>
          <div className="md:pl-3">
            <TechnologyCard />
          </div>
        </div>
      </div>
    </div>
  );
}
