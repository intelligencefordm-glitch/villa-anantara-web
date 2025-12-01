"use client";
import React from "react";

export default function Home() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";
  const mapUrl =
    process.env.NEXT_PUBLIC_MAP_URL ??
    "https://maps.app.goo.gl/dNiPHToeJaQQFf3e9";

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          HERO VIDEO (Works on Desktop + Mobile + iOS)
         ========================= */}
      <header className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black">
        <video
          src="/videos/hero.mp4"
          poster="/images/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          // iOS safety
          webkit-playsinline="true"
          // Prevent desktop browsers from pausing on load
          onCanPlay={(e) => {
            const v = e.currentTarget;
            if (v.paused) v.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Fallback */}
        <noscript>
          <img
            src="/images/hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero"
          />
        </noscript>
      </header>

      {/* =========================
          QUICK INFO SECTION
         ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold text-gray-900">Villa Anantara</h2>
            <p className="mt-4 text-gray-700">
              A private luxury farmhouse near Raipur — peaceful, private and full-venue only.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-medium">Capacity</h3>
              <p className="text-sm text-gray-600">Up to 12 guests • 3 bedrooms</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-medium">Deposit</h3>
              <p className="text-sm text-gray-600">20% advance • rest at check-in</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT SECTION
         ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t">
        <h2 className="text-2xl font-semibold text-gray-900">About Villa Anantara</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Villa Anantara is a premium private farmhouse stay near Raipur designed
          to offer tranquility, comfort, and a luxurious experience. Rooms are
          shown for information only — the property is rented as a full villa.
        </p>
      </section>

      {/* =========================
          FOOTER
         ========================= */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-14">
          
          {/* BRAND + MAP */}
          <div>
            <h3 className="text-xl font-semibold">Villa Anantara</h3>
            <p className="mt-2 text-sm text-gray-300">
              Private luxury farmhouse near Raipur
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="rounded-lg overflow-hidden shadow border w-40">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.324276774168!2d81.65166437530348!3d21.255514479998443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28ddd262d23f09%3A0xa990e58aae55ee4f!2sVilla%20Anantara!5e0!3m2!1sen!2sin!4v1701101200000!5m2!1sen!2sin"
                  width="100%"
                  height="100"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-medium hover:text-gray-300"
              >
                View on map
              </a>
            </div>
          </div>

          {/* FIND HELP */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Find Help</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/contact" className="hover:text-white">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* PRIVACY */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy & Terms</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/privacy" className="hover:text-white">Privacy Center</a></li>
              <li><a href="/refund" className="hover:text-white">Refund Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/rooms" className="hover:text-white">Rooms</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center py-4 text-xs text-gray-400 border-t border-white/10">
          © {new Date().getFullYear()} Villa Anantara
        </div>
      </footer>

    </main>
  );
}
