import Image from "next/image";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import {
  getChildPages,
  getParents,
  servicePath,
} from "@/data/services";

export const metadata = {
  title: "Our Services | October Glory",
  description:
    "Browse every October Glory service — natural styles, haircuts, relaxers and colors, treatments, weaves and extensions, and luxury packages.",
  alternates: { canonical: "/services" },
};

/** The five main services, straight from the data file. */
const services = getParents();

/**
 * Every child service that has a page, grouped under the main service it
 * belongs to. Adding one in `children.ts` makes it appear here — nothing to
 * maintain twice. Sub-services still awaiting content are boxes on their
 * parent's page and have nothing to link to here.
 */
const signatureServices = services.flatMap((parent) =>
    getChildPages(parent.slug).map((child) => ({
        title: child.cardTitle,
        href: servicePath(child),
        parent: parent.cardTitle,
        description: child.hero.intro,
    }))
);

export default function ServicesPage() {
    return (
        <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
            <Header theme="dark" />

            <InnerPageHero
                title="Choose"
                subtitle="Our Premium Service"
                description="Each of our services are tailored to our client’s personality and style. We pride ourselves in providing an inspiring, relaxed experience offering the latest in hair trends."
            />
            <section className="min-h-screen bg-[#1B1B1B] text-white px-[60px] py-[150px] relative overflow-hidden">




                {/* <div className="relative z-10 mb-24 max-w-4xl pt-10">
                    <h2 className="text-[70px] valturin text-[#C0A062] leading-[80px]">
                        Our Premium Services
                    </h2>

                    <p className="text-[20px] gotham leading-[40px] mt-6 text-gray-300">
                        Explore our full range of luxury hair services designed to elevate
                        your beauty, confidence, and personal style.
                    </p>
                </div> */}

                {/* STYLING OPTIONS HEADING */}
                <div className="relative z-10 mb-16">
                    <span className="uppercase tracking-[6px] text-[#C0A062] gotham text-[14px]">
                        Luxury Salon Experience
                    </span>

                    <h3 className="text-[60px] valturin mt-4 leading-[70px]">
                        Signature Services
                    </h3>

                    <div className="w-[120px] h-[2px] bg-[#C0A062] mt-6"></div>
                </div>

                {/* SERVICES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">

                    {services.map((service, index) => (
                        <Link
                            key={service.slug}
                            href={servicePath(service)}
                            className="group border border-white/20 rounded-[30px] overflow-hidden bg-gradient-to-b from-transparent to-white/5 hover:to-white/10 transition-all duration-500 relative"
                        >

                            {/* IMAGE */}
                            <div className="relative h-120 overflow-hidden">
                                <Image
                                    src={service.cardImage}
                                    alt={service.cardTitle}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* DARK OVERLAY */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />

                                {/* INDEX NUMBER */}
                                <span className="absolute top-6 right-6 text-white/40 text-[36px] valturin z-10">
                                    0{index + 1}
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div className="p-6 relative z-10">

                                {/* TITLE */}
                                <h3 className="text-[28px] leading-[38px] valturin mb-4 group-hover:text-[#C0A062] transition">
                                    {service.cardTitle}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="text-[16px] gotham leading-[30px] text-gray-300 group-hover:text-white transition">
                                    {service.cardBlurb}
                                </p>

                                {/* BUTTON */}
                                <div className="mt-6 flex items-center gap-3 text-[#C0A062] text-[16px]">
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                                        View Details →
                                    </span>
                                </div>

                            </div>

                            {/* HOVER EFFECT */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-[#C0A062]/10 to-transparent pointer-events-none"></div>

                        </Link>
                    ))}

                </div>

                {/* STYLING DETAILS SECTION */}
                {/* <div className="mt-36 relative z-10">

                    <div className="mb-16">
                        <span className="uppercase tracking-[6px] text-[#C0A062] gotham text-[14px]">
                            Hair Expertise
                        </span>

                        <h3 className="text-[60px] valturin mt-4 leading-[70px]">
                            Discover Our Signature Services
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {signatureServices.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex flex-col border border-white/10 rounded-[24px] p-8 bg-white/[0.03] hover:bg-white/[0.05] hover:border-[#C0A062]/50 transition duration-500"
                            >
                                <span className="uppercase tracking-[4px] text-white/40 group-hover:text-[#C0A062]/70 gotham text-[11px] mb-3 transition duration-500">
                                    {item.parent}
                                </span>

                                <h4 className="text-[34px] valturin text-[#C0A062] mb-4">
                                    {item.title}
                                </h4>

                                <p className="text-[17px] leading-[32px] gotham text-gray-300">
                                    {item.description}
                                </p>

                                <span className="flex items-center gap-3 mt-6 text-[15px] gotham text-white/60 group-hover:text-[#C0A062] transition duration-500">
                                    Explore
                                    <span
                                        aria-hidden="true"
                                        className="transition-transform duration-500 group-hover:translate-x-1"
                                    >
                                        →
                                    </span>
                                </span>
                            </Link>
                        ))}

                    </div>

                </div> */}



            </section>

            <section
                className="py-[120px] px-6 bg-cover bg-center text-center relative"
                style={{
                    backgroundImage: "url('/images/servicce.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/90 z-0"></div>
                <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-8">
                    <h2 className="andrea text-[70px] text-white mb-[-30px]">Reserve Your Space</h2>
                    <h3 className="valturin text-[35px] md:text-[50px] text-gold uppercase tracking-wider">
                        Ready to Transform Your Look?
                    </h3>
                    <p className="gotham text-[18px] text-gray-300 max-w-[600px] font-light leading-relaxed">
                        Let us tailor an unforgettable styling experience for you. Schedule your private appointment with Jhavuanna Paterson today.
                    </p>
                    <a
                        href="/dashboard/book"
                        className="flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
                    >
                        <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
                            →
                        </span>
                        Book Consultation
                    </a>
                </div>
            </section>
            <Footer />
        </div >
    );
}