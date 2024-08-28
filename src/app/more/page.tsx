import LandingPageSectionLayout from "@/components/LandingPage/LandingPageSectionLayout";
import More from "@/components/More/More";
import Layout from "@/layout/main";

export default function MorePage() {
  return (
    <div className="mb-6 w-full py-3 flex justify-between items-center">
      <LandingPageSectionLayout
        label="More"
        topics={["more"]}
        limit={10}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
