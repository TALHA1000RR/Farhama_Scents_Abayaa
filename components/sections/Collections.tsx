"use client";
import Image from "next/image";
import Image1 from "../../assets/icon1.png";
import Image2 from "../../assets/icon2.png";
import Image3 from "../../assets/icon3.png";
import imageBg from "../../assets/icon.png";
import clothe from "../../assets/clothe.jpeg";
import clothe1 from "../../assets/clothe1.jpeg";
import clothe2 from "../../assets/clothe2.jpeg";
import perfume from "../../assets/perfume.jpeg";
import shoe from "../../assets/shoe.jpeg";

function Collections() {
  const features = [
    {
      num: 1,
      title: "Premium Quality",
      description:
        "Every piece is crafted with meticulous attention to detail using the finest materials and fabrics.",
      image: Image1,
    },
    {
      num: 2,
      title: "Timeless Elegance",
      description:
        "Our designs blend traditional modesty with contemporary sophistication for lasting style.",
      image: Image2,
    },
    {
      num: 3,
      title: "Authentic Fragrances",
      description:
        "Experience luxury perfumes crafted with rare ingredients and traditional perfumery techniques.",
      image: Image3,
    },
    {
      num: 4,
      title: "Worldwide Delivery",
      description:
        "Shop from anywhere in the world with secure, fast delivery right to your doorstep.",
      image: Image2,
    },
  ];

  const photoBg = [
    {
      num: 1,
      image: `url(${shoe.src})`,
      title: "Accessories",
      description: "Premium Quality",
    },
    {
      num: 2,
      image: `url(${clothe2.src})`,
      title: "Women's Abayas",
      description: "Elegant Designs",
    },
    {
      num: 3,
      image: `url(${perfume.src})`,
      title: "Signature Scents",
      description: "Luxury Perfumes",
    },
    {
      num: 4,
      image: `url(${clothe1.src})`,
      title: "Modest Fashion",
      description: "Modern Style",
    },
    {
      num: 5,
      image: `url(${clothe.src})`,
      title: "Men's Collection",
      description: "Refined Wear",
    },
  ];

  return (
    <div id="collections" className="bg-brandWhite w-full py-16 flex flex-col justify-center items-center text-center px-4">
      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-extrabold tracking-widest mb-4">WHY CHOOSE FARHAMA</h2>
        
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="w-16 h-px bg-black/40" />
          <span className="text-black/60">✻</span>
          <span className="w-16 h-px bg-black/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                style={{
                  backgroundImage: `url(${imageBg.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="flex flex-col items-center justify-center mb-4"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  className="h-24 object-cover rounded-full z-10"
                  width={96}
                  height={96}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black mt-3 uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="w-full">
        <h3 className="text-3xl font-extrabold tracking-widest mb-10">EXPLORE OUR COLLECTIONS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {photoBg.map((photo) => (
            <div
              key={photo.num}
              style={{
                backgroundImage: photo.image,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="relative h-72 w-full bg-cover bg-center group overflow-hidden cursor-pointer"
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <h3 className="text-white text-xl font-semibold uppercase tracking-wide mb-2">
                  {photo.title}
                </h3>
                <p className="text-brandGold text-sm tracking-widest">{photo.description}</p>
                <button className="mt-4 border border-white text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;