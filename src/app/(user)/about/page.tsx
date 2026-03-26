import Image from "next/image";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Quote,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-muted/40 to-background pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="mb-5 inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                The Eternal Guide
              </p>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                His Divine Grace
                <br />
                <span className="text-[#0a2540]">Guru Maharaja</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                A life dedicated to the mission of Sri Chaitanya Mahaprabhu,
                spreading the message of divine love and devotion across every
                corner of the globe.
              </p>
            </div>
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-2xl shadow-lg ring-1 ring-border/80 lg:mx-0">
                <Image
                  src="/asset/heroAndGallery/01.webp"
                  alt="Guru Maharaja portrait"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
              <div
                className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-48 w-48 rounded-full bg-[#0a2540]/10 blur-3xl"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </header>

      {/* Appearance + quote */}
      <section className="border-b border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-16">
            <aside className="w-full shrink-0 lg:max-w-sm">
              <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
                  Divine Appearance
                </h2>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Born
                    </dt>
                    <dd className="mt-1 text-lg font-medium text-foreground">
                      August 14, 1944
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Location
                    </dt>
                    <dd className="mt-1 text-lg font-medium text-foreground">
                      New Delhi, India
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
            <div className="flex flex-1 items-center">
              <blockquote className="border-l-4 border-[#0a2540]/40 pl-6 text-xl leading-relaxed text-foreground sm:text-2xl">
                <p className="italic text-muted-foreground">
                  &ldquo;The appearance of a pure devotee is a celebration for
                  all of humanity, a descent of spiritual grace into the temporal
                  world to guide lost souls back to their eternal home.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A Journey of Devotion
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-[#ff6b4a]" />
            <p className="mt-4 text-muted-foreground">
              Key moments in a lifetime of preaching and service.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <article className="group relative min-h-95 overflow-hidden rounded-2xl bg-[#0a2540] text-primary-foreground shadow-md md:col-span-8">
              <div className="absolute inset-0">
                <Image
                  src="/asset/heroAndGallery/02.webp"
                  alt=""
                  fill
                  className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a2540] via-[#0a2540]/85 to-transparent" />
              </div>
              <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/80">
                  The Turning Point
                </p>
                <h3 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Meeting Srila Prabhupada
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                  The moment that redefined a destiny. Upon meeting His Divine
                  Grace A.C. Bhaktivedanta Swami Prabhupada, Guru Maharaja
                  dedicated every breath to fulfilling the instructions of his
                  spiritual master.
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm md:col-span-4">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0a2540] text-white">
                <BookOpen className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                The Brhat Mrdanga
              </h3>
              <p className="flex-1 leading-relaxed text-muted-foreground">
                A pioneer in book distribution, bringing the timeless wisdom of the
                Bhagavad-gita and Srimad Bhagavatam to thousands of hearts across
                continents.
              </p>
            </article>

            <article className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm md:col-span-4">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0a2540] text-white">
                <Building2 className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                Temple Construction
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Spearheading spiritual centers, overseeing the architectural and
                spiritual development of major temples that serve as beacons of
                light.
              </p>
            </article>

            <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:col-span-8">
              <div className="grid gap-8 p-8 sm:grid-cols-2 sm:items-center sm:p-10 lg:gap-12">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Universal Outreach
                  </p>
                  <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                    Preaching Worldwide
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Traversing the globe with tireless energy, Guru Maharaja has
                    touched lives in over 50 countries, establishing communities
                    of practitioners and scholars alike.
                  </p>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-border">
                  <Image
                    src="/asset/heroAndGallery/03.webp"
                    alt="Global preaching"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Renounced order */}
      <section className="border-t border-border/60 bg-[#0a2540] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <Image
                  src="/asset/heroAndGallery/04.webp"
                  alt="Spiritual dedication"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -right-2 -top-2 flex h-28 w-28 items-center justify-center rounded-full bg-[#ff6b4a] p-3 text-center text-sm font-semibold leading-snug text-white shadow-lg sm:-right-4 sm:-top-4 sm:h-32 sm:w-32 sm:text-base">
                Lifelong Sacrifice
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                The Renounced Order:{" "}
                <span className="text-white/90">A Vow of Service</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-white/85">
                Accepting the Sannyasa order, Guru Maharaja formalized his total
                dedication to the service of Krishna and humanity. His life
                remains a living testimony to the power of renunciation coupled
                with active compassion.
              </p>
              <ul className="space-y-5">
                {[
                  "Unwavering adherence to the four regulative principles.",
                  "Authoring profound commentaries on Vedic scriptures.",
                  "Mentoring thousands of devotees in their spiritual path.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed sm:text-lg">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6b4a]"
                      aria-hidden
                    />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <figure className="relative overflow-hidden rounded-2xl border border-border bg-muted/40 p-10 shadow-sm sm:p-12 md:p-14">
            <Quote
              className="absolute right-8 top-8 h-14 w-14 text-[#0a2540]/15 sm:h-16 sm:w-16"
              aria-hidden
            />
            <blockquote className="relative text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              <p className="text-balance italic text-muted-foreground">
                &ldquo;Real success is not measured by the quantity of our
                achievements, but by the quality of our surrender to the divine
                will.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-8 text-base font-semibold text-foreground not-italic">
              — Guru Maharaja
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
};

export default About;
