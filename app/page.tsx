"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>

      {/* =========================
          STICKY HEADER (Desktop + Mobile)
      ========================= */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{ backgroundColor: "#EFE5D5", borderBottom: "1px solid rgba(15,31,15,0.06)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

          {/* LEFT — LOGO */}
          <a href="/" className="flex items-center gap-3" aria-label="Villa Anantara home">
            <img
              src="/images/logo.jpg"
              alt="Villa Anantara logo"
              className="h-10 w-auto"
            />
          </a>

          {/* CENTER — TITLE (centered using absolute) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
            <h1 className="text-[#0F1F0F] text-lg md:text-xl font-semibold tracking-wide pointer-events-none">
              {/* Use same Futura + Poppins mix */}
              <span className="font-futura font-[500]" style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}>
                V
              </span>
              <span className="font-poppins" style={{ marginRight: "0.12em" }}>
                illa
              </span>
              <span className="font-futura font-[500]" style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}>
                A
              </span>
              <span className="font-poppins">nantara</span>
            </h1>
          </div>

          {/* RIGHT — DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-[#0F1F0F] text-sm font-medium">
            <a href="/" className="hover:opacity-80">Home</a>
            <a href="/rooms" className="hover:opacity-80">Rooms</a>
            <a href="/#check-availability" className="hover:opacity-80">Check Availability</a>
            <a href="/contact" className="hover:opacity-80">Contact</a>
          </nav>
        </div>

        {/* MOBILE NAV — SCROLLABLE */}
        <nav
          className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 text-[#0F1F0F] text-sm"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <a href="/" className="whitespace-nowrap">Home</a>
          <a href="/rooms" className="whitespace-nowrap">Rooms</a>
          <a href="/#check-availability" className="whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* spacer so page content sits below sticky header */}
      <div style={{ height: 88 }} />

      {/* =========================
          HERO VIDEO + CLEAN CENTERED TITLE
      ========================= */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        {/* Video */}
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* subtle dark overlay for contrast */
          /* keep overlay minimal so beige site bg still shows around sections */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35))" }} />

        {/* Centered clean title ONLY */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center z-10">
          <h2
            className="text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-none"
            style={{
              color: "#0F1F0F",
              textShadow: "0 10px 30px rgba(15,31,15,0.18)",
            }}
            aria-label="Villa Anantara"
          >
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.02em", marginRight: "0.08em" }}
            >
              V
            </span>

            <span
              className="font-poppins"
              style={{ marginRight: "0.18em" }}
            >
              illa
            </span>

            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.02em", marginRight: "0.08em" }}
            >
              A
            </span>

            <span className="font-poppins">nantara</span>
          </h2>
        </div>
      </section>

      {/* =========================
          ROOMS SECTION (Restored)
      ========================= */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-6 text-[#0F1F0F]">Rooms</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <article className="border rounded-lg overflow-hidden shadow-sm bg-white/60">
            <div className="h-44 bg-gray-100">
              <img src="/images/room1.jpg" alt="Master Suite" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#0F1F0F]">Master Suite</h3>
              <p className="text-sm text-[#4a4a4a] mt-2">King bed • Ensuite • Garden view</p>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden shadow-sm bg-white/60">
            <div className="h-44 bg-gray-100">
              <img src="/images/room2.jpg" alt="Deluxe Room" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#0F1F0F]">Deluxe Room</h3>
              <p className="text-sm text-[#4a4a4a] mt-2">Queen bed • Balcony</p>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden shadow-sm bg-white/60">
            <div className="h-44 bg-gray-100">
              <img src="/images/room3.jpg" alt="Family Suite" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#0F1F0F]">Family Suite</h3>
              <p className="text-sm text-[#4a4a4a] mt-2">2 beds • Living area</p>
            </div>
          </article>
        </div>
      </section>

      {/* =========================
          AMENITIES (NEW)
      ========================= */}
      <section id="amenities" className="max-w-6xl mx-auto px-6 py-16 border-t" style={{ borderColor: "rgba(15,31,15,0.06)" }}>
        <h2 className="text-3xl font-semibold mb-8 text-[#0F1F0F]">Amenities</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              🌊
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">Private Pool</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              🌿
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">Spacious Lawn</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              🛏️
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">3 Bedrooms</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              👥
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">12 Guests</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              🚗
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">Parking</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white shadow mb-2">
              🐾
            </div>
            <span className="text-sm font-medium text-[#0F1F0F]">Pet Friendly</span>
          </div>

        </div>
      </section>

      {/* =========================
          ABOUT SECTION
      ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: "rgba(15,31,15,0.06)" }}>
        <h2 className="text-3xl font-semibold text-[#0F1F0F]">About Villa Anantara</h2>
        <p className="mt-4 text-[#4a4a4a] leading-relaxed">
          Villa Anantara is a premium private farmhouse stay near Raipur designed
          to offer tranquility, comfort, and a luxurious experience. Rooms are
          shown for information only — the property is rented as a full villa.
        </p>
      </section>

      {/* =========================
          (Removed bottom Check Availability placeholder as requested)
      ========================= */}

      {/* =========================
          FOOTER (matches header style)
      ========================= */}
      <footer className="mt-20" style={{ backgroundColor: "#EFE5D5", borderTop: "1px solid rgba(15,31,15,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-14 text-[#0F1F0F]">

          <div>
            <h3 className="text-xl font-semibold">Villa Anantara</h3>
            <p className="mt-2 text-sm text-[#4a4a4a]">Private luxury farmhouse near Raipur</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Find Help</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy & Terms</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:underline">Privacy Center</a></li>
              <li><a href="/refund" className="hover:underline">Refund Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/rooms" className="hover:underline">Rooms</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="text-center py-4 text-xs text-[#4a4a4a]">
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
          className="w-14 h-14 rounded-full bg-[#0F1F0F] shadow-lg flex items-center justify-center hover:scale-105 transition"
          aria-label="WhatsApp"
        >
          <img src="/icons/whatsapp.png" alt="WhatsApp" className="w-8 h-8 invert" />
        </a>
      </div>

    </main>
  );
}
