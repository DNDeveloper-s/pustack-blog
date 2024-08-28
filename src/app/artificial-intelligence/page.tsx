import ArtificialIntelligence from "@/components/ArtificialIntelligence/ArtificialIntelligence";
import LandingPageSectionLayout from "@/components/LandingPage/LandingPageSectionLayout";
import Layout from "@/layout/main";

export default function ArtificialIntelligencePage() {
  return (
    <div className="mb-6 w-full py-3 flex justify-between items-center">
      <LandingPageSectionLayout
        label="Artificial Intelligence"
        topics={["artificial-intelligence"]}
        limit={10}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
