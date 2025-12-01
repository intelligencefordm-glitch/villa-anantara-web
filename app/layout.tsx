"use client";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          HERO VIDEO + CENTERED TITLE
      ========================= */}
      <header className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black">

        {/* VIDEO */}
        <video
          src="/videos/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />

        {/* CENTERED TITLE */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <h1 className="text-white text-5xl md:text-7xl font-semibold leading-none">

            {/* "V" - Futura */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.03em", marginRight: "-0.045em" }}
            >
              V
            </span>

            {/* "illa" - Poppins */}
            <span
              className="font-poppins"
              style={{ marginLeft: "-0.035em" }}
            >
              illa
            </span>

            {/* spacing between words */}
            <span style={{ margin: "0 0.12em" }} />

            {/* "A" - Futura */}
            <span
              className="font-futura font-[500]"
              style={{ letterSpacing: "-0.03em", marginRight: "-0.045em" }}
            >
              A
            </span>

            {/* "nantara" - Poppins */}
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
          REST OF YOUR PAGE CONTENT
      ========================= */}

      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-semibold">Villa Anantara</h2>
        <p className="mt-4">A private luxury farmhouse near Raipur.</p>
      </section>

    </main>
  );
}
