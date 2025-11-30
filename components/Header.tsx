"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-primary">
          Villa Anantara
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-gray-700">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/rooms" className="hover:text-primary">Rooms</Link>
          <Link href="/gallery" className="hover:text-primary">Gallery</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
