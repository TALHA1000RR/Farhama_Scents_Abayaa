"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import * as SC from "../../app/style";

import Photo from "../../assets/clothe3.jpeg";
import img1 from "../../assets/clothe5.jpeg";
import img2 from "../../assets/clothe6.jpeg";
import img3 from "../../assets/clothe7.jpeg"; 
// import Photo from "@/assets/clothe3.jpeg";
// data/fashionPosts.ts
// import img1 from "@/assets/clothe5.jpeg";
// import img2 from "@/assets/clothe6.jpeg";
// import img3 from "@/assets/clothe7.jpeg";

export const fashionPosts = [
  {
    id: 1,
    image: img1,
    date: "April 16, 2019",
    category: "Accessories",
    author: "Joan Clare",
    title: "We Merge Fashion",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
  },
  {
    id: 2,
    image: img2,
    date: "April 16, 2019",
    category: "Accessories",
    author: "Joan Clare",
    title: "Fabulous Night Look",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
  },
  {
    id: 3,
    image: img3,
    date: "April 16, 2019",
    category: "Accessories",
    author: "Joan Clare",
    title: "Retro Style",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
  },
];

function WeLive() {
  return (
    <>
      {/* HERO SECTION */}
      <div
        className="bg-cover bg-center w-full min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-14 px-6 sm:px-10 lg:px-20"
        style={{
          backgroundImage: `url('/background/background2.jpg')`,
        }}
      >
        {/* Text */}
        <div className="w-full lg:w-1/2 text-left text-white mt-24 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6">
            We Live to Serve
          </h1>

          <p className="text-white/70 mb-10 max-w-xl leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, iure
            officiis natus consequuntur similique voluptatem.
          </p>

          <div className="flex flex-col gap-4 text-white/80 text-sm sm:text-base">
            {[
              "High Quality Products",
              "Affordable Prices",
              "Excellent Customer Service",
              "Fast and Reliable Shipping",
              "Satisfaction Guaranteed",
            ].map((item, i) => (
              <span key={i} className="flex items-center">
                <Check className="mr-2 shrink-0" size={18} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src={Photo}
            alt="Agbaya"
            width={380}
            className="rounded-3xl animate-float-soft shadow-lg shadow-white/30 w-full lg:w-3/5 mb-10 lg:mb-0"
          />
        </div>
      </div>

      <SC.FixedDiv />

      {/* BLOG / POSTS */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-8 lg:py-24">
          {fashionPosts.map((post) => (
            <div
              key={post.id}
              className="group overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-white transition-all duration-700 group-hover:translate-y-2">
                <p className="text-xs italic text-white/70 mb-3">
                  {post.date} — {post.category} — by {post.author}
                </p>

                <h3 className="text-lg sm:text-xl font-semibold tracking-wide mb-3">
                  {post.title.toUpperCase()}
                </h3>

                <p className="text-sm text-white/80 leading-relaxed mb-5 max-w-sm">
                  {post.description}
                </p>

                <span className="inline-flex items-center gap-3 text-xs tracking-widest uppercase">
                  Read More
                  <span className="block h-px w-10 bg-white transition-all duration-500 group-hover:w-16" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WeLive;
