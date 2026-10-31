"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "The Villa" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#121a12]/60 text-white backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-wide">
          Villa Anant
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-widest md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-70">
              {l.label}
            </Link>
          ))}
          <Link
            href="/check"
            className="rounded-full bg-clay px-5 py-2 text-xs font-medium text-white transition hover:-translate-y-0.5"
          >
            Check Availability
          </Link>
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="mt-1.5 block h-0.5 w-6 bg-white" />
          <span className="mt-1.5 block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 text-sm uppercase tracking-widest md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/check" className="text-clay" onClick={() => setOpen(false)}>
            Check Availability
          </Link>
        </nav>
      )}
    </header>
  );
}
