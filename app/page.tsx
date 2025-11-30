import React from "react";

export default function Home() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";
  const mapUrl =
    process.env.NEXT_PUBLIC_MAP_URL ??
    "https://maps.app.goo.gl/dNiPHToeJaQQFf3e9";

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================== */}
      {/* HERO */}
      {/* =========================== */}
      <section className="relative h-[65vh] md:h-[75vh]">
        <img
          src="/images/hero.jpg"
          alt="Villa Anantara"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl bg-black/30 p-8 rounded-xl backdrop-blur-sm shadow-lg">
            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Villa Anantara
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Your private luxury farmhouse in Raipur —{" "}
              <span className="font-medium">a peaceful escape into nature.</span>
            </p>
          </div>
        </div>
      </section>

      {/* =========================== */}
      {/* ABOUT / INFO */}
      {/* =========================== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10 items-start">

          {/* ABOUT TEXT */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold text-primary">
              About Villa Anantara
            </h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Villa Anantara is a premium private farmhouse stay near Raipur,
              designed to offer tranquility, comfort, and a luxurious
              experience. Enjoy a serene atmosphere surrounded by nature, with
              modern amenities and a lush garden perfect for relaxation.
              <br /><br />
              Bookings open from{" "}
              <strong className="text-primary">15 January 2026</strong>.
            </p>

            {/* =========================== */}
            {/* MINI MAP UNDER ABOUT TEXT */}
            {/* =========================== */}
            <div className="mt-6 flex items-center gap-4">
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
                className="text-primary underline font-medium hover:text-gray-700"
              >
                View on map
              </a>
            </div>
          </div>

          {/* QUICK INFO CARDS */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Capacity</h3>
              <p className="text-sm text-gray-600">Up to 12 guests • 3 bedrooms</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Deposit</h3>
              <p className="text-sm text-gray-600">
                20% advance • rest at check-in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================== */}
      {/* GALLERY */}
      {/* =========================== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-primary mb-10">Gallery</h2>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <img src="/images/gallery1.jpg" className="w-full h-64 object-cover rounded-xl shadow-md" />
          <img src="/images/gallery2.jpg" className="w-full h-64 object-cover rounded-xl shadow-md" />
          <div className="grid grid-rows-2 gap-6">
            <img src="/images/gallery3.jpg" className="w-full h-32 object-cover rounded-xl shadow-md" />
            <img src="/images/gallery4.jpg" className="w-full h-32 object-cover rounded-xl shadow-md" />
          </div>
        </div>

        {/* Mobile Masonry */}
        <div className="md:hidden columns-2 gap-4 space-y-4">
          {["gallery1", "gallery2", "gallery3", "gallery4"].map((img) => (
            <img key={img} src={`/images/${img}.jpg`} className="w-full rounded-xl shadow break-inside-avoid" />
          ))}
        </div>
      </section>

      {/* =========================== */}
      {/* AMENITIES */}
      {/* =========================== */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t">
        <h2 className="text-3xl font-semibold text-primary">Amenities</h2>

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Private pool", "Garden & BBQ", "Indoor games", "Music system"].map(
            (a) => (
              <div key={a} className="p-5 border rounded-lg shadow-sm hover:shadow-md transition">
                <h4 className="font-medium text-primary">{a}</h4>
              </div>
            )
          )}
        </div>
      </section>

      {/* =========================== */}
      {/* FOOTER */}
      {/* =========================== */}
      <footer className="bg-black text-white mt-20">
  <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">

    {/* LEFT SIDE */}
    <div>
      <h3 className="text-lg font-semibold">Villa Anantara</h3>

      <p className="mt-2 text-sm text-gray-300">
        Private luxury farmhouse near Raipur • Bookings open 15 Jan 2026
      </p>

      {/* MINI MAP UNDER ABOUT TEXT */}
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

    {/* RIGHT SIDE */}
    <div className="space-y-2">
      <a
        href={mapUrl}
        target="_blank"
        className="block text-sm text-gray-300"
      >
        View on map
      </a>
    </div>
  </div>

  <div className="text-center py-4 text-xs text-gray-400 border-t border-white/10">
    © {new Date().getFullYear()} Villa Anantara
  </div>
</footer>

        
