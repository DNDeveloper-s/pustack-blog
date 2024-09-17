import DynamicLayout from "@/components/LandingPage/DynamicLayout";

export default function MorePage() {
  return (
    <div className="mb-6 w-full py-3">
      <DynamicLayout
        label="Others"
        topics={["others"]}
        limit={40}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
