"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          HERO VIDEO + CENTERED TITLE
      ========================= */}
      <header className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black">
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h1 className="text-white text-5xl md:text-7xl font-semibold leading-none">

            {/* V (Futura) */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.03em", marginRight: "-0.045em" }}
            >
              V
            </span>

            {/* illa (Poppins) */}
            <span
              className="font-poppins"
              style={{ marginLeft: "-0.035em" }}
            >
              illa
            </span>

            {/* space */}
            <span style={{ margin: "0 0.12em" }} />

            {/* A (Futura) */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.03em", marginRight: "-0.045em" }}
            >
              A
            </span>

            {/* nantara (Poppins) */}
            <span
              className="font-poppins"
              style={{ marginLeft: "-0.035em" }}
            >
              nantara
            </span>

          </h1>
        </div>
      </header>

      {/* =========================
          QUICK INFO SECTION
      ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold">Villa Anantara</h2>
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
          
          <div>
            <h3 className="text-xl font-semibold">Villa Anantara</h3>
            <p className="mt-2 text-sm text-gray-300">
              Private luxury farmhouse near Raipur
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Find Help</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy & Terms</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/privacy" className="hover:text-white">Privacy Center</a></li>
              <li><a href="/refund" className="hover:text-white">Refund Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>

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
