"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>

      {/* =========================
          STICKY HEADER
      ========================= */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          backgroundColor: "#EFE5D5",
          borderBottom: "1px solid rgba(15,31,15,0.1)"
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

          {/* LEFT — LOGO */}
          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Villa Anantara Logo"
              className="h-10 w-auto"
            />
          </a>

          {/* CENTER — HEADER TITLE (Futura + Poppins mix) */}
          <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            <h1 className="text-[#0F1F0F] text-lg md:text-xl font-semibold tracking-wide">

              {/* V (FUTURA) */}
              <span
                className="font-futura font-[500]"
                style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}
              >
                V
              </span>

              {/* illa (POPPINS) */}
              <span
                className="font-poppins"
                style={{ marginRight: "0.12em" }}
              >
                illa
              </span>

              {/* A (FUTURA) */}
              <span
                className="font-futura font-[500]"
                style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}
              >
                A
              </span>

              {/* nantara (POPPINS) */}
              <span className="font-poppins">nantara</span>
            </h1>
          </div>

          {/* RIGHT — DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-[#0F1F0F] text-sm font-medium">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/rooms" className="hover:opacity-70">Rooms</a>
            <a href="/#check-availability" className="hover:opacity-70">Check Availability</a>
            <a href="/contact" className="hover:opacity-70">Contact</a>
          </nav>

        </div>

        {/* MOBILE NAV (SCROLLABLE) */}
        <nav
          className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 text-[#0F1F0F] text-sm"
        >
          <a href="/" className="whitespace-nowrap">Home</a>
          <a href="/rooms" className="whitespace-nowrap">Rooms</a>
          <a href="/#check-availability" className="whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* PUSH BELOW HEADER */}
      <div style={{ height: "110px" }} />

      {/* =========================
          HERO (CLEAN — NO TITLE)
      ========================= */}
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

      {/* =========================
          ROOMS — EMPTY
      ========================= */}
      <section id="rooms" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-[#0F1F0F] mb-4">
          Rooms
        </h2>
        <p className="text-[#4a4a4a] font-poppins">
          Rooms will be updated soon.
        </p>
      </section>

      {/* =========================
          AMENITIES — EMPTY
      ========================= */}
      <section
        id="amenities"
        className="max-w-6xl mx-auto px-6 py-20 border-t text-center"
        style={{ borderColor: "rgba(15,31,15,0.08)" }}
      >
        <h2 className="text-3xl font-semibold text-[#0F1F0F] mb-4">
          Amenities
        </h2>
        <p className="text-[#4a4a4a] font-poppins">
          Amenities will be updated soon.
        </p>
      </section>

      {/* =========================
          ABOUT SECTION
      ========================= */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 border-t"
        style={{ borderColor: "rgba(15,31,15,0.08)" }}
      >
        <h2 className="text-3xl font-semibold text-[#0F1F0F]">About Villa Anantara</h2>
        <p className="mt-4 text-[#4a4a4a] leading-relaxed">
          Villa Anantara is a premium private farmhouse stay near Raipur designed
          to offer tranquility, comfort, and a luxurious experience.
        </p>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="mt-20" style={{ backgroundColor: "#EFE5D5" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-14 text-[#0F1F0F]">

          {/* Col 1 */}
          <div>
            <h3 className="text-xl font-semibold">Villa Anantara</h3>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Private luxury farmhouse near Raipur
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Find Help</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy & Terms</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:underline">Privacy Center</a></li>
              <li><a href="/refund" className="hover:underline">Refund Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Col 4 */}
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
          FLOATING BUTTONS
      ========================= */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/villaanantara/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-105 transition"
        >
          <img src="/icons/instagram.png" className="w-8 h-8" alt="Instagram" />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/918889777288"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-14 h-14 rounded-full bg-[#0F1F0F] shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <img src="/icons/whatsapp.png" className="w-8 h-8 invert" alt="WhatsApp" />
        </a>

      </div>

    </main>
  );
}
