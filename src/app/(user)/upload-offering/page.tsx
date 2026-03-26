import UploadOfferingForm from "./_components/UploadOfferingForm";

export default function UploadOfferingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-700 flex flex-col font-sans">
      <section className="flex-1 w-full relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-125 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 tracking-tight">
              Offer Your Homage
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Please share your Vyas Puja offering for His Holiness Gopal
              Krishna Goswami Maharaja. We accept offerings in English and
              Hindi.
            </p>
          </div>

          <UploadOfferingForm />
        </div>
      </section>
    </main>
  );
}
