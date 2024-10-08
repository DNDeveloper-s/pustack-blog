import DynamicLayout from "@/components/LandingPage/DynamicLayout";
import LandingPageSectionLayout from "@/components/LandingPage/LandingPageSectionLayout";
import Technology from "@/components/Technology/Technology";
import TechnologyCard from "@/components/Technology/TechnologyCard";
import Layout from "@/layout/main";

export default function TechnologyPage() {
  return (
    <div className="mb-6 w-full py-3">
      <DynamicLayout
        label="Technology"
        topics={["technology"]}
        limit={40}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
