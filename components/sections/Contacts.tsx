"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE – FORM */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#fafafa]">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-4xl font-extrabold tracking-wide text-center">
            GET IN TOUCH
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <span className="w-16 h-px bg-black/40" />
            <span className="text-black/60">✦</span>
            <span className="w-16 h-px bg-black/40" />
          </div>

          {/* Subtitle */}
          <p className="text-center italic text-black/60 mb-10">
            Have a question about our products or need styling advice? We'd love to hear from you. 
            Our team is here to help make your shopping experience exceptional.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black transition"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black transition"
              required
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={4}
              className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black resize-none transition"
              required
            />

            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-black text-white py-4 tracking-widest font-semibold hover:bg-brandGold transition disabled:opacity-50"
            >
              {submitted ? "MESSAGE SENT!" : "SEND MESSAGE"}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-10 pt-8 border-t border-black/10">
            <h4 className="font-semibold mb-4 text-sm tracking-widest">REACH US DIRECTLY</h4>
            <p className="text-sm text-black/70 mb-2">📧 hello@farhama.co.uk</p>
            <p className="text-sm text-black/70 mb-2">📱 +44 1902 123456</p>
            <p className="text-sm text-black/70">📍 Wolverhampton, United Kingdom</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – IMAGE */}
      <div className="relative hidden md:block">
        <Image
          src="/background/background4.jpg"
          alt="Farhama workspace"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay with brand message */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h3 className="text-4xl font-bold mb-4">We're Here For You</h3>
            <p className="text-lg text-white/90 max-w-md">
              Experience luxury customer service that matches the quality of our products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

