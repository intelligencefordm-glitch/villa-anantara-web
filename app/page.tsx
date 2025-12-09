"use client";
import React, { useEffect, useState } from "react";

const SLIDES = Array.from({ length: 15 }, (_, i) => `/villa/anantara${i + 1}.jpg`);

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>
      {/* =========================
          HEADER
      ========================= */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          backgroundColor: "#C29F80",
          borderBottom: "1px solid rgba(0,0,0,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* LOGO */}
          <a href="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Villa Anantara Logo" className="h-10 w-auto" />
          </a>

          {/* CENTER TITLE */}
          <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            <h1
              className="text-white text-lg md:text-xl tracking-wide"
              style={{ fontFamily: "var(--font-abigail)" }}
            >
              Villa Anantara
            </h1>
          </div>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-6 text-white text-sm font-bold">
            <a href="/" className="hover:opacity-80">Home</a>
            <a href="/rooms" className="hover:opacity-80">Rooms</a>
            <a href="/check" className="hover:opacity-80">Check Availability</a>
            <a href="/contact" className="hover:opacity-80">Contact</a>
          </nav>
        </div>

        {/* MOBILE NAV */}
        <nav className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 text-white text-sm font-bold">
          <a href="/" className="whitespace-nowrap">Home</a>
          <a href="/rooms" className="whitespace-nowrap">Rooms</a>
          <a href="/check" className="whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* Spacer */}
      <div style={{ height: "110px" }} />

      {/* =========================
          SLIDESHOW
      ========================= */}
      <section className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h2 className="text-3xl font-semibold text-[#0F1F0F] mb-6">
          Villa Anantara
        </h2>

        <Slideshow />

        {/* BOOK NOW BUTTON */}
        <a
          href="/check"
          className="mt-6 inline-block bg-[#0F1F0F] text-white px-6 py-3 rounded-lg shadow hover:opacity-90 transition"
        >
          Book Now
        </a>
      </section>

      {/* =========================
          ABOUT SECTION
      ========================= */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 border-t"
        style={{ borderColor: "rgba(15,31,15,0.08)" }}
      >
        <h2 className="text-3xl font-semibold text-[#0F1F0F]">
          About Villa Anantara
        </h2>
        <p className="mt-4 text-[#4a4a4a] leading-relaxed">
          Villa Anantara is a premium private farmhouse stay near Raipur designed
          to offer tranquility, comfort, and a luxurious experience.
        </p>
      </section>

      {/* FOOTER */}
      <Footer />
      <FloatingButtons />
    </main>
  );
}

function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % SLIDES.length),
      3000 // 3 seconds
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-4xl h-72 md:h-[450px] overflow-hidden rounded-xl shadow-lg">
      {SLIDES.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-20" style={{ backgroundColor: "#C29F80", color: "white" }}>
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-14">
        {/* MAP */}
        <div>
          <a
            href="https://maps.app.goo.gl/hSb7pNL1UYaCx6ep6?g_st=ic"
            target="_blank"
            className="block w-40 rounded-lg overflow-hidden shadow border border-white/20 mb-4"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.324276774168!2d81.65166437530348!3d21.255514479998443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28ddd262d23f09%3A0xa990e58aae55ee4f!2sVilla%20Anantara!5e0!3m2!1sen!2sin!4v1701101200000!5m2!1sen!2sin"
              width="100%"
              height="120"
              loading="lazy"
            ></iframe>
          </a>

          <a
            href="https://maps.app.goo.gl/hSb7pNL1UYaCx6ep6?g_st=ic"
            target="_blank"
            className="underline text-white font-bold hover:opacity-80"
          >
            View on map
          </a>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-lg font-bold mb-4">Find Help</h3>
          <ul className="space-y-2">
            <li>
              <a href="/contact" className="hover:opacity-80">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* TERMS */}
        <div>
          <h3 className="text-lg font-bold mb-4">Privacy & Terms</h3>
          <ul className="space-y-2">
            <li>
              <a href="/privacy" className="hover:opacity-80">
                Privacy Center
              </a>
            </li>
            <li>
              <a href="/refund" className="hover:opacity-80">
                Refund & Cancellation Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:opacity-80">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:opacity-80">Home</a></li>
            <li><a href="/rooms" className="hover:opacity-80">Rooms</a></li>
            <li><a href="/contact" className="hover:opacity-80">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-white/80">
        © {new Date().getFullYear()} Villa Anantara
      </div>
    </footer>
  );
}

function FloatingButtons() {
  return (
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
  );
}