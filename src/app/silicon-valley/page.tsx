import DynamicLayout from "@/components/LandingPage/DynamicLayout";

export default function SiliconValleyPage() {
  return (
    <div className="mb-6 w-full py-3">
      <DynamicLayout
        label="Silicon Valley"
        topics={["silicon-valley"]}
        limit={40}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
