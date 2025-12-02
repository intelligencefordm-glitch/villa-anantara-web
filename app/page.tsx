"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          NAV / optional logo small (transparent)
      ========================= */}
      <nav className="absolute top-4 left-0 w-full z-30 pointer-events-none">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center pointer-events-auto">
          <a href="/" className="flex items-center gap-3">
            <img src="/images/logo.svg" alt="Villa Anantara" className="h-10 w-auto" />
          </a>
        </div>
      </nav>

      {/* =========================
          HERO VIDEO + CENTERED TITLE + LOGO
      ========================= */}
      <header className="relative w-full h-[62vh] md:h-[78vh] overflow-hidden bg-black">
        {/* video */}
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

        {/* centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
          {/* logo above title */}
          <div className="mb-4">
            <img src="/images/logo.svg" alt="VA logo" className="h-14 w-auto" />
          </div>

          {/* title: V and A use futura, rest use poppins */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-semibold leading-none">
            {/* V - futura */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.02em", marginRight: "0.08em" }} // small positive gap to "illa"
            >
              V
            </span>

            {/* 'illa' - poppins */}
            <span
              className="font-poppins"
              style={{ marginRight: "0.16em" }} // small word gap
            >
              illa
            </span>

            {/* A - futura */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.02em", marginRight: "0.08em" }}
            >
              A
            </span>

            {/* 'nantara' - poppins */}
            <span className="font-poppins">
              nantara
            </span>
          </h1>

          {/* optional subtitle or CTA (small) */}
          <p className="mt-4 text-sm text-gray-200/80 max-w-xl">
            Luxury private farmhouse — full-venue rental near Raipur
          </p>
        </div>
      </header>

      {/* =========================
          ROOMS SECTION (restored)
      ========================= */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Rooms</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Room card 1 */}
          <article className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-44 bg-gray-100">
              <img src="/public/images/room1.jpg" alt="Room 1" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Master Suite</h3>
              <p className="text-sm text-gray-600 mt-2">King bed • Ensuite • Garden view</p>
            </div>
          </article>

          {/* Room card 2 */}
          <article className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-44 bg-gray-100">
              <img src="/public/images/room2.jpg" alt="Room 2" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Deluxe Room</h3>
              <p className="text-sm text-gray-600 mt-2">Queen bed • Shared balcony</p>
            </div>
          </article>

          {/* Room card 3 */}
          <article className="border rounded-lg overflow-hidden shadow-sm">
            <div className="h-44 bg-gray-100">
              <img src="/public/images/room3.jpg" alt="Room 3" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Family Suite</h3>
              <p className="text-sm text-gray-600 mt-2">2 beds • Living area</p>
            </div>
          </article>
        </div>
      </section>

      {/* =========================
          AMENITIES (NEW, above About)
      ========================= */}
      <section id="amenities" className="max-w-6xl mx-auto px-6 py-12 border-t">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Amenities</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              {/* replace with svg/icon */}
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v6"/></svg>
            </div>
            <div className="text-sm font-medium">Private Pool</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18"/></svg>
            </div>
            <div className="text-sm font-medium">Spacious Lawn</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div className="text-sm font-medium">3 Bedrooms</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/></svg>
            </div>
            <div className="text-sm font-medium">12 Guests</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3l18 18"/></svg>
            </div>
            <div className="text-sm font-medium">Parking</div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-gray-50 shadow-sm mb-2">
              <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l4 8h-8z"/></svg>
            </div>
            <div className="text-sm font-medium">Pet Friendly</div>
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
          CHECK AVAILABILITY placeholder (we will implement later)
      ========================= */}
      <section id="check-availability" className="max-w-6xl mx-auto px-6 py-12 border-t">
        <h2 className="text-2xl font-semibold mb-4">Check Availability</h2>
        <p className="text-gray-600">Quick booking and availability check will be added here.</p>
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

      {/* =========================
          FLOATING SOCIAL BUTTONS (WhatsApp + Instagram)
      ========================= */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a
          href="https://www.instagram.com/villaanantara/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-105 transition"
          aria-label="Instagram"
        >
          <img src="/icons/instagram.png" alt="Instagram" className="w-8 h-8" />
        </a>

        <a
          href="https://wa.me/918889777288"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:scale-105 transition"
          aria-label="WhatsApp"
        >
          <img src="/icons/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
        </a>
      </div>

    </main>
  );
}
