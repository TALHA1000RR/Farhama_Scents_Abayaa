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



// import Footer from "../components/Footer";
// import AboutSection from "../components/sections/AboutSection";
// import Collections from "../components/sections/Collections";
// import ContactSection from "../components/sections/ContactSection";
// import Hero from "../components/sections/Hero";
// import PricingSection from "../components/sections/PricingSection";
// import ProductsSection from "../components/sections/FeaturedProducts";
// import TestimonialSection from "../components/sections/TestimonialsSection";
// import FeaturedProducts from "../components/sections/FeaturedProducts";

// export default function Home() {
//   return (
//     <div>
//       <main className="">
//         <Hero />
//         <Collections />
//         {/* <ProductsSection /> */}
//         <FeaturedProducts />
//         <TestimonialSection />
//         <AboutSection />
//         <ContactSection />
//         <PricingSection />
//         <Footer />
//       </main>
//     </div>
//   );
// }
