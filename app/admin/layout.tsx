"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const KEY = "va_admin";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/confirmed", label: "Confirmed Bookings" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/calendar", label: "Calendar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(password: string) {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  }

  useEffect(() => {
    const saved = window.sessionStorage.getItem(KEY);
    (async () => {
      if (saved && (await verify(saved).catch(() => false))) setAuthed(true);
      else window.sessionStorage.removeItem(KEY);
      setReady(true);
    })();

    const out = () => {
      window.sessionStorage.removeItem(KEY);
      setAuthed(false);
    };
    window.addEventListener("va-admin-logout", out);
    return () => window.removeEventListener("va-admin-logout", out);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!pw) return;
    setBusy(true);
    setError("");
    try {
      if (await verify(pw)) {
        window.sessionStorage.setItem(KEY, pw);
        setAuthed(true);
        setPw("");
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Unable to verify the password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-sand text-ink/60">Loading…</div>;
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-sand px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-ink/10 bg-cream p-8 shadow-sm">
          <div className="font-display text-3xl">Villa Anant</div>
          <div className="mb-6 text-xs uppercase tracking-[0.24em] text-clay">Admin</div>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Admin password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none focus:border-clay"
            required
          />
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <button
            disabled={busy}
            className="mt-5 w-full rounded-xl bg-ink py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-sand md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex gap-1 overflow-x-auto bg-[#1d2a1d] p-3 text-[#eadfca] md:sticky md:top-0 md:h-screen md:flex-col md:gap-1.5 md:p-5">
        <div className="hidden px-3 pb-6 md:block">
          <div className="font-display text-3xl">Villa Anant</div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#d9a07a]">Admin</div>
        </div>
        {NAV.map((n) => {
          const on = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] transition ${
                on ? "bg-clay text-white" : "opacity-80 hover:bg-white/10"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
        <div className="flex gap-1 md:mt-auto md:flex-col md:gap-1.5">
          <Link href="/" className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm opacity-70 hover:bg-white/10">
            View website
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event("va-admin-logout"))}
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm opacity-70 hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
