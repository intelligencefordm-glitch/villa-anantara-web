"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>

      {/* =========================
          STICKY HEADER (Solid Beige)
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
              alt="Villa Anantara"
              className="h-10 w-auto"
            />
          </a>

          {/* CENTER — Villa Anantara (HEADER ONLY) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[#0F1F0F] text-lg md:text-xl font-semibold tracking-wide">
              
              {/* Same futura + poppins style */}
              <span
                className="font-futura font-[500]"
                style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}
              >
                V
              </span>
              <span
                className="font-poppins"
                style={{ marginRight: "0.12em" }}
              >
                illa
              </span>
              <span
                className="font-futura font-[500]"
                style={{ letterSpacing: "-0.02em", marginRight: "0.06em" }}
              >
                A
              </span>
              <span className="font-poppins">nantara</span>

            </h1>
          </div>

          {/* RIGHT — Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-[#0F1F0F] text-sm font-medium">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/rooms" className="hover:opacity-70">Rooms</a>
            <a href="/#check-availability" className="hover:opacity-70">Check Availability</a>
            <a href="/contact" className="hover:opacity-70">Contact</a>
          </nav>
        </div>

        {/* MOBILE NAV */}
        <nav
          className="md:hidden overflow-x-auto flex gap-6 px-4 py-2 text-[#0F1F0F] text-sm"
        >
          <a href="/" className="whitespace-nowrap">Home</a>
          <a href="/rooms" className="whitespace-nowrap">Rooms</a>
          <a href="/#check-availability" className="whitespace-nowrap">Check Availability</a>
          <a href="/contact" className="whitespace-nowrap">Contact</a>
        </nav>
      </header>

      {/* PUSH CONTENT BELOW HEADER */}
      <div style={{ height: "110px" }} />

      {/* =========================
          HERO VIDEO (clean version)
      ========================= */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        
        {/* Video */}
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Light dark overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* CLEAN TITLE ONLY — NO LOGO, NO SUBTITLE */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <h2
            className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none"
            style={{
              color: "#0F1F0F",
              textShadow: "0px 0px 20px rgba(255,255,255,0.5)"
            }}
          >
            <span
              className="font-futura font-[500]"
              style={{ marginRight: "0.08em" }}
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
              style={{ marginRight: "0.08em" }}
            >
              A
            </span>
            <span className="font-poppins">nantara</span>
          </h2>
        </div>

      </section>

      {/* =========================
          REST OF YOUR CONTENT (rooms, amenities, etc)
          (KEEP what you already have)
      ========================= */}

      {/* your rooms, amenities, about, footer, floating buttons stay unchanged */}
    </main>
  );
}
