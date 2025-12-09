"use client";

import React, { useState, useEffect } from "react";

const MOCHA = "#C29F80";

// Slideshow images
const SLIDES = Array.from(
  { length: 15 },
  (_, i) => `/villa/anantara${i + 1}.webp`
);

// ---------------- Slideshow Component ----------------
function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % SLIDES.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        relative mx-auto 
        w-full max-w-6xl 
        h-[500px] md:h-[650px] 
        overflow-hidden 
        rounded-xl shadow-lg bg-[#ddd]
      "
    >
      {SLIDES.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`
            absolute inset-0 
            w-full h-full 
            object-cover 
            transition-opacity duration-[1200ms]
            ${index === i ? "opacity-100" : "opacity-0"}
          `}
          onError={() => console.error("Failed to load:", img)}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------- Main Page ----------------
export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>
      
      {/* HEADER */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          backgroundColor: MOCHA,
          borderBottom: "1px solid rgba(0,0,0,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Villa Anantara Logo"
              className="h-10 w-auto"
            />
          </a>

          {/* Center Title */}
          <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            <h1
              className="text-white text-lg md:text-xl tracking-wide"
              style={{ fontFamily: "var(--font-abigail)" }}
            >
              Villa Anantara
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-white text-sm font-bold">
            <a href="/" className="hover:opacity-80">Home</a>
            <a href="/rooms" className="hover:opacity-80">Rooms</a>
            <a href="/check" className="hover:opacity-80">Check Availability</a>
            <a href="/contact" className="hover:opacity-80">Contact</a>
          </nav>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 text-white text-sm font-bold">
          <a href="/" className="whitespace-nowrap">Home</a>
          <a href="/rooms" className="whitespace-nowrap">Rooms</a>
          <a href="/check" className="whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "110px" }} />

      {/* HERO VIDEO */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </section>

      {/* SLIDESHOW */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold text-[#0F1F0F] mb-6">
          Villa Anantara
        </h2>

        <Slideshow />

        {/* BOOK NOW BUTTON */}
        <a
          href="/check"
          className="mt-8 inline-block px-8 py-3 bg-[#0F1F0F] text-white rounded-lg text-lg shadow hover:scale-105 transition"
        >
          Book Now
        </a>
      </section>

      {/* ABOUT SECTION */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 border-t"
        style={{ borderColor: "rgba(15,31,15,0.08)" }}
      >
        <h2 className="text-3xl font-semibold text-[#0F1F0F]">
          About Villa Anantara
        </h2>

        <p className="mt-4 text-[#4a4a4a] leading-relaxed text-lg">
          <strong>Villa Anantara is crafted for those who seek more than just a stay — it is a place to pause, breathe, and reconnect.</strong>
          <br /><br />
          Set amidst peaceful natural surroundings in Raipur, the villa blends modern comfort with serene farmhouse charm. 
          Whether you're celebrating a special occasion or escaping the noise of everyday life, 
          Villa Anantara offers a private, luxurious retreat designed to make every moment unforgettable.
        </p>
      </section>

      {/* FOOTER */}
      <footer
        className="mt-20"
        style={{
          backgroundColor: MOCHA,
          color: "white",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-14">

          {/* MINI MAP */}
          <div>
            <a
              href="https://maps.app.goo.gl/hSb7pNL1UYaCx6ep6"
              target="_blank"
              className="block w-40 rounded-lg overflow-hidden shadow border border-white/20 mb-4"
            >
              <img
                src="/images/minimap.png"
                className="w-full h-28 object-cover"
                alt="Google Map"
              />
            </a>

            <a
              href="https://maps.app.goo.gl/hSb7pNL1UYaCx6ep6"
              target="_blank"
              className="underline font-bold hover:opacity-80"
            >
              View on map
            </a>
          </div>

          {/* HELP */}
          <div>
            <h3 className="text-lg font-bold mb-4">Find Help</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:opacity-80">Contact Us</a></li>
            </ul>
          </div>

          {/* TERMS */}
          <div>
            <h3 className="text-lg font-bold mb-4">Privacy & Terms</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:opacity-80">Privacy Center</a></li>
              <li><a href="/refund" className="hover:opacity-80">Refund & Cancellation</a></li>
              <li><a href="/terms" className="hover:opacity-80">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:opacity-80">Home</a></li>
              <li><a href="/rooms" className="hover:opacity-80">Rooms</a></li>
              <li><a href="/check" className="hover:opacity-80">Check Availability</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center py-4 text-xs text-white/80">
          © {new Date().getFullYear()} Villa Anantara
        </div>
      </footer>

      {/* FLOATING ICONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/villa.anantara/"
          target="_blank"
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-105 transition"
        >
          <img src="/icons/instagram.png" className="w-8 h-8" />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/918889777288?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20Villa%20Anantara."
          target="_blank"
          className="w-14 h-14 rounded-full bg-[#0F1F0F] shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <img src="/icons/whatsapp.png" className="w-8 h-8 invert" />
        </a>

      </div>

    </main>
  );
}