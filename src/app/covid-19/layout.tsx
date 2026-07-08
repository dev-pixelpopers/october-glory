// Metadata lives here because page.tsx is a Client Component.
export const metadata = {
  title: "COVID-19 Policy | October Glory",
  description: "October Glory's health and safety measures for salon visits.",
  alternates: { canonical: "/covid-19" },
};

export default function CovidLayout({ children }: { children: React.ReactNode }) {
  return children;
}
