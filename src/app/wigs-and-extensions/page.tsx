import type { Metadata } from "next";
import ServiceDetailTemplate from "@/app/components/service-detail";
import {
  wigsAndExtensions,
  wigsAndExtensionsChildren,
} from "@/data/services/wigs-and-extensions";

export const metadata: Metadata = {
  title: wigsAndExtensions.meta.title,
  description: wigsAndExtensions.meta.description,
  alternates: { canonical: "/wigs-and-extensions" },
};

export default function WigsAndExtensionsPage() {
  return (
    <ServiceDetailTemplate
      service={wigsAndExtensions}
      related={{
        eyebrow: "Also In This Service",
        heading: "Explore Wigs & Extensions",
        items: wigsAndExtensionsChildren,
      }}
    />
  );
}
