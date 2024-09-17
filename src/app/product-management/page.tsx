import DynamicLayout from "@/components/LandingPage/DynamicLayout";

export default function ProductManagementPage() {
  return (
    <div className="mb-6 w-full py-3">
      <DynamicLayout
        label="Product Management"
        topics={["product-management"]}
        limit={40}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
