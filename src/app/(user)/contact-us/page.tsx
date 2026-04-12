import {
  // MapPin,
  Phone,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-muted/40 to-background">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-full max-w-3xl -translate-x-1/2 rounded-full bg-[#0a2540]/15 blur-[100px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Get in touch
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Contact{" "}
            <span className="text-[#0a2540]">Us</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            We are here to help with offerings, donations, event information,
            and general queries related to Guru Maharaja Vyasa Puja.
          </p>
        </div>
      </header>

      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2 sm:gap-8">
            <div className="group relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-border/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(10,37,64,0.08)] sm:p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2540]/10 text-[#0a2540] transition group-hover:bg-[#0a2540]/15">
                <Phone className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Call us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Reach us directly for immediate help.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="tel:+919819780656"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-center text-base font-semibold text-[#0a2540] transition hover:border-[#0a2540]/25 hover:bg-[#0a2540]/4"
                >
                  <Phone className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  +91 9819780656
                </a>
                <a
                  href="tel:+919082600516"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-center text-base font-semibold text-[#0a2540] transition hover:border-[#0a2540]/25 hover:bg-[#0a2540]/4"
                >
                  <Phone className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  +91 9082600516
                </a>
              </div>
            </div>

            {/* <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
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
          </div> */}

            {/* <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
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
          </div> */}

            <div className="group relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-border/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(10,37,64,0.08)] sm:p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2540]/10 text-[#0a2540] transition group-hover:bg-[#0a2540]/15">
                <Clock className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Support hours
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We try to respond as quickly as possible.
              </p>
              <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Every day
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                  9:00 AM – 8:00 PM IST
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8">
            <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              We can help with
            </h3>
            <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                "Offering uploads",
                "Donations",
                "Event information",
                "General questions",
              ].map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* <div className="mt-12 rounded-3xl bg-[#02295c] px-6 py-8 text-white md:px-10 md:py-10">
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
        </div> */}
    </div>
  );
}
