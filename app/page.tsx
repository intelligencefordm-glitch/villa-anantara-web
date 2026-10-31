import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const ROOMS = [
  { name: "The Oak Haven", img: "/rooms/room1-1.jpg", text: "A spacious master bedroom with warm wood tones, natural textures and a cosy ambience. Designed for peaceful, luxurious rest." },
  { name: "The Terra Studio", img: "/rooms/room2-1.jpg", text: "Earthy tones, artistic ceiling lines and a serene vibe create a relaxing environment ideal for unwinding." },
  { name: "The Moonstone Suite", img: "/rooms/room3-1.jpg", text: "Soft lighting, rich textures and a warm atmosphere define this premium suite for restful nights and cosy mornings." },
];

const GALLERY = [
  { src: "/villa/anantara3.webp", cls: "md:col-span-2 md:row-span-2" },
  { src: "/villa/anantara10.webp", cls: "" },
  { src: "/villa/anantara13.webp", cls: "" },
  { src: "/videos/hero-poster.jpg", cls: "md:col-span-2" },
  { src: "/villa/anantara5.webp", cls: "" },
  { src: "/villa/anantara8.webp", cls: "" },
];

const OCCASIONS = [
  ["Weekend Stays", "Unplug from the city and slow right down."],
  ["Family Time", "Space for everyone, with total privacy."],
  ["Celebrations", "Birthdays and special occasions, your way."],
  ["Quiet Retreats", "Pool, garden and silence, all yours."],
];

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`text-xs font-medium uppercase tracking-[0.28em] ${light ? "text-[#f0c9ad]" : "text-clay"}`}>
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="bg-sand">
      <SiteHeader />

      {/* HERO */}
      <section className="relative flex min-h-screen items-end overflow-hidden text-white">
        <img src="/villa/anantara1.webp" alt="Villa Anant at sunset with its private pool" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/75" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 md:pb-32">
          <Eyebrow light>Raipur, Chhattisgarh</Eyebrow>
          <h1 className="mb-5 mt-3 max-w-[11ch] font-display text-5xl leading-[1.05] md:text-8xl">
            Pause. Breathe. Reconnect.
          </h1>
          <p className="mb-8 max-w-lg text-lg opacity-90">
            A private luxury villa wrapped in farmhouse calm, made for slow weekends and celebrations worth remembering.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/check" className="rounded-full bg-clay px-7 py-3.5 font-medium transition hover:-translate-y-0.5">
              Check Villa Availability
            </Link>
            <Link href="/rooms" className="rounded-full border border-white/70 px-7 py-3.5 font-medium transition hover:bg-white/10">
              Explore the villa
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 border-b border-ink/10 md:grid-cols-4">
        {[["Entire villa", "Exclusively yours"], ["3", "Designer rooms"], ["Farmhouse", "Calm, near Raipur"], ["Celebrate", "Occasions & stays"]].map(([a, b]) => (
          <div key={a} className="border-ink/10 px-4 py-7 text-center md:border-r md:last:border-0">
            <b className="block font-display text-3xl font-medium text-clay">{a}</b>
            <span className="text-xs uppercase tracking-widest text-ink/60">{b}</span>
          </div>
        ))}
      </section>

      {/* ABOUT */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <Eyebrow>About the villa</Eyebrow>
          <h2 className="mb-5 mt-3 font-display text-4xl md:text-6xl">More than a stay, a place to pause</h2>
          <p className="mb-4 text-ink/70">
            Set amid peaceful natural surroundings in Raipur, Villa Anant blends modern comfort with serene farmhouse charm.
          </p>
          <p className="mb-8 text-ink/70">
            Whether you&apos;re celebrating a special occasion or escaping the noise of everyday life, it&apos;s a private, luxurious retreat designed to make every moment unforgettable.
          </p>
          <Link href="/check" className="rounded-full bg-clay px-7 py-3.5 font-medium text-white">Plan your stay</Link>
        </div>
        <img src="/villa/anantara7.webp" alt="Light-filled living room" loading="lazy" className="h-[420px] w-full rounded-t-[220px] rounded-b-2xl object-cover md:h-[560px]" />
      </section>

      {/* ROOMS */}
      <section className="border-y border-ink/10 bg-cream px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <Eyebrow>Inside the villa</Eyebrow>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">Three rooms, three moods</h2>
            <p className="mt-4 text-ink/70">
              Villa Anant is booked as a whole, so every room, the pool and the grounds are exclusively yours.
            </p>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {ROOMS.map((r) => (
              <article key={r.name} className="group overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-display text-3xl">{r.name}</h3>
                  <p className="text-[15px] text-ink/70">{r.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/rooms" className="text-sm font-medium uppercase tracking-widest text-clay">See all photos →</Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">Golden hour, every hour</h2>
        </div>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3.5 md:auto-rows-[230px] md:grid-cols-4">
          {GALLERY.map((g) => (
            <img key={g.src} src={g.src} alt="Villa Anant" loading="lazy" className={`h-full w-full rounded-xl object-cover ${g.cls}`} />
          ))}
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="border-y border-ink/10 bg-cream px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Eyebrow>Occasions</Eyebrow>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">Made for the moments that matter</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {OCCASIONS.map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-ink/10 bg-sand p-7">
                <h3 className="mb-2 font-display text-2xl">{t}</h3>
                <p className="text-[15px] text-ink/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-32 text-center text-white">
        <img src="/videos/hero-poster.jpg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10">
          <Eyebrow light>Ready when you are</Eyebrow>
          <h2 className="mb-7 mt-3 font-display text-5xl md:text-7xl">Plan your stay at Villa Anant</h2>
          <Link href="/check" className="rounded-full bg-clay px-8 py-4 font-medium">Check Villa Availability</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
