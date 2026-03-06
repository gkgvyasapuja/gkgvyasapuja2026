"use client";

import Image from "next/image";

const images = [
  {
    src: "/asset/heroAndGallery/01.webp",
    classes: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/asset/heroAndGallery/02.webp",
    classes: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/asset/heroAndGallery/03.webp",
    classes: "md:col-span-2 md:row-span-1",
  },
  {
    src: "/asset/heroAndGallery/04.webp",
    classes: "md:col-span-1 md:row-span-2",
  },
  {
    src: "/asset/heroAndGallery/05.webp",
    classes: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/asset/heroAndGallery/06.webp",
    classes: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/asset/heroAndGallery/07.webp",
    classes: "md:col-span-1 md:row-span-1",
  },
  {
    src: "/asset/heroAndGallery/08.webp",
    classes: "md:col-span-1 md:row-span-1",
  },
];

export default function Gallery() {
  return (
    <section className="w-full py-12 bg-[#f8fafc] font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-4 text-[#ff6b4a]">
            <span className="h-[2px] w-12 bg-linear-to-r from-transparent to-[#ff6b4a]/40 block"></span>
            <span className="text-xl opacity-80">❀</span>
            <span className="h-[2px] w-12 bg-linear-to-l from-transparent to-[#ff6b4a]/40 block"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a2540] tracking-wide">
            Divine Memories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">
            Glimpses of sacred moments filled with devotion, peace, and
            spiritual joy.
          </p>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 md:gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-[#0a2540]/5 ${img.classes}`}
            >
              <Image
                src={img.src}
                alt={`Gallery visual ${index + 1}`}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Soft graceful gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a2540]/60 via-[#0a2540]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
