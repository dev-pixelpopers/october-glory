import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

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
                            GLORY
                        </h1>
                        <h2 className="valturin text-[80px] text-[#ccb884] mt-[-10px] tracking-widest">
                            GIRL BLOG
                        </h2>
                    </div>

                    {/* Gold divider */}
                    <div
                        className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
                    />

                    <p className="gotham text-white/70 text-[20px] leading-[36px] max-w-[600px] font-light"
                    >
                        Style Trends, Maintenance & How To's for the Modern Glory Girl
                    </p>
                </div>
            </section>

            <section className="pb-[150px] px-[50px]">
                <div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

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

                                <div className="pt-6 pb-4 px-2">
                                    <h3 className="gotham text-[26px] font-medium leading-[1.3] mb-4 line-clamp-2">
                                        {blog.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-white/70 text-[14px] mb-4">
                                        <span>{blog.date}</span>
                                        <span>•</span>
                                        <span>{blog.time}</span>
                                    </div>

                                    <p className="gotham text-[16px] text-white/80 leading-[1.7] line-clamp-2 mb-6">
                                        {blog.excerpt}
                                    </p>

                                    <button className="border border-white rounded-full px-6 py-3 text-[15px] gotham uppercase tracking-[1px] transition-all duration-300 hover:bg-white hover:text-[#5F3A21]">
                                        Read More
                                    </button>
                                </div>
                            </article>
                        ))}

                    </div>

                    {/* Pagination */}

                    <div className="flex justify-center items-center gap-4 mt-[80px]">

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