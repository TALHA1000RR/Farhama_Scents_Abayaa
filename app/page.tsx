// import Footer from "@/components/footer";
// import AboutSection from "@/components/sections/AboutSection";
// import Collections from "@/components/sections/Collections";
// import ContactSection from "@/components/sections/Contacts";
// import Hero from "@/components/sections/Hero";
// import OfficeLocations from "@/components/sections/officies";
// import PricingSection from "@/components/sections/Price";
// import ProductsSection from "@/components/sections/Products";
// import TestimonialSection from "@/components/sections/Testimonials";
// import WeLive from "@/components/sections/WeLive";
// import Why_us from "@/components/sections/Why_us";

import Footer from "../components/Footer";
import AboutSection from "../components/sections/AboutSection";
import Collections from "../components/sections/Collections";
import ContactSection from "../components/sections/ContactSection";
import Hero from "../components/sections/Hero";
import PricingSection from "../components/sections/PricingSection";
import ProductsSection from "../components/sections/FeaturedProducts";
import TestimonialSection from "../components/sections/TestimonialsSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <main className="">
        <Hero />
        <Collections />
        {/* <ProductsSection /> */}
        <FeaturedProducts />
        <TestimonialSection />
        <AboutSection />
        <ContactSection />
        <PricingSection />
        <Footer />
      </main>
    </div>
  );
}
