import LandingPageSectionLayout from "@/components/LandingPage/LandingPageSectionLayout";
import ProductManagement from "@/components/ProductManagement/ProductManagement";
import Layout from "@/layout/main";

export default function ProductManagementPage() {
  return (
    <div className="mb-6 w-full py-3 flex justify-between items-center">
      <LandingPageSectionLayout
        label="Product Management"
        topics={["product-management"]}
        limit={10}
        classNames={{ base: "!p-0", wrapper: "!border-none" }}
      />
    </div>
  );
}
