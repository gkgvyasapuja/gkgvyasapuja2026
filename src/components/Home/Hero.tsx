"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/asset/heroAndGallery/01.webp",
  "/asset/heroAndGallery/02.webp",
  "/asset/heroAndGallery/03.webp",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-[80vh] min-h-150 overflow-hidden bg-[#0a2540] font-sans group">
      {/* Background Images */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Subtle zoom animation */}
          <div
            className={`w-full h-full transition-transform ease-linear duration-10000 ${
              index === currentIndex ? "scale-105" : "scale-100"
            }`}
          >
            <Image
              src={src}
              alt={`Hero image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          {/* Calming dark overlays */}
          <div className="absolute inset-0 bg-[#0a2540]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a2540]/90 via-[#0a2540]/30 to-transparent" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center pb-20 md:pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl space-y-6 transform transition-all duration-1000">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg tracking-wide leading-tight">
            HH Gopal Krishna Goswami Maharaj
          </h1>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-4 md:px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <button
          onClick={goToPrevious}
          className="pointer-events-auto p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all shadow-md"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all shadow-md"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex
                ? "w-8 h-2.5 bg-[#ff6b4a] shadow-md"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/90 shadow-sm"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
