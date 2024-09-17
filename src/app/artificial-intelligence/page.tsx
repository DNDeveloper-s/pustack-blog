import DynamicLayout from "@/components/LandingPage/DynamicLayout";

export default function ArtificialIntelligencePage() {
  return (
    <div className="mb-6 w-full py-3">
      <DynamicLayout
        label="Artificial Intelligence"
        topics={["artificial-intelligence"]}
        limit={40}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
