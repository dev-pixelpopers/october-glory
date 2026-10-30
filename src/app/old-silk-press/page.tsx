import { notFound } from "next/navigation";
import ServiceDetailTemplate from "@/app/components/service-detail";
import { childrenMenu, getParent } from "@/data/services";

const parent = getParent("silk-press");

export const metadata = {
  title: parent?.meta.title,
  description: parent?.meta.description,
  alternates: { canonical: "/old-silk-press" },
};

/**
 * The previous Silk Press service page, parked at /old-silk-press.
 *
 * /services/silk-press now serves the Silk Press showcase. This one is kept
 * whole and reachable by URL; nothing links to it. Its sub-services still
 * live at /services/silk-press/<slug>.
 */
export default function OldSilkPressPage() {
  if (!parent) notFound();

  return <ServiceDetailTemplate service={{ ...parent, menu: childrenMenu(parent) }} />;
}
