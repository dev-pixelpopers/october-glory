import type { Metadata } from "next";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { silkPress, silkPressChildren } from "@/data/services/silk-press";

export const metadata: Metadata = {
  title: silkPress.meta.title,
  description: silkPress.meta.description,
  alternates: { canonical: "/silk-press" },
};

export default function SilkPressPage() {
  return (
    <ServiceDetailTemplate
      service={silkPress}
      related={{
        eyebrow: "Also In This Service",
        heading: "Explore Silk Press",
        items: silkPressChildren,
      }}
    />
  );
}
