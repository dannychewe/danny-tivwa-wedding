import Image from "next/image";
import { Countdown } from "@/components/countdown";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const weddingDate = "2026-09-20T12:00:00+02:00";

const storyMoments = [
  {
    title: "The Beginning",
    copy:
      "What started as an easy conversation became a deep friendship, then a steady love built on grace, joy, and intention."
  },
  {
    title: "Growing Together",
    copy:
      "Through every season, we learned that the quiet moments matter most: shared prayers, late-night laughter, and choosing each other daily."
  },
  {
    title: "Forever Ahead",
    copy:
      "Now we look forward to a life shaped by faith, family, and a home full of warmth. We would be honored to celebrate this beginning with you."
  }
];

const details = [
  {
    title: "Ceremony",
    value: "Parkview SDA Church",
    meta: "Sunday, 20 September 2026 • 08:30"
  },
  {
    title: "Lunch",
    value: "Daffodils Events",
    meta: "Lunch begins at 1:00 PM"
  },
  {
    title: "Dress Code",
    value: "Earth Tones & Black",
    meta: "Shades of brown, earth colors, and black especially for men"
  }
];

const dressCodePalette = [
  { name: "Chocolate", color: "#4A2F24" },
  { name: "Coffee", color: "#6B4A35" },
  { name: "Taupe", color: "#9A806A" },
  { name: "Beige", color: "#E6D6BD" },
  { name: "Champagne", color: "#EFE2C8" },
  { name: "Sand", color: "#D8C4A8" },
  { name: "Camel", color: "#C19A6B" },
  { name: "Mocha", color: "#8B6F5A" },
  { name: "Black", color: "#111111" }
];

const gifts = [
  "Your presence is the most meaningful gift to us.",
  "If you would like to bless us further, contributions toward our first home and future together will be deeply appreciated.",
  "Gift arrangements and account details can be shared directly with the family on request."
];

const galleryImages = [
  { src: "/gallery-1.svg", alt: "Danny and Filoza portrait illustration" },
  { src: "/gallery-2.svg", alt: "Romantic floral composition" },
  { src: "/gallery-3.svg", alt: "Elegant wedding table setting" },
  { src: "/gallery-4.svg", alt: "Soft candlelit wedding mood board" },
  { src: "/gallery-5.svg", alt: "Modern venue architecture illustration" },
  { src: "/gallery-6.svg", alt: "Minimal couple monogram artwork" }
];

export default function Home() {
  return (
    <main className="overflow-x-hidden pb-24 md:pb-0">
      <section className="relative isolate min-h-[100svh] bg-heroGlow">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(200,169,106,0.18),transparent_55%)]" />
        <div className="section-shell flex min-h-[100svh] flex-col justify-between pb-20 pt-4 sm:pb-28 sm:pt-6">
          <header className="py-4">
            <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.22em] text-ink/60 sm:text-sm sm:tracking-[0.35em]">
              Danny & Filoza
            </div>
            <nav className="hidden gap-6 text-sm text-ink/70 md:flex">
              <a href="#story" className="transition hover:text-ink">
                Story
              </a>
              <a href="#details" className="transition hover:text-ink">
                Details
              </a>
              <a href="#gallery" className="transition hover:text-ink">
                Gallery
              </a>
              <a href="#rsvp" className="transition hover:text-ink">
                RSVP
              </a>
            </nav>
            </div>
            <nav className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-ink/65 md:hidden">
              <a
                href="#story"
                className="rounded-full border border-gold/20 bg-white/60 px-2 py-2"
              >
                Story
              </a>
              <a
                href="#details"
                className="rounded-full border border-gold/20 bg-white/60 px-2 py-2"
              >
                Details
              </a>
              <a
                href="#gallery"
                className="rounded-full border border-gold/20 bg-white/60 px-2 py-2"
              >
                Gallery
              </a>
              <a
                href="#rsvp"
                className="rounded-full border border-gold/20 bg-white/60 px-2 py-2"
              >
                RSVP
              </a>
            </nav>
          </header>

          <div className="grid items-center gap-10 py-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">A Celebration Of Love</p>
              <h1 className="mt-5 text-5xl leading-[0.95] text-ink sm:mt-6 sm:text-6xl lg:text-7xl">
                Danny
                <span className="mx-2 inline-block text-gold sm:mx-3">&</span>
                Filoza
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-ink/72 sm:text-lg">
                We invite you to witness the beginning of our forever. Join us for
                an elegant day of love, vows, and celebration.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#rsvp"
                  className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90"
                >
                  RSVP Now
                </a>
                <a
                  href="#details"
                  className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-white/60 px-7 py-3 text-sm font-semibold text-ink transition hover:border-gold"
                >
                  View Details
                </a>
              </div>
            </Reveal>

            <Reveal delayMs={150}>
              <div className="card-surface relative overflow-hidden p-5 sm:p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <p className="text-sm uppercase tracking-[0.3em] text-ink/55">
                  Countdown To Our Day
                </p>
                <div className="mt-6">
                  <Countdown targetDate={weddingDate} />
                </div>
                <div className="gold-divider my-8" />
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-ink/55">Wedding Date</p>
                    <p className="mt-1 text-lg font-medium text-ink sm:text-xl">
                      20 September 2026
                    </p>
                  </div>
                  <div className="self-start rounded-full border border-gold/25 px-4 py-2 text-sm text-ink/70">
                    Lusaka, Zambia
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="story" className="section-shell py-16 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title="A love shaped by friendship, faith, and quiet certainty."
            description="Every meaningful chapter of our journey has drawn us closer, and this celebration marks the next beautiful step."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {storyMoments.map((moment, index) => (
            <Reveal key={moment.title} delayMs={index * 120}>
              <article className="card-surface h-full p-6 sm:p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-gold">
                  0{index + 1}
                </p>
                <h3 className="mt-5 text-2xl text-ink">{moment.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/70">{moment.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="details" className="section-shell py-16 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Wedding Details"
            title="Everything you need for the day."
            description="A refined celebration is in the details. Here is what to expect and how to plan for the occasion."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {details.map((detail, index) => (
            <Reveal key={detail.title} delayMs={index * 120}>
              <article className="card-surface h-full p-6 sm:p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-gold">
                  {detail.title}
                </p>
                <h3 className="mt-4 text-2xl text-ink">{detail.value}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">{detail.meta}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={140} className="mt-8">
          <div className="card-surface p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="eyebrow">Dress Code Palette</p>
                <h3 className="mt-4 text-2xl text-ink sm:text-3xl">
                  Warm, grounded, and elegant.
                </h3>
                <p className="mt-4 text-sm leading-7 text-ink/70">
                  Kindly come dressed in shades of brown and earth colors. Black
                  is especially welcome for men.
                </p>
                <p className="mt-3 rounded-2xl border border-gold/15 bg-cream px-4 py-3 text-sm font-medium leading-6 text-ink/70">
                  Kindly avoid white garments, as white is reserved for the
                  bride.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dressCodePalette.map((swatch) => (
                  <div
                    key={swatch.name}
                    className="overflow-hidden rounded-2xl border border-gold/15 bg-white/70"
                  >
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <p className="px-3 py-2 text-xs font-semibold text-ink/65">
                      {swatch.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={160} className="mt-10">
          <div className="card-surface overflow-hidden">
            <div className="border-b border-gold/15 p-5 sm:p-8">
              <p className="eyebrow">Venue Guide</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <h3 className="text-2xl leading-tight text-ink sm:text-3xl">
                  Two beautiful stops for the day.
                </h3>
                <p className="text-sm leading-7 text-ink/70 sm:text-base">
                  We will begin with the ceremony at Parkview SDA Church, then
                  continue to Daffodils Events for lunch. Please plan your travel
                  with enough time between venues.
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-8 xl:grid-cols-2">
              <article className="overflow-hidden rounded-3xl border border-gold/15 bg-cream/70">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">
                        Ceremony
                      </p>
                      <h4 className="mt-3 text-2xl text-ink">
                        Parkview SDA Church
                      </h4>
                    </div>
                    <div className="w-fit rounded-full border border-gold/25 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/70">
                      08:30
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-ink/65">
                    Please arrive 30 minutes before the ceremony so everyone can
                    be seated before the service begins.
                  </p>
                </div>
                <div className="border-t border-gold/15">
                  <iframe
                    title="Parkview SDA Church map"
                    src="https://www.google.com/maps?q=Parkview%20SDA%20Church%20Lusaka&z=14&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-72 w-full sm:h-80"
                  />
                </div>
              </article>

              <article className="overflow-hidden rounded-3xl border border-gold/15 bg-white/70">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">
                        Lunch
                      </p>
                      <h4 className="mt-3 text-2xl text-ink">
                        Daffodils Events
                      </h4>
                    </div>
                    <div className="w-fit rounded-full border border-gold/25 bg-cream px-4 py-2 text-sm font-semibold text-ink/70">
                      1:00 PM
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-ink/65">
                    Lunch will follow after the ceremony. Kindly make your way
                    to Daffodils Events after the church service.
                  </p>
                </div>
                <div className="border-t border-gold/15">
                  <iframe
                    title="Daffodils Events map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1061.2378399195659!2d28.269388757478048!3d-15.294736574138465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19405f0003bc2a03%3A0x2e692f3167ddc05!2sDaffodils%20Events!5e1!3m2!1sen!2szm!4v1785837567612!5m2!1sen!2szm"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-72 w-full sm:h-80"
                  />
                </div>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="gallery" className="section-shell py-16 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            title="A glimpse into the mood of our celebration."
            description="An airy visual story inspired by romance, candlelight, florals, and timeless elegance."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          {galleryImages.map((image, index) => (
            <Reveal key={image.src} delayMs={index * 80}>
              <div className="card-surface overflow-hidden rounded-3xl sm:rounded-[1.75rem]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1000}
                  className="h-auto w-full object-cover transition duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="rsvp" className="section-shell py-16 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="RSVP"
              title="Kindly confirm your attendance."
              description="To help us prepare well for the celebration, please respond before the RSVP deadline."
            />
            <div className="mt-8 card-surface p-6">
              <p className="text-sm leading-7 text-ink/70">
                If you received a personal invitation link, please use it to
                accept or decline your invitation.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="card-surface p-6 sm:p-8">
              <div className="grid gap-5">
                <div className="rounded-3xl border border-gold/15 bg-cream p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">
                    RSVP Deadline
                  </p>
                  <p className="mt-3 text-2xl text-ink">5 September 2026</p>
                  <p className="mt-2 text-sm leading-7 text-ink/65">
                    Kindly confirm before this date so that seating and meal
                    arrangements can be prepared in good time.
                  </p>
                </div>

                <div className="rounded-3xl border border-gold/15 bg-white/60 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">
                    RSVP Number
                  </p>
                  <a
                    href="tel:+260972411995"
                    className="mt-3 block text-2xl text-ink transition hover:text-gold"
                  >
                    +260 972 411 995
                  </a>
                  <p className="mt-2 text-sm leading-7 text-ink/65">
                    For inquiries or assistance with your invitation, please
                    contact us using this number.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell py-16 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Gifts"
            title="Your presence is our greatest gift."
            description="Should you wish to honor us with a gift, here is our preference."
          />
        </Reveal>

        <div className="mt-10 grid gap-5">
          {gifts.map((item, index) => (
            <Reveal key={item} delayMs={index * 100}>
              <div className="card-surface flex gap-4 p-6 sm:items-center sm:p-7">
                <span className="mt-1 text-gold sm:mt-0">0{index + 1}</span>
                <p className="text-sm leading-7 text-ink/70 sm:text-base">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-gold/15 pb-28 pt-10 md:py-10">
        <div className="section-shell flex flex-col gap-3 text-center sm:text-left">
          <p className="text-xl text-ink">Danny & Filoza</p>
          <p className="text-xs uppercase tracking-[0.18em] text-ink/45 sm:text-sm sm:tracking-[0.25em]">
            September 20, 2026 • Lusaka
          </p>
          <p className="text-sm text-ink/55">
            Thank you for celebrating this new beginning with us.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
        <a
          href="#rsvp"
          className="block rounded-full bg-ink px-6 py-4 text-center text-sm font-semibold text-cream shadow-soft"
        >
          RSVP To Celebrate
        </a>
      </div>
    </main>
  );
}






