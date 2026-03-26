"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const quotes = [
  "A spiritual master who is one hundred percent Krishna conscious is the bona ﬁde spiritual master. Bhagavad Gita 2.8",
  "If we take shelter of the lotus feet of the spiritual master, we can become free from illusion, fear, and distress. If we wholeheartedly beg for his mercy without any deceit then the spiritual master bestows all auspiciousness upon us.",
  "The spiritual master is the mercy representative of the Lord. Srimad Bhagavatam 1.7.22",
];

export default function PrabhupadQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 6000); // Change quote every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-24 md:py-32 bg-linear-to-b from-[#0a2540] to-[#041120] font-sans relative overflow-hidden">
      {/* Deep Space Glowing Ambience */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-[#ff6b4a]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#00a8cc]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left Side: Image of Srila Prabhupada */}
          <div className="w-full md:w-5/12 flex justify-center relative">
            <div className="relative h-96 w-72 rounded-md overflow-hidden shadow-2xl border-4 border-white/5 group">
              <div className="absolute inset-0 bg-[#ff6b4a]/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
              <Image
                src="/asset/prabhupada.webp"
                alt="Srila Prabhupada"
                fill
                className="w-full object-fill object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 16rem, (max-width: 1024px) 20rem, 24rem"
              />
            </div>

            {/* Lotus Decoration */}
            <div className="absolute -bottom-6 right-24 text-5xl md:text-6xl text-[#ff6b4a] opacity-30 drop-shadow-lg rotating-slow animate-pulse pointer-events-none">
              ❀
            </div>
          </div>

          {/* Right Side: Quotes Carousel */}
          <div className="w-full md:w-7/12 flex flex-col items-center md:items-start space-y-8 text-center md:text-left">
            <div className="w-full relative min-h-37.5 flex items-center">
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  className={`absolute top-1/2 -translate-y-1/2 w-full transition-all duration-1000 ease-in-out ${
                    index === currentQuoteIndex
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-12 pointer-events-none"
                  }`}
                >
                  <p className="text-xl md:text-xl lg:text-2xl font-light text-blue-50 tracking-wide leading-relaxed italic relative">
                    <span className="text-5xl text-[#ff6b4a] opacity-40 absolute -top-6 -left-8 md:-left-10 font-serif">
                      
                    </span>
                    {quote}
                    <span className="text-5xl text-[#ff6b4a] opacity-40 absolute -bottom-10 inline-block ml-2 font-serif">
                      
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Author */}
            <div className="pt-16">
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wider">
                His Divine Grace
              </h3>
              <p className="text-[#ff6b4a] text-lg mt-1 tracking-widest uppercase">
                A.C. Bhaktivedanta Swami Prabhupada
              </p>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-3 pt-6">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuoteIndex(index)}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    index === currentQuoteIndex
                      ? "w-8 bg-[#ff6b4a]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Show quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
