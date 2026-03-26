"use client";

import { Download } from "lucide-react";

export default function BhagwatPadAshtakam() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#f8fafc] font-sans relative overflow-hidden">
      {/* Background abstract decoration elements to add calming vibe */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff6b4a]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0a2540]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-10 z-10">
        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 text-[#ff6b4a]">
          <span className="h-0.5 w-16 bg-linear-to-r from-transparent to-[#ff6b4a]/40 block"></span>
          <span className="text-2xl opacity-80">❀</span>
          <span className="h-0.5 w-16 bg-linear-to-l from-transparent to-[#ff6b4a]/40 block"></span>
        </div>

        {/* Heading & Description */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a2540] tracking-wide">
            Bhagavat Pad Ashtakam
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Immerse yourself in the sacred glorification. Download and read the
            divine verses of Bhagavat Pad Ashtakam to experience peace and
            devotion.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6">
          <a
            href="https://iskcongkg.s3.ap-south-1.amazonaws.com/e-bookpdf/Bhagavatpadashatakam-Hindi.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full sm:w-auto bg-[#0a2540] hover:bg-[#0a2540]/90 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>Download in Hindi</span>
          </a>

          <a
            href="https://iskcongkg.s3.ap-south-1.amazonaws.com/e-bookpdf/Bhagavatpadashatakam-English.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full sm:w-auto bg-[#ff6b4a] hover:bg-[#ff8469] text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            <Download className="w-5 h-5 shrink-0" />
            <span>Download in English</span>
          </a>
        </div>
      </div>
    </section>
  );
}
