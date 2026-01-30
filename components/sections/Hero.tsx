"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../ui/button";

const heroSlides = [
  {
    id: 1,
    title: "LUXURY YOU CAN AFFORD",
    subtitle: "Discover Our Exquisite Collection",
    description:
      "Elegant abayas, refined men's wear, children's designs, and premium accessories. Timeless style meets uncompromising quality.",
    image: "/background/perfume.jpg",
    cta1: "Discover",
    cta2: "Order Now",
  },
  {
    id: 2,
    title: "CAPTIVATING FRAGRANCES",
    subtitle: "Scents That Define You",
    description:
      "From oud-inspired classics to modern floral notes, our premium perfumes are crafted for those who appreciate the art of fine fragrance.",
    image: "/background/background2.jpg",
    cta1: "Explore Scents",
    cta2: "Order Now",
  },
  {
    id: 3,
    title: "MODEST ELEGANCE",
    subtitle: "Abayas & Modest Fashion",
    description:
      "Beautifully tailored abayas and modest wear for women, men, and children. Fashion that honours tradition while embracing contemporary style.",
    image: "/background/background4.jpg",
    cta1: "View Collection",
    cta2: "Order Now",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      const navHeight = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .7), rgba(0, 0, 0, 0.4)), url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center h-full text-center px-4 sm:px-6">
            <div className="flex flex-col justify-center items-center pt-20 w-full max-w-5xl">
              <div className="flex items-center my-6 w-full">
                <span className="flex-1 h-px bg-brandWhite/60" />
                <span className="mx-3 text-3xl sm:text-4xl md:text-5xl text-brandWhite">
                  ✻
                </span>
                <span className="flex-1 h-px bg-brandWhite/60" />
              </div>

              <p className="text-brandGold font-semibold tracking-[0.3em] text-sm sm:text-base mb-4 animate-fadeIn">
                {slide.subtitle}
              </p>

              <h1 className="heroText text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fadeIn">
                {slide.title}
              </h1>

              <p className="text-white/80 font-light mt-5 text-sm sm:text-base md:text-lg max-w-3xl animate-fadeIn animation-delay-200">
                {slide.description}
              </p>

              <div className="flex gap-5 mt-8 animate-fadeIn animation-delay-400">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleScrollToProducts}
                >
                  {slide.cta1}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleScrollToProducts}
                >
                  {slide.cta2}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-500 ${
              index === currentSlide
                ? "w-12 bg-brandGold"
                : "w-8 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;