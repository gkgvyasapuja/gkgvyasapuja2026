import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
            We are here to help with offerings, donations, event information,
            and general queries related to Guru Maharaja Vyasa Puja.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Phone className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Call Us</h2>
            <p className="mt-2 text-sm text-slate-600">
              Reach us directly for immediate help.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="tel:+919819780656"
                className="block text-base font-medium text-blue-700 hover:underline"
              >
                +91 9819780656
              </a>
              <a
                href="tel:+919082600516"
                className="block text-base font-medium text-blue-700 hover:underline"
              >
                +91 9082600516
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Mail className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-sm text-slate-600">
              Send us your questions anytime.
            </p>
            <div className="mt-4">
              <a
                href="mailto:info@gkgvyasapuja.com"
                className="break-all text-base font-medium text-blue-700 hover:underline"
              >
                info@gkgvyasapuja.com
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <MapPin className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Location</h2>
            <p className="mt-2 text-sm text-slate-600">
              Visit us or reach out for temple/event details.
            </p>
            <div className="mt-4 text-base text-slate-700">
              ISKCON Temple
              <br />
              Mumbai, India
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Clock className="h-6 w-6 text-blue-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Support Hours
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We try to respond as quickly as possible.
            </p>
            <div className="mt-4 text-base text-slate-700">
              Mon - Sun
              <br />
              9:00 AM - 8:00 PM
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-[#02295c] px-6 py-8 text-white md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">
                Need immediate assistance?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
                For urgent offering or event-related queries, contact us
                directly using phone or email.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+919819780656"
                className="rounded-xl bg-white px-5 py-3 text-center font-medium text-[#02295c] transition hover:bg-slate-100"
              >
                Call Now
              </a>
              <a
                href="mailto:info@gkgvyasapuja.com"
                className="rounded-xl border border-white/30 px-5 py-3 text-center font-medium text-white transition hover:bg-white/10"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill out the form below and our team will get back to you soon.
            </p>

            <form className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="inline-flex rounded-xl bg-[#02295c] px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              How can we help?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              You can contact us for:
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Offering upload support",
                "Donation-related assistance",
                "Technical issues on the website",
                "General questions about Guru Maharaja Vyasa Puja",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-semibold text-slate-900">
                Preferred contact
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                For fastest response, phone is best. For detailed issues, email
                is recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}