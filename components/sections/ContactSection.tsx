'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader } from 'lucide-react';
import { useContact } from '@/hooks';

export default function ContactSection() {
  const { submit, isLoading, isSuccess, error } = useContact();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submit(form);
    if (ok) setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Get in Touch</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              We'd Love to Hear<br />From You
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Have a question about an order, a product, or want to collaborate? Our team is always here to help. Reach out and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                { Icon: MapPin, label: 'Visit Us', value: 'Wolverhampton, West Midlands, UK' },
                { Icon: Phone, label: 'Call Us', value: '+44 1902 123456' },
                { Icon: Mail, label: 'Email Us', value: 'hello@farhama.co.uk' },
                { Icon: Clock, label: 'Opening Hours', value: 'Mon–Sat: 9am–6pm' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#faf8f3] p-8 md:p-10">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-black uppercase tracking-widest mb-6">Send a Message</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" value={form.name} onChange={set} required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={set} required />
                </div>
                <Field label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={set} />

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">Message</label>
                  <textarea
                    name="message" value={form.message} onChange={set} required rows={5}
                    placeholder="How can we help you?"
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition resize-none bg-white"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 px-4 py-2 border border-red-200">{error}</p>
                )}

                <button
                  type="submit" disabled={isLoading}
                  className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <><Loader size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', value, onChange, required = false }: any) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition bg-white"
      />
    </div>
  );
}



// "use client";

// import Image from "next/image";
// import { useState } from "react";

// export default function ContactSection() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Simulate form submission
//     console.log("Form submitted:", formData);
//     setSubmitted(true);
//     setTimeout(() => {
//       setSubmitted(false);
//       setFormData({ name: "", email: "", message: "" });
//     }, 3000);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <section id="contact" className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
//       {/* LEFT SIDE – FORM */}
//       <div className="flex items-center justify-center px-6 py-16 bg-[#fafafa]">
//         <div className="w-full max-w-md">
//           {/* Title */}
//           <h2 className="text-4xl font-extrabold tracking-wide text-center">
//             GET IN TOUCH
//           </h2>

//           {/* Divider */}
//           <div className="flex items-center justify-center gap-4 my-6">
//             <span className="w-16 h-px bg-black/40" />
//             <span className="text-black/60">✦</span>
//             <span className="w-16 h-px bg-black/40" />
//           </div>

//           {/* Subtitle */}
//           <p className="text-center italic text-black/60 mb-10">
//             Have a question about our products or need styling advice? We'd love to hear from you. 
//             Our team is here to help make your shopping experience exceptional.
//           </p>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//               className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black transition"
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Your Email"
//               className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black transition"
//               required
//             />

//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               placeholder="Write your message..."
//               rows={4}
//               className="w-full border border-black/40 px-4 py-3 outline-none focus:border-black resize-none transition"
//               required
//             />

//             <button
//               type="submit"
//               disabled={submitted}
//               className="w-full bg-black text-white py-4 tracking-widest font-semibold hover:bg-brandGold transition disabled:opacity-50"
//             >
//               {submitted ? "MESSAGE SENT!" : "SEND MESSAGE"}
//             </button>
//           </form>

//           {/* Contact Info */}
//           <div className="mt-10 pt-8 border-t border-black/10">
//             <h4 className="font-semibold mb-4 text-sm tracking-widest">REACH US DIRECTLY</h4>
//             <p className="text-sm text-black/70 mb-2">📧 hello@farhama.co.uk</p>
//             <p className="text-sm text-black/70 mb-2">📱 +44 1902 123456</p>
//             <p className="text-sm text-black/70">📍 Wolverhampton, United Kingdom</p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT SIDE – IMAGE */}
//       <div className="relative hidden md:block">
//         <Image
//           src="/background/background4.jpg"
//           alt="Farhama workspace"
//           fill
//           className="object-cover"
//           priority
//         />
        
//         {/* Overlay with brand message */}
//         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//           <div className="text-center text-white px-6">
//             <h3 className="text-4xl font-bold mb-4">We're Here For You</h3>
//             <p className="text-lg text-white/90 max-w-md">
//               Experience luxury customer service that matches the quality of our products.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }