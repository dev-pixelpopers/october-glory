// Metadata lives here because page.tsx is a Client Component.
export const metadata = {
  title: "Contact Us | October Glory",
  description:
    "Get in touch with October Glory — questions, consultations and appointment enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
