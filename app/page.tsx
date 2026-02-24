import Footer from "../components/Footer";
import BlogSection from "../components/sections/BlogSection";
import CollectionsSection from "../components/sections/Collections";
import ContactSection from "../components/sections/ContactSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import HeroSection from "../components/sections/Hero";
import PricingSection from "../components/sections/PricingSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <BlogSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </>
  );
}