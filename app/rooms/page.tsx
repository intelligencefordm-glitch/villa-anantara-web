"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Room = { name: string; description: string; images: string[] };

const imgs = (n: number) => Array.from({ length: 6 }, (_, i) => `/rooms/room${n}-${i + 1}.jpg`);

const rooms: Room[] = [
  { name: "The Oak Haven", description: "A spacious master bedroom with warm wood tones, natural textures and a cosy ambience. Designed for peaceful, luxurious rest.", images: imgs(1) },
  { name: "The Terra Studio", description: "Earthy tones, artistic ceiling lines and a serene vibe create a relaxing environment ideal for unwinding and rejuvenating.", images: imgs(2) },
  { name: "The Moonstone Suite", description: "Soft lighting, rich textures and a warm atmosphere define this premium suite, perfect for restful nights and cosy mornings.", images: imgs(3) },
];

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-sand">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
        <span className="text-xs font-medium uppercase tracking-[0.28em] text-clay">The villa</span>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">Three rooms, one private retreat</h1>
        <p className="mt-4 max-w-2xl text-ink/70">
          Villa Anant is booked as a whole, so every room, the pool and the grounds are exclusively yours.
        </p>

        <div className="mt-14 space-y-16">
          {rooms.map((room, idx) => (
            <RoomCard key={room.name} room={room} flip={idx % 2 === 1} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/check" className="rounded-full bg-clay px-8 py-4 font-medium text-white">
            Check Villa Availability
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

function RoomCard({ room, flip }: { room: Room; flip: boolean }) {
  const [i, setI] = useState(0);
  const total = room.images.length;

  useEffect(() => {
    const timer = setInterval(() => setI((c) => (c + 1) % total), 4500);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className={`relative h-80 overflow-hidden rounded-2xl bg-black/10 md:h-[460px] ${flip ? "md:order-2" : ""}`}>
        <img src={room.images[i]} alt={`${room.name}, image ${i + 1} of ${total}`} className="h-full w-full object-cover" />
        <button type="button" aria-label={`Previous image of ${room.name}`} onClick={() => setI((i - 1 + total) % total)} className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-xl text-white hover:bg-black/70">‹</button>
        <button type="button" aria-label={`Next image of ${room.name}`} onClick={() => setI((i + 1) % total)} className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-xl text-white hover:bg-black/70">›</button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {room.images.map((_, idx) => (
            <button key={idx} type="button" aria-label={`Show image ${idx + 1}`} onClick={() => setI(idx)} className={`h-2.5 w-2.5 rounded-full ${idx === i ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-display text-4xl md:text-5xl">{room.name}</h2>
        <p className="mt-4 text-lg text-ink/70">{room.description}</p>
      </div>
    </section>
  );
}
