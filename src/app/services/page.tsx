import Image from "next/image";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";

const services = [
    {
        title: "Natural Styles",
        slug: "natural-styles",
        image: "/images/naturalStyle1.webp",
        description:
            "Enhance your natural beauty with protective and elegant styling designed for everyday confidence.",
    },
    {
        title: "Relaxers And Colors",
        slug: "relaxers-and-colors",
        image: "/images/relaxes1.webp",
        description:
            "Smooth relaxers and rich color transformations tailored to your personality and style.",
    },
    {
        title: "Weaves And Extensions",
        slug: "weaves-and-extensions",
        image: "/images/waves1.webp",
        description:
            "Premium extensions and weaves for volume, length, and a complete transformation.",
    },
    {
        title: "Haircuts And Styles",
        slug: "haircuts-and-styles",
        image: "/images/haircuts1.webp",
        description:
            "Precision haircuts and modern styling crafted for every face shape and vibe.",
    },
    {
        title: "Treatments",
        slug: "treatments",
        image: "/images/hairsclapimg.webp",
        description:
            "Deep nourishment and repair treatments that restore health, shine, and strength.",
    },
    {
        title: "Glorious Packages",
        slug: "glorious-packages",
        image: "/images/gloreus1.webp",
        description:
            "Luxury bundled packages combining multiple premium salon services for complete care.",
    },
    {
        title: "Bridal Packages",
        slug: "bridal-packages",
        image: "/images/bridal1.webp",
        description:
            "Exclusive bridal experience ensuring flawless hair styling for your special day.",
    },
];

const stylingOptions = [
    {
        title: "Cut & Finish",
        description:
            "Whether it’s time for something totally new or you just need some style maintenance our professionalism and attention to detail remains consistent.",
    },
    {
        title: "Extensions / Wigs",
        description:
            "If you want to add length, thickness and volume, hair extensions by Jhavuanna will be the best you've experienced in New York! Don't forget about our Wig Spa!",
    },
    {
        title: "Silk Press",
        description:
            "Your hair is cleansed and conditioned with our premier spa treatments. We will then responsibly press your tresses for a smooth, luxurious finish.",
    },
    {
        title: "Treatments",
        description:
            "All of our treatments are designed to bring out the best from your hair while maintaining your ethical beliefs. All of our products are free from parabens, synthetic fragrance, SLS and carcinogens.",
    },
    {
        title: "Glorious Coloring",
        description:
            "Get a sun-kissed look with a full head of foils. Our talented Senior Hair Stylists & Colorist understand how to blend and interconnect different highlight patterns with the base.",
    },
    {
        title: "Blow Dry",
        description:
            "Treat your hair to a professional hair styling for any occasion. Book your blow dry service and enjoy an amazing shampoo, relaxing head massage and blow dry.",
    },
];

export default function ServicesPage() {
    return (
        <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
            <Header theme="dark" />

            {/* --- About Us Page Hero --- */}
            <section
                className="relative w-full h-screen flex items-center justify-center overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(180deg, rgba(27,27,27,0.6) 0%, rgba(27,27,27,0.85) 100%), url('/images/servicce.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Subtle animated grain overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

                <div className="relative z-10 text-center flex flex-col items-center px-6">
                    <div>
                        <h1 className="andrea text-[120px] leading-[2] text-white mb-0 tracking-wide">
                            Service
                        </h1>
                        <h2 className="valturin text-[80px] text-[#ccb884] mt-[-10px] tracking-widest">
                            Choose Your Service
                        </h2>
                    </div>

                    {/* Gold divider */}
                    <div
                        className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
                    />

                    <p className="gotham text-white/70 text-[20px] leading-[36px] max-w-[600px] font-light"
                    >
                        Each of our services are tailored to our client’s personality and style. We pride ourselves in providing an inspiring, relaxed experience offering the latest in hair trends.
                    </p>
                </div>
            </section>
            <section className="min-h-screen bg-[#1B1B1B] text-white px-[60px] py-[150px] relative overflow-hidden">




                <div className="relative z-10 mb-24 max-w-4xl pt-10">
                    <h2 className="text-[70px] valturin text-[#C0A062] leading-[80px]">
                        Our Premium Services
                    </h2>

                    <p className="text-[20px] gotham leading-[40px] mt-6 text-gray-300">
                        Explore our full range of luxury hair services designed to elevate
                        your beauty, confidence, and personal style.
                    </p>
                </div>

                {/* STYLING OPTIONS HEADING */}
                <div className="relative z-10 mb-16">
                    <span className="uppercase tracking-[6px] text-[#C0A062] gotham text-[14px]">
                        Luxury Salon Experience
                    </span>

                    <h3 className="text-[60px] valturin mt-4 leading-[70px]">
                        Styling Options
                    </h3>

                    <div className="w-[120px] h-[2px] bg-[#C0A062] mt-6"></div>
                </div>

                {/* SERVICES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">

                    {services.map((service, index) => (
                        <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="group border border-white/20 rounded-[30px] overflow-hidden bg-gradient-to-b from-transparent to-white/5 hover:to-white/10 transition-all duration-500 relative"
                        >

                            {/* IMAGE */}
                            <div className="relative h-120 overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
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
                                    {service.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="text-[16px] gotham leading-[30px] text-gray-300 group-hover:text-white transition">
                                    {service.description}
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
                <div className="mt-36 relative z-10">

                    <div className="mb-16">
                        <span className="uppercase tracking-[6px] text-[#C0A062] gotham text-[14px]">
                            Hair Expertise
                        </span>

                        <h3 className="text-[60px] valturin mt-4 leading-[70px]">
                            Discover Our Signature Services
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {stylingOptions.map((item, index) => (
                            <div
                                key={index}
                                className="border border-white/10 rounded-[24px] p-8 bg-white/[0.03] hover:bg-white/[0.05] transition duration-500"
                            >
                                <h4 className="text-[34px] valturin text-[#C0A062] mb-4">
                                    {item.title}
                                </h4>

                                <p className="text-[17px] leading-[32px] gotham text-gray-300">
                                    {item.description}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>



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
                        href="/contact"
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