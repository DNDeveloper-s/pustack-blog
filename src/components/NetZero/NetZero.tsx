import TechnologyCard from "@/components/Technology/TechnologyCard";

export default function NetZero() {
  return (
    <div className="my-4 py-5 md:px-0">
      <div className="border-t-2 border-black">
        <h2 className="font-featureHeadline text-[40px] leading-[120%] pt-1">
          NetZero
        </h2>
        <hr className=" border-dashed border-[#1f1d1a4d] mt-6 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#1f1d1a4d] ">
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
