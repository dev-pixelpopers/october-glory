import React from "react";
import Link from "next/link";

export type Crumb = {
  label: string;
  /** Omit on the last item — the page you are already on is not a link. */
  href?: string;
};

const HOME: Crumb = { label: "Home", href: "/" };

/**
 * Where the site is deployed, for the absolute URLs the structured data
 * needs. Matches the `metadataBase` in the root layout.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://octoberglory.com";

/**
 * The breadcrumb trail shown at the top of every inner page.
 *
 * Callers pass the trail *after* Home — `[{ label: "Services", href:
 * "/services" }, { label: "Silk Press" }]` renders Home / Services / Silk
 * Press. Prepending Home here rather than at each call site is what stops
 * the first crumb drifting between pages.
 *
 * The trail follows the URL rather than the navigation menu. A reader uses
 * it to understand where they are and to climb back up, and the only
 * hierarchy that reliably matches the address bar is the path itself.
 *
 * Three details that make this a breadcrumb rather than a row of links:
 * an ordered list inside a labelled `nav`, so assistive tech announces it as
 * a breadcrumb and reads the depth; the last crumb as plain text carrying
 * `aria-current="page"`, because linking to the page you are on is a dead
 * end; and separators marked `aria-hidden`, so they are not read aloud
 * between every step.
 *
 * It also emits `BreadcrumbList` structured data, which is what lets search
 * results show the path instead of a bare URL.
 */
export default function Breadcrumbs({
  trail,
  /** Heroes centre their content; a left-aligned page can override. */
  align = "center",
  className = "",
}: {
  trail: Crumb[];
  align?: "center" | "left";
  className?: string;
}) {
  const items = [HOME, ...trail];
  if (items.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`gotham text-[12px] md:text-[13px] tracking-[4px] uppercase text-white/50 ${className}`}
    >
      <ol
        className={`flex flex-wrap items-center gap-x-3 gap-y-[6px] ${
          align === "center" ? "justify-center" : "justify-start"
        }`}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-x-3">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-300 hover:text-[#ccb884] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ccb884]"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-[#ccb884]">
                  {item.label}
                </span>
              )}

              {!last && (
                <span aria-hidden="true" className="text-[#ccb884]/60">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <script
        type="application/ld+json"
        // The object is built from this component's own props, not from
        // anything a visitor can supply.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
