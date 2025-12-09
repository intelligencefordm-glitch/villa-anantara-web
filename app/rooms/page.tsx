"use client";

import React, { useState } from "react";

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
      "/room1-1.jpg",
      "/room1-2.jpg",
      "/room1-3.jpg",
      "/room1-4.jpg",
      "/room1-5.jpg",
      "/room1-6.jpg",
    ],
  },
  {
    name: "The Terra Studio",
    description:
      "Earthy tones, artistic ceiling lines and a serene vibe create a relaxing environment ideal for unwinding and rejuvenating.",
    images: [
      "/room2-1.jpg",
      "/room2-2.jpg",
      "/room2-3.jpg",
      "/room2-4.jpg",
      "/room2-5.jpg",
      "/room2-6.jpg",
    ],
  },
  {
    name: "The Moonstone Suite",
    description:
      "Soft lighting, rich textures and a warm atmosphere define this premium suite — perfect for restful nights and cosy mornings.",
    images: [
      "/room3-1.jpg",
      "/room3-2.jpg",
      "/room3-3.jpg",
      "/room3-4.jpg",
      "/room3-5.jpg",
      "/room3-6.jpg",
    ],
  },
];

export default function RoomsPage() {
  return (
    <main className="min-h-screen p-6" style={{ background: "#EFE5D5" }}>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-4 py-2 bg-black text-white rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">Our Rooms</h1>

      <div className="space-y-10">
        {rooms.map((room, index) => (
          <RoomCard key={index} room={room} />
        ))}
      </div>
    </main>
  );
}

function RoomCard({ room }: { room: Room }) {
  const [i, setI] = useState(0);

  const prev = () => setI((i - 1 + room.images.length) % room.images.length);
  const next = () => setI((i + 1) % room.images.length);

  return (
    <section className="bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h2 className="text-2xl font-semibold">{room.name}</h2>
        <p className="opacity-90 mt-1">{room.description}</p>
      </div>

      <div className="p-5 grid md:grid-cols-2 gap-6 items-center">
        {/* Image Slider */}
        <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden bg-black/10">
          {/* Prev Button */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl"
          >
            ‹
          </button>

          <img
            src={room.images[i]}
            alt={room.name}
            className="w-full h-full object-cover"
          />

          {/* Next Button */}
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}