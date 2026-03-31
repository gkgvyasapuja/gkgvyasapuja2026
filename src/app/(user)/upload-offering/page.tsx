"use client";

import { MouseEvent } from "react";
import UploadOfferingForm from "./_components/UploadOfferingForm";

export default function UploadOfferingPage() {
  const scrollToTips = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById("how-to");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen mx-auto px-4 bg-gradient-to-b from-white to-slate-50 text-gray-700 flex flex-col font-sans">
      {" "}
      <section className="flex-1 w-full relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-125 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black mb-6 tracking-tight">
              Offer Your Homage
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Please share your Vyas Puja offering for His Holiness Gopal
              Krishna Goswami Maharaja. We accept offerings in English and
              Hindi.
            </p>
          </div>

          <p className="text-center bg-white p-5 shadow-md mb-10 rounded-lg text-gray-700">
            For better insights on how to write the perfect offering please go
            through{" "}
            <a
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-blue-700 font-semibold hover:bg-blue-100 transition"
              href="#how-to"
              onClick={scrollToTips}
            >
              writing tips for offering
            </a>{" "}
            section. You can even{" "}
            <a
              href="https://gkgvyasapuja.blob.core.windows.net/offerings/Sample%20Offering%20English%20And%20Hindi.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-500 underline"
            >
              download sample offering
            </a>{" "}
            file for reference.
          </p>

          <div className="w-full bg-white border border-gray-200 shadow-md rounded-2xl p-6 md:p-10">
            <UploadOfferingForm />
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight mt-20">
              Importance of Vyasa-puja for a Disciple
            </h2>
            <p className="py-3">
              The appearance day of our dear Gurudeva, His Holiness Gopal
              Krishna Goswami Maharaja falls on the most auspicious day of
              Annada Ekadashi.It is a very special day not only for his
              disciples but for the entire ISKCON society, because he has won
              everyone&apos;s hearts by his compassionate nature.
            </p>
            <p className="py-3">
              We are eternally indebted to Guru Maharaja for showing us the path
              of devotion and as a small gesture of love towards him, we attempt
              to write the Vyasa Puja offering and glorify him. Every year,
              disciples from all over the world mail these offerings in advance
              ,then they are compiled into a book called the Vyasa Puja book of
              the year.
            </p>
            <p className="py-3">
              On the auspicious day of Guru Maharaja&apos;s appearance, this
              book is presented to Gurudeva, who opens the book and reads the
              offerings. This is the moment which the disciples are anxiously
              waiting for, hoping that Guru Maharaja reads their offering. So in
              short, our love for our Guru is expressed through our Vyasa Puja
              offerings. Each of the offerings written by disciples comes
              straight from their heart, there is no doubt about it, but sharing
              some of the tips to make our offerings exceptionally good
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto mt-14 bg-white border border-slate-200 shadow-lg rounded-3xl p-8">
            <div className="text-center mb-6">
              <h2
                id="how-to"
                className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight"
              >
                How to Write Vyasa Puja Offering
              </h2>
              <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto">
                Follow these steps for structuring a heartfelt and respectful
                offering.
              </p>
            </div>

            <div className="space-y-5 text-slate-700">
              <section className="bg-sky-50 border-l-4 border-sky-400 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-sky-700">
                  Addressing
                </h3>
                <p className="mt-2">
                  Start with a respectful salutation to Guru Maharaja (e.g. Dear
                  Guru Maharaja), then ask for permission to offer humble
                  obeisances at the dust of his lotus feet.
                </p>
              </section>

              <section className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-700">
                  Main Offering
                </h3>
                <p>
                  Share your sincere experience, how wisdom from Guru Maharaja
                  has touched you, and relate it to guru-pranamantra or a
                  relevant shloka.
                </p>
                <blockquote className="mt-3 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-800">
                  <p className="mb-1">
                    “titiksavah karunikah, suhrdah sarva-dehinam”
                  </p>
                  <p className="mb-0">
                    “ajata-satravah santah, sadhavah sadhu-bhusanah”
                  </p>
                </blockquote>
                <p className="mt-3 text-slate-600">
                  (SB CANTO 3 CHAP 25 TEXT 21) – The symptoms of a sadhu are
                  tolerance, mercy and friendliness. He is peaceful and follows
                  scripture.
                </p>
              </section>

              <section className="bg-slate-100 border-l-4 border-slate-400 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900">
                  Personal Gratitude
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    Mention what Guru Maharaja has done for your spiritual
                    growth and service.
                  </li>
                  <li>
                    Highlight your devotional activities (preaching, book
                    distribution, service).
                  </li>
                  <li>
                    Keep it humble; this is an offering, not personal promotion.
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 border border-blue-200 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900">Ending</h3>
                <p className="mt-2 text-slate-700">
                  Close with prayer for Guru Maharaja’s long life and health,
                  then sign with your name and temple affiliation.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
