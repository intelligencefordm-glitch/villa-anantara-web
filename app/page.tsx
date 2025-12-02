"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          STICKY HEADER (Desktop + Mobile)
      ========================= */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

          {/* LEFT — LOGO */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.svg"
              alt="Villa Anantara"
              className="h-10 w-auto"
            />
          </a>

          {/* CENTER — TITLE */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-white text-lg md:text-xl font-semibold tracking-wide">
              Villa Anantara
            </h1>
          </div>

          {/* RIGHT — DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-white text-sm font-medium">
            <a href="/" className="hover:text-gray-300">Home</a>
            <a href="/rooms" className="hover:text-gray-300">Rooms</a>
            <a href="/#check-availability" className="hover:text-gray-300">Check Availability</a>
            <a href="/contact" className="hover:text-gray-300">Contact</a>
          </nav>
        </div>

        {/* MOBILE NAV — SCROLLABLE */}
        <nav className="md:hidden overflow-x-auto no-scrollbar white-space-nowrap flex gap-6 px-4 py-2 text-white text-sm bg-black/30">
          <a href="/" className="hover:text-gray-300 whitespace-nowrap">Home</a>
          <a href="/rooms" className="hover:text-gray-300 whitespace-nowrap">Rooms</a>
          <a href="/#check-availability" className="hover:text-gray-300 whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="hover:text-gray-300 whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* push content below sticky header */}
      <div className="h-24"></div>

      {/* =========================
          HERO VIDEO + CENTERED TITLE
      ========================= */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black">
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">

          {/* LOGO ABOVE TITLE */}
          <img src="/images/logo.svg" alt="VA Logo" className="h-16 w-auto mb-4" />

          {/* TITLE */}
          <h2 className="text-white text-5xl md:text-7xl font-semibold leading-none">
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

          <p className="mt-4 text-gray-200/80">
            Luxury private full-villa farmstay near Raipur.
          </p>
        </div>
      </section>

      {/* =========================
          ROOMS SECTION (Restored)
      ========================= */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-6">Rooms</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <article className="border rounded-lg overflow-hidden shadow">
            <div className="h-44 bg-gray-100">
              <img src="/images/room1.jpg" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Master Suite</h3>
              <p className="text-sm text-gray-600 mt-2">King bed • Ensuite • Garden view</p>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden shadow">
            <div className="h-44 bg-gray-100">
              <img src="/images/room2.jpg" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Deluxe Room</h3>
              <p className="text-sm text-gray-600 mt-2">Queen bed • Balcony</p>
            </div>
          </article>

          <article className="border rounded-lg overflow-hidden shadow">
            <div className="h-44 bg-gray-100">
              <img src="/images/room3.jpg" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">Family Suite</h3>
              <p className="text-sm text-gray-600 mt-2">2 beds • Living area</p>
            </div>
          </article>
        </div>
      </section>

      {/* =========================
          AMENITIES (NEW)
      ========================= */}
      <section id="amenities" className="max-w-6xl mx-auto px-6 py-16 border-t">
        <h2 className="text-3xl font-semibold mb-8">Amenities</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              🌊
            </div>
            <span className="text-sm font-medium">Private Pool</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              🌿
            </div>
            <span className="text-sm font-medium">Spacious Lawn</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              🛏️
            </div>
            <span className="text-sm font-medium">3 Bedrooms</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              👥
            </div>
            <span className="text-sm font-medium">12 Guests</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              🚗
            </div>
            <span className="text-sm font-medium">Parking</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gray-50 shadow mb-2">
              🐾
            </div>
            <span className="text-sm font-medium">Pet Friendly</span>
          </div>

        </div>
      </section>

      {/* =========================
          ABOUT SECTION
      ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t">
        <h2 className="text-3xl font-semibold">About Villa Anantara</h2>
        <p className="mt-4 text-gray-700">
          Villa Anantara is a premium private farmhouse near Raipur designed
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
            <p className="mt-2 text-sm text-gray-300">Private luxury farmhouse near Raipur</p>
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
          FLOATING SOCIAL BUTTONS
      ========================= */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a
          href="https://www.instagram.com/villaanantara/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-105 transition"
        >
          <img src="/icons/instagram.png" className="w-8 h-8" />
        </a>

        <a
          href="https://wa.me/918889777288"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <img src="/icons/whatsapp.png" className="w-8 h-8" />
        </a>
      </div>

    </main>
  );
}
