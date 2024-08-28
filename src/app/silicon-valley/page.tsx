import LandingPageSectionLayout from "@/components/LandingPage/LandingPageSectionLayout";
import SiliconValley from "@/components/SiliconValley/SiliconValley";
import Layout from "@/layout/main";

export default function SiliconValleyPage() {
  return (
    <div className="mb-6 w-full py-3 flex justify-between items-center">
      <LandingPageSectionLayout
        label="Silicon Valley"
        topics={["silicon-valley"]}
        limit={10}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
