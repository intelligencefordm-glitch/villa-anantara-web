import Link from "next/link";

const WHATSAPP = "https://wa.me/918889777288";

export default function SiteFooter() {
  return (
    <>
      <footer className="bg-[#0f160f] px-6 pb-8 pt-16 text-[15px] text-[#e9e0cf]">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-3xl">Villa Anant</div>
            <p className="mt-2 max-w-xs opacity-80">
              A private luxury villa in Raipur. Front desk 9 AM – 8 PM, bookings
              24/7 on WhatsApp.
            </p>
          </div>

          <FooterCol title="Explore">
            <Link href="/">Home</Link>
            <Link href="/rooms">The Villa</Link>
            <Link href="/check">Check Availability</Link>
            <Link href="/contact">Contact</Link>
          </FooterCol>

          <FooterCol title="Policies">
            <Link href="/privacy">Privacy Center</Link>
            <Link href="/refund">Refund &amp; Cancellation</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </FooterCol>

          <FooterCol title="Connect">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://www.instagram.com/villa.anant/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://maps.app.goo.gl/hSb7pNL1UYaCx6ep6" target="_blank" rel="noopener noreferrer">View on map</a>
          </FooterCol>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-5 text-xs opacity-60">
          © {new Date().getFullYear()} Villa Anant
        </div>
      </footer>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25a35a] shadow-xl transition hover:scale-105"
      >
        <img src="/icons/whatsapp.png" alt="" className="h-7 w-7 invert" />
      </a>
    </>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 [&_a]:opacity-85 [&_a:hover]:opacity-100">
      <h4 className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-[#d9a07a]">
        {title}
      </h4>
      {children}
    </div>
  );
}
