"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Booking = {
  id: number;
  name: string;
  check_in: string;
  check_out: string;
  occasion?: string | null;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
};
type Expense = { id: number; amount: number; expense_date: string };
type Inquiry = {
  id: number;
  name: string;
  check_in: string;
  check_out: string;
  occasion?: string | null;
  status?: string | null;
};

const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const inr = (v: number) => "₹" + Math.round(v).toLocaleString("en-IN");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (s: string) => {
  const d = new Date(s + "T00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const headers = { "x-admin-password": window.sessionStorage.getItem("va_admin") || "" };
    (async () => {
      try {
        const [b, e, i] = await Promise.all([
          fetch("/api/admin/confirmed/list", { headers, cache: "no-store" }),
          fetch("/api/admin/expenses", { headers, cache: "no-store" }),
          fetch("/api/inquiries/list", { headers, cache: "no-store" }),
        ]);
        if (!b.ok || !e.ok || !i.ok) throw new Error("Could not load some data. Please sign in again.");
        setBookings((await b.json()).bookings || []);
        setExpenses((await e.json()).expenses || []);
        setInquiries((await i.json()).inquiries || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const d = useMemo(() => {
    const now = new Date();
    const key = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, "0")}`;
    const month = key(now.getFullYear(), now.getMonth());
    const today = now.toISOString().slice(0, 10);

    const inc = (m: string) => bookings.filter((b) => b.check_in?.slice(0, 7) === m).reduce((s, b) => s + n(b.amount_paid), 0);
    const exp = (m: string) => expenses.filter((x) => x.expense_date?.slice(0, 7) === m).reduce((s, x) => s + n(x.amount), 0);

    const opening =
      bookings.filter((b) => b.check_in?.slice(0, 7) < month).reduce((s, b) => s + n(b.amount_paid), 0) -
      expenses.filter((x) => x.expense_date?.slice(0, 7) < month).reduce((s, x) => s + n(x.amount), 0);

    const income = inc(month);
    const spent = exp(month);

    const trend = Array.from({ length: 6 }, (_, k) => {
      const dt = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1);
      const m = key(dt.getFullYear(), dt.getMonth());
      return { label: MONTHS[dt.getMonth()], income: inc(m), spent: exp(m) };
    });

    return {
      monthName: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
      balance: opening + income - spent,
      opening,
      income,
      spent,
      monthBookings: bookings.filter((b) => b.check_in?.slice(0, 7) === month).length,
      due: bookings.reduce((s, b) => s + Math.max(0, n(b.amount_due)), 0),
      dueList: bookings.filter((b) => n(b.amount_due) > 0).slice(0, 4),
      newInq: inquiries.filter((q) => (q.status || "New Inquiry") === "New Inquiry"),
      upcoming: bookings
        .filter((b) => b.check_out >= today)
        .sort((a, b) => (a.check_in < b.check_in ? -1 : 1))
        .slice(0, 4),
      trend,
      max: Math.max(1, ...trend.map((t) => Math.max(t.income, t.spent))),
    };
  }, [bookings, expenses, inquiries]);

  return (
    <main className="p-5 md:p-10">
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mb-7 mt-1 text-ink/60">{d.monthName} · Whole-villa bookings</p>

      {error && <p className="mb-5 rounded-xl bg-red-100 p-3 text-red-800">{error}</p>}
      {loading && <p className="text-ink/60">Loading…</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi dark label="Available balance" value={inr(d.balance)} note={`Opening ${inr(d.opening)}`} />
            <Kpi label="Income this month" value={inr(d.income)} note={`${d.monthBookings} stays`} />
            <Kpi label="Expenses this month" value={inr(d.spent)} note="Logged expenses" />
            <Kpi label="Outstanding due" value={inr(d.due)} note={`${d.dueList.length ? "Balances pending" : "All paid"}`} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-ink/10 bg-cream p-5">
              <h2 className="mb-3 font-display text-2xl">Income vs expenses</h2>
              <div className="flex h-48 items-end gap-3">
                {d.trend.map((t) => (
                  <div key={t.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div className="flex w-full flex-1 items-end justify-center gap-1">
                      <i className="block w-2/5 max-w-[26px] rounded-t-md bg-clay" style={{ height: `${(t.income / d.max) * 100}%` }} />
                      <i className="block w-2/5 max-w-[26px] rounded-t-md bg-[#8b9a7b]" style={{ height: `${(t.spent / d.max) * 100}%` }} />
                    </div>
                    <span className="text-xs text-ink/60">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-5 text-sm text-ink/60">
                <span><b className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-clay" />Income</span>
                <span><b className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#8b9a7b]" />Expenses</span>
              </div>
            </section>

            <section className="rounded-2xl border border-ink/10 bg-cream p-5">
              <h2 className="mb-2 font-display text-2xl">Needs attention</h2>
              {d.newInq.slice(0, 4).map((q) => (
                <Row key={`i${q.id}`} title={q.name} sub={`${day(q.check_in)} – ${day(q.check_out)}${q.occasion ? " · " + q.occasion : ""}`} tag="New" tone="info" href="/admin/inquiries" />
              ))}
              {d.dueList.map((b) => (
                <Row key={`b${b.id}`} title={b.name} sub={`Balance due ${inr(n(b.amount_due))}`} tag="Due" tone="warn" href="/admin/confirmed" />
              ))}
              {!d.newInq.length && !d.dueList.length && <p className="py-3 text-ink/60">Nothing pending. All caught up.</p>}
            </section>
          </div>

          <section className="mt-4 rounded-2xl border border-ink/10 bg-cream p-5">
            <h2 className="mb-2 font-display text-2xl">Upcoming stays</h2>
            {d.upcoming.length === 0 && <p className="py-2 text-ink/60">No upcoming stays.</p>}
            {d.upcoming.map((b) => (
              <Row key={b.id} title={b.name} sub={`${day(b.check_in)} – ${day(b.check_out)}${b.occasion ? " · " + b.occasion : ""}`} tag={n(b.amount_due) > 0 ? "Part paid" : "Paid"} tone={n(b.amount_due) > 0 ? "warn" : "ok"} href="/admin/confirmed" />
            ))}
          </section>
        </>
      )}
    </main>
  );
}

function Kpi({ label, value, note, dark }: { label: string; value: string; note: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${dark ? "border-transparent bg-[#1d2a1d] text-[#f1eadb]" : "border-ink/10 bg-cream"}`}>
      <small className={`block text-xs uppercase tracking-widest ${dark ? "text-[#cdbfa6]" : "text-ink/60"}`}>{label}</small>
      <b className="mt-1 block font-display text-3xl">{value}</b>
      <span className={`text-sm ${dark ? "text-[#cdbfa6]" : "text-ink/60"}`}>{note}</span>
    </div>
  );
}

function Row({ title, sub, tag, tone, href }: { title: string; sub: string; tag: string; tone: "info" | "warn" | "ok"; href: string }) {
  const c = tone === "info" ? "bg-[#dde9f4] text-[#2f5f8a]" : tone === "warn" ? "bg-[#f8e9cf] text-[#a8691c]" : "bg-[#e1f0e5] text-[#2f7d4f]";
  return (
    <Link href={href} className="flex items-center justify-between gap-3 border-b border-ink/10 py-3 last:border-0">
      <div>
        <b className="font-medium">{title}</b>
        <small className="block text-ink/60">{sub}</small>
      </div>
      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${c}`}>{tag}</span>
    </Link>
  );
}
