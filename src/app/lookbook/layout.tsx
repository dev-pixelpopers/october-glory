// Metadata lives here because page.tsx is a Client Component.
export const metadata = {
  title: "Lookbook | October Glory",
  description:
    "Browse the October Glory lookbook — signature styles, transformations and inspiration from our stylists.",
  alternates: { canonical: "/lookbook" },
};

export default function LookbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
