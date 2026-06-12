"use client";

import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 4 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    }, 4000);
  };

  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header bg="white" />

      {/* ============================
          HERO SECTION
      ============================ */}
      <section
        className="relative pt-[220px] pb-[120px] px-6 md:px-[120px] bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/85 z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-[900px]">
          <h1 className="andrea text-[80px] md:text-[110px] text-white mb-[-20px] tracking-wide">
            Get In
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            Touch
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            Ready for a luxurious transformation? Reach out to schedule your
            private appointment with Jhavuanna Paterson at October Glory.
          </p>
        </div>
      </section>

      {/* ============================
          CONTACT INFO CARDS
      ============================ */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#151515] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none z-0 select-none opacity-[0.04]">
          <div className="valturin text-[50vw] leading-none text-white absolute top-[-10%] left-[-5vw]">
            O
          </div>
          <div className="valturin text-[50vw] leading-none text-[#3C3C3C] absolute bottom-[-10%] right-[-5vw]">
            G
          </div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-20">
            <span className="andrea text-[60px] text-gold mb-[-10px] block">
              Reach
            </span>
            <h2 className="valturin text-[45px] md:text-[60px] text-white uppercase tracking-widest">
              October Glory
            </h2>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Phone */}
            <div className="border border-[#cda873]/20 bg-[#1B1B1B] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center group-hover:bg-[#cda873]/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-[#cda873]"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">
                Phone
              </h3>
              <p className="gotham text-[18px] leading-[28px] text-gray-400 font-light">
                By Appointment Only
              </p>
              <a
                href="tel:9179056552"
                className="gotham text-[22px] text-[#cda873] hover:text-white transition-colors"
              >
                917 - 905 - 6552
              </a>
            </div>

            {/* Card 2: Location */}
            <div className="border border-[#cda873]/20 bg-[#1B1B1B] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center group-hover:bg-[#cda873]/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-[#cda873]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">
                Location
              </h3>
              <p className="gotham text-[18px] leading-[28px] text-gray-400 font-light">
                Brooklyn, New York
              </p>
              <p className="gotham text-[22px] text-[#cda873]">
                1381 Bedford Avenue
                <br />
                Brooklyn, NY 11216
              </p>
            </div>

            {/* Card 3: Hours */}
            <div className="border border-[#cda873]/20 bg-[#1B1B1B] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center group-hover:bg-[#cda873]/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-[#cda873]"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">
                Opening Hours
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-8">
                  <span className="gotham text-[16px] text-gray-400">
                    Sun - Tue
                  </span>
                  <span className="gotham text-[16px] text-gray-500">
                    Closed
                  </span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span className="gotham text-[16px] text-gray-400">
                    Wed - Fri
                  </span>
                  <span className="gotham text-[16px] text-[#cda873]">
                    10:00 am - 4:00 pm
                  </span>
                </div>
                <div className="flex justify-between items-center gap-8">
                  <span className="gotham text-[16px] text-gray-400">
                    Saturday
                  </span>
                  <span className="gotham text-[16px] text-[#cda873]">
                    10:00 am - 1:00 pm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          CONTACT FORM + MAP SECTION
      ============================ */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#1B1B1B] relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          {/* Left Column: Contact Form */}
          <div
            className="px-10 py-[60px] flex flex-col justify-center rounded-[2rem] relative overflow-hidden bg-gradient-to-b from-[#9C6D51] to-[#5F3A21]">
            <div className="mb-10">
              <h2 className="andrea text-[70px] text-white mb-[-20px]">
                Send Us
              </h2>
              <h3 className="valturin text-[45px] text-[#c1a073] ml-[80px]">
                A Message
              </h3>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-6 py-16">
                <div className="w-20 h-20 rounded-full bg-[#cda873]/20 border border-[#cda873]/40 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-10 h-10 text-[#cda873]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h4 className="valturin text-[32px] text-white">
                  Message Sent!
                </h4>
                <p className="gotham text-[16px] text-gray-300 font-light text-center max-w-[400px]">
                  Thank you for reaching out. We'll get back to you within 24
                  hours to schedule your appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name + Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="gotham text-[14px] text-gray-300 uppercase tracking-[2px] font-light">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white gotham text-[16px] placeholder-gray-500 focus:outline-none focus:border-[#cda873] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="gotham text-[14px] text-gray-300 uppercase tracking-[2px] font-light">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white gotham text-[16px] placeholder-gray-500 focus:outline-none focus:border-[#cda873] transition-colors"
                    />
                  </div>
                </div>

                {/* Phone + Service Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="gotham text-[14px] text-gray-300 uppercase tracking-[2px] font-light">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white gotham text-[16px] placeholder-gray-500 focus:outline-none focus:border-[#cda873] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="gotham text-[14px] text-gray-300 uppercase tracking-[2px] font-light">
                      Service Interest
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white gotham text-[16px] focus:outline-none focus:border-[#cda873] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#2D2018] text-white">
                        Select a Service
                      </option>
                      <option
                        value="natural-styles"
                        className="bg-[#2D2018] text-white"
                      >
                        Natural Styles
                      </option>
                      <option
                        value="relaxers-colors"
                        className="bg-[#2D2018] text-white"
                      >
                        Relaxers & Colors
                      </option>
                      <option
                        value="weaves-extensions"
                        className="bg-[#2D2018] text-white"
                      >
                        Weaves & Extensions
                      </option>
                      <option
                        value="haircuts-styles"
                        className="bg-[#2D2018] text-white"
                      >
                        Haircuts & Styles
                      </option>
                      <option
                        value="silk-press"
                        className="bg-[#2D2018] text-white"
                      >
                        Silk Press
                      </option>
                      <option
                        value="treatments"
                        className="bg-[#2D2018] text-white"
                      >
                        Treatments
                      </option>
                      <option
                        value="bridal"
                        className="bg-[#2D2018] text-white"
                      >
                        Bridal Package
                      </option>
                      <option
                        value="wigs"
                        className="bg-[#2D2018] text-white"
                      >
                        Wigs
                      </option>
                      <option
                        value="other"
                        className="bg-[#2D2018] text-white"
                      >
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="gotham text-[14px] text-gray-300 uppercase tracking-[2px] font-light">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your dream look or any questions you have..."
                    className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white gotham text-[16px] placeholder-gray-500 focus:outline-none focus:border-[#cda873] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="flex items-center gap-4 group w-max mt-4 cursor-pointer"
                >
                  <div className="w-15 h-15 rounded-full border border-[#cda873] flex items-center justify-center transition-all duration-300 group-hover:bg-[#cda873] group-hover:text-black text-[#cda873]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </div>
                  <span className="text-white gotham text-[20px] group-hover:text-[#cda873] transition-colors duration-300">
                    Send Message
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Map + Visit Info */}
          <div className="flex flex-col gap-8">
            {/* Map Embed */}
            <div className="rounded-[2rem] overflow-hidden border border-[#cda873]/20 flex-1 min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.0!2d-73.9530!3d40.6815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b8f1b0c5a1f%3A0x0!2s1381+Bedford+Ave%2C+Brooklyn%2C+NY+11216!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="October Glory Salon Location"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>

            {/* Visit Info Card */}
            <div className="border border-[#cda873]/20 bg-[#151515] p-10 rounded-[2rem] flex flex-col gap-6">
              <h3 className="valturin text-[28px] text-gold">
                Plan Your Visit
              </h3>
              <div className="flex flex-col gap-4">
                <p className="gotham text-[16px] text-gray-300 font-light leading-[28px]">
                  October Glory operates by{" "}
                  <strong className="text-white">appointment only</strong> to
                  ensure each guest receives an undivided, luxurious experience.
                  We recommend booking at least 48 hours in advance.
                </p>
                <div className="w-full h-[1px] bg-white/10"></div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-4 h-4 text-[#cda873]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="gotham text-[14px] text-gray-400 font-light">
                      Located in the heart of Bedford-Stuyvesant, Brooklyn —
                      easily accessible via the A/C train at Nostrand Ave.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          CTA SECTION
      ============================ */}
      <section
        className="py-[120px] px-6 bg-cover bg-center text-center relative"
        style={{ backgroundImage: "url('/images/servicce.png')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-8">
          <h2 className="andrea text-[70px] text-white mb-[-30px]">
            Your Glory
          </h2>
          <h3 className="valturin text-[35px] md:text-[50px] text-gold uppercase tracking-wider">
            Awaits You
          </h3>
          <p className="gotham text-[18px] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Don't wait — secure your private appointment and let Jhavuanna
            craft a look that's uniquely yours. Your transformation starts
            with a single call.
          </p>
          <a
            href="tel:9179056552"
            className="flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </span>
            Call 917 - 905 - 6552
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
