import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";

export const metadata = {
  title: "Glory News | October Glory",
  description:
    "Hair care tips, styling guides and salon news from the October Glory team.",
  alternates: { canonical: "/glory-news" },
};

const blogs = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    image: "/images/post-01.webp",
    title: "The Ultimate Guide to Maintaining Your Hair Extensions",
    date: "June 15, 2026",
    time: "5 Min Read",
    excerpt:
        "Discover expert tips and techniques to keep your hair extensions looking flawless and beautiful for longer.",
}));

export default function GloryNewsPage() {
    return (
        <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
            <Header theme="dark" />

            {/* --- About Us Page Hero --- */}
            <InnerPageHero
              title="GLORY"
              subtitle="GIRL BLOG"
              description="Style Trends, Maintenance & How To's for the Modern Glory Girl"
            />

            <section className="pb-[var(--space-section-y)] px-[var(--space-section-x)]">
                <div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--space-64)]">

                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                className="bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] p-[10px] rounded-[20px]"
                            >
                                <div className="overflow-hidden rounded-[12px]">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full max-h-[400px] object-cover transition duration-500 hover:scale-105"
                                    />
                                </div>

                                <div className="pt-[var(--space-24)] pb-[var(--space-16)] px-2">
                                    <h3 className="gotham text-[length:clamp(20px,17.65px_+_0.988vw,28px)] font-medium leading-[1.3] mb-[var(--space-16)] line-clamp-2">
                                        {blog.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-white/70 text-[length:var(--fs-small)] mb-[var(--space-16)]">
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.time}</span>
                                    </div>

                                    <p className="gotham text-[length:var(--fs-body)] text-white/80 leading-[1.7] line-clamp-2 mb-[var(--space-24)]">
                                        {blog.excerpt}
                                    </p>

                                    <button className="border border-white rounded-full px-[var(--space-24)] py-3 text-[15px] gotham uppercase tracking-[1px] transition-all duration-300 hover:bg-white hover:text-[#5F3A21]">
                                        Read More
                                    </button>
                                </div>
                            </article>
                        ))}

                    </div>

                    {/* Pagination */}

                    <div className="flex justify-center items-center gap-[var(--space-16)] mt-[var(--space-80)]">

                        <button className="w-[55px] h-[55px] rounded-full border border-white/20 bg-gold text-white font-semibold">
                            1
                        </button>

                        <button className="w-[55px] h-[55px] rounded-full  text-white hover:bg-white/10 transition">
                            2
                        </button>

                        <button className="w-[55px] h-[55px] rounded-full  text-white hover:bg-white/10 transition">
                            3
                        </button>

                    </div>

                </div>
            </section>



            <Footer />
        </div>
    );
}