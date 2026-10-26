"use client";

import React, { useState, useEffect } from "react";

const MOCHA = "#C29F80";

type Room = {
  name: string;
  description: string;
  images: string[];
};

const rooms: Room[] = [
  {
    name: "The Oak Haven",
    description:
      "A spacious master bedroom with warm wood tones, natural textures and a cosy ambience. Designed for peaceful, luxurious rest.",
    images: [
      "/rooms/room1-1.jpg",
      "/rooms/room1-2.jpg",
      "/rooms/room1-3.jpg",
      "/rooms/room1-4.jpg",
      "/rooms/room1-5.jpg",
      "/rooms/room1-6.jpg",
    ],
  },
  {
    name: "The Terra Studio",
    description:
      "Earthy tones, artistic ceiling lines and a serene vibe create a relaxing environment ideal for unwinding and rejuvenating.",
    images: [
      "/rooms/room2-1.jpg",
      "/rooms/room2-2.jpg",
      "/rooms/room2-3.jpg",
      "/rooms/room2-4.jpg",
      "/rooms/room2-5.jpg",
      "/rooms/room2-6.jpg",
    ],
  },
  {
    name: "The Moonstone Suite",
    description:
      "Soft lighting, rich textures and a warm atmosphere define this premium suite — perfect for restful nights and cosy mornings.",
    images: [
      "/rooms/room3-1.jpg",
      "/rooms/room3-2.jpg",
      "/rooms/room3-3.jpg",
      "/rooms/room3-4.jpg",
      "/rooms/room3-5.jpg",
      "/rooms/room3-6.jpg",
    ],
  },
];

export default function RoomsPage() {
  return (
    <main
      className="min-h-screen p-6 relative"
      style={{ background: "#EFE5D5" }}
    >
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        aria-label="Go back to the previous page"
      >
        ← Back
      </button>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">
        Our Rooms
      </h1>

      {/* Room Cards */}
      <div className="space-y-10">
        {rooms.map((room) => (
          <RoomCard key={room.name} room={room} />
        ))}
      </div>

      {/* Floating Book Now Button */}
      <button
        onClick={() => (window.location.href = "/check")}
        className="fixed bottom-6 right-6 bg-[#0F1F0F] text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-gray-900 hover:scale-105 transition-all"
        style={{ zIndex: 999 }}
        aria-label="Check availability and book Villa Anant"
      >
        Book Now
      </button>
    </main>
  );
}

function RoomCard({ room }: { room: Room }) {
  const [i, setI] = useState(0);
  const total = room.images.length;

  const prev = () => {
    setI((current) => (current - 1 + total) % total);
  };

  const next = () => {
    setI((current) => (current + 1) % total);
  };

  // Automatically advance the slideshow every 4 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setI((current) => (current + 1) % total);
    }, 4000);

    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="bg-white rounded-xl shadow overflow-hidden">
      {/* Room Header */}
      <div
        className="p-5 border-b"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h2 className="text-2xl font-semibold">{room.name}</h2>

        <p className="opacity-90 mt-1">{room.description}</p>
      </div>

      {/* Room Images */}
      <div className="p-5 grid md:grid-cols-2 gap-6 items-center">
        <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden bg-black/10">
          {/* Previous Image */}
          <button
            type="button"
            onClick={prev}
            aria-label={`Previous image of ${room.name}`}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-black/70 transition"
          >
            ‹
          </button>

          <img
            src={room.images[i]}
            alt={`${room.name} — image ${i + 1} of ${total}`}
            className="w-full h-full object-cover"
          />

          {/* Next Image */}
          <button
            type="button"
            onClick={next}
            aria-label={`Next image of ${room.name}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-black/70 transition"
          >
            ›
          </button>

          {/* Slideshow Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {room.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show image ${idx + 1} of ${room.name}`}
                aria-current={idx === i ? "true" : undefined}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === i ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
