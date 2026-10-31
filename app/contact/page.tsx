import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";
  const mapUrl = process.env.NEXT_PUBLIC_MAP_URL ?? "https://maps.app.goo.gl/8YsEquuszcbJCMHW6";
  const wa = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <main className="bg-sand">
      <SiteHeader />

      <section className="relative flex h-[45vh] items-center justify-center pt-16">
        <img src="/images/contact-hero.jpg" alt="Contact Villa Anant" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 font-display text-5xl text-white md:text-7xl">Contact Us</h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-4xl md:text-5xl">We&apos;re here to help</h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Whether you&apos;re planning a weekend getaway, a family stay, or a small celebration, our team is happy to help with bookings, pricing, availability and special requests.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-cream p-6">
            <h3 className="font-display text-2xl">Phone &amp; WhatsApp</h3>
            <p className="mt-2 text-ink/70">{whatsapp}</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-white">Message on WhatsApp</a>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-cream p-6">
            <h3 className="font-display text-2xl">Location</h3>
            <p className="mt-2 text-ink/70">Villa Anant<br />Near Raipur, Chhattisgarh</p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-full border border-ink px-5 py-2.5 text-sm font-medium transition hover:bg-ink hover:text-white">Open in Maps</a>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-cream p-6">
            <h3 className="font-display text-2xl">Hours</h3>
            <p className="mt-2 text-ink/70">Front Desk: 9 AM – 8 PM<br />Bookings: 24/7 on WhatsApp</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="font-display text-3xl">Ready to plan your stay?</h3>
          <p className="mt-2 text-ink/70">Message us anytime for availability.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-clay px-8 py-3.5 font-medium text-white">Book via WhatsApp</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
