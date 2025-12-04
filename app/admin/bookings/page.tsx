"use client";

import React, { useEffect, useMemo, useState } from "react";

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  guests?: number | null;
  occassion?: string | null;
  check_in?: string | null; // yyyy-mm-dd
  check_out?: string | null;
  nights?: number | null;
  payment_status?: string | null;
  created_at?: string | null;
};

const MOCHA = "#C29F80";
const DARK = "#0F1F0F";

export default function AdminBookingsPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [list, setList] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // selection for bulk delete
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // UI controls
  const [tab, setTab] = useState<"today-ins" | "today-outs" | "upcoming" | "all">(
    "today-ins"
  );
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries/list");
      const json = await res.json();
      setList(json.inquiries ?? []);
      setSelected([]);
      setSelectAll(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  // Login (client-side check)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setPasswordInput("");
    } else {
      setError("Incorrect password");
    }
  };

  // Derived groups
  const todayISO = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const upcomingLimitISO = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let items = list.slice();

    // tab filters
    if (tab === "today-ins") {
      items = items.filter((i) => i.check_in === todayISO);
    } else if (tab === "today-outs") {
      items = items.filter((i) => i.check_out === todayISO);
    } else if (tab === "upcoming") {
      items = items.filter(
        (i) => i.check_in && i.check_in > todayISO && i.check_in <= upcomingLimitISO
      );
    }

    // search filter
    if (q) {
      items = items.filter(
        (i) =>
          (i.name ?? "").toLowerCase().includes(q) ||
          (i.phone ?? "").toLowerCase().includes(q)
      );
    }

    // sort by check_in
    items.sort((a, b) => {
      const aKey = a.check_in ?? "";
      const bKey = b.check_in ?? "";
      if (sortOrder === "asc") return aKey.localeCompare(bKey);
      return bKey.localeCompare(aKey);
    });

    return items;
  }, [list, tab, search, sortOrder, todayISO, upcomingLimitISO]);

  // Selection handlers
  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setSelectAll(next.length > 0 && next.length === list.length);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) setSelected(list.map((i) => i.id));
    else setSelected([]);
  };

  // Bulk delete (using your existing delete API)
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected inquiries? This cannot be undone.`)) return;

    try {
      setLoading(true);
      const res = await fetch("/api/inquiries/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await load();
      setSelected([]);
      setSelectAll(false);
      alert("Deleted selected inquiries.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete selected.");
    } finally {
      setLoading(false);
    }
  };

  // Update payment status (single)
  const updatePaymentStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/inquiries/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, payment_status: status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      // reflect locally (optimistic)
      setList((prev) => prev.map((p) => (p.id === id ? { ...p, payment_status: status } : p)));
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status");
    }
  };

  // Quick WhatsApp
  const openWhatsApp = (phone: string | undefined, name: string | undefined) => {
    if (!phone) return alert("No phone number");
    const msg = encodeURIComponent(`Hello ${name ?? ""}, this is Villa Anantara. (Admin)`);
    window.open(`https://wa.me/${phone.replace(/[^0-9+]/g, "")}?text=${msg}`, "_blank");
  };

  // Render login or dashboard
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5] p-6">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-[#0F1F0F] text-white py-2 rounded font-semibold">
                Login
              </button>
              <button type="button" onClick={load} className="px-4 py-2 rounded border">
                Test Load
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header className="mb-6 p-4 rounded" style={{ backgroundColor: MOCHA, color: "white" }}>
        <h1 className="text-2xl font-bold">Bookings Dashboard</h1>
        <p className="opacity-90">Today’s arrivals, departures, upcoming stays, and full list.</p>
      </header>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm mr-2">View</label>
            <select value={tab} onChange={(e) => setTab(e.target.value as any)} className="p-2 rounded">
              <option value="today-ins">Today — Check-ins</option>
              <option value="today-outs">Today — Check-outs</option>
              <option value="upcoming">Upcoming (7 days)</option>
              <option value="all">All Bookings</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm mr-2">Sort</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} className="p-2 rounded">
              <option value="asc">Check-in ↑</option>
              <option value="desc">Check-in ↓</option>
            </select>
          </div>

          <button onClick={load} className="px-3 py-2 rounded border bg-white">Refresh</button>

          <button
            onClick={handleBulkDelete}
            disabled={selected.length === 0 || loading}
            className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Delete Selected ({selected.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border"
          />
          <div className="text-sm text-gray-700">{filtered.length} items</div>
        </div>
      </div>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#C29F80] text-white">
            <tr>
              <th className="p-3">
                <input type="checkbox" checked={selectAll} onChange={(e) => toggleSelectAll(e.target.checked)} />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Dates</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Occasion</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-600">No bookings found.</td>
              </tr>
            )}

            {filtered.map((it) => {
              const isTodayIn = it.check_in === todayISO;
              const isTodayOut = it.check_out === todayISO;
              const isUpcoming = it.check_in && it.check_in > todayISO && it.check_in <= upcomingLimitISO;

              return (
                <tr key={it.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.includes(it.id)} onChange={() => toggleSelect(it.id)} />
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">{it.email}</div>
                    <div className="text-xs text-gray-400">Submitted: {it.created_at ? new Date(it.created_at).toLocaleString() : "-"}</div>
                  </td>

                  <td className="p-3">{it.phone}</td>

                  <td className="p-3">
                    <div>{it.check_in} → {it.check_out}</div>
                    <div className="text-xs text-gray-500">{it.nights ?? "-"} nights</div>
                    <div className="mt-1">
                      {isTodayIn && <span className="px-2 py-0.5 rounded text-xs bg-green-600 text-white mr-2">Check-in Today</span>}
                      {isTodayOut && <span className="px-2 py-0.5 rounded text-xs bg-red-600 text-white mr-2">Check-out Today</span>}
                      {isUpcoming && !isTodayIn && !isTodayOut && <span className="px-2 py-0.5 rounded text-xs bg-yellow-400 text-black mr-2">Upcoming</span>}
                    </div>
                  </td>

                  <td className="p-3">{it.guests ?? "-"}</td>

                  <td className="p-3">{it.occassion ?? "-"}</td>

                  <td className="p-3">
                    <select
                      value={it.payment_status ?? "Pending"}
                      onChange={(e) => updatePaymentStatus(it.id, e.target.value)}
                      className="p-1 rounded border"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openWhatsApp(it.phone, it.name)} className="px-2 py-1 rounded border bg-white text-sm">WhatsApp</button>
                      <a href={`tel:${it.phone}`} className="px-2 py-1 rounded border bg-white text-sm">Call</a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-600">Total in data: {list.length} • Showing: {filtered.length}</div>
    </main>
  );
}
