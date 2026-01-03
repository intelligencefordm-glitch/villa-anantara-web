"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const MOCHA = "#C29F80";
const BG = "#EFE5D5";

type Booking = {
  id: number;
  name: string;
  phone: string;
  guests: number;
  occasion: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  id_proof_path?: string;
  payment_proof_path?: string | null;
};

export default function ConfirmedBookingsPage() {
  // ---------------- AUTH ----------------
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  // ---------------- DATA ----------------
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- LOGIN ----------------
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput) return;

    setPassword(passwordInput);
    setAuthed(true);
    setError("");
    setPasswordInput("");
  }

  // ---------------- LOAD BOOKINGS ----------------
  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/confirmed/list", {
        headers: { "x-admin-password": password },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setBookings(json.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed || !password) return;
    loadBookings();
  }, [authed, password]);

  // ---------------- VIEW / DOWNLOAD DOCUMENT ----------------
  async function openDocument(path?: string | null) {
    if (!path) return;

    const res = await fetch("/api/admin/document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    const json = await res.json();
    if (json.url) {
      window.open(json.url, "_blank");
    } else {
      alert("Failed to open document");
    }
  }

  // 🔥 ---------------- DELETE BOOKING (ADDED) ----------------
  async function deleteBooking(id: number) {
    const ok = confirm("Are you sure you want to delete this booking?");
    if (!ok) return;

    await fetch("/api/admin/confirmed/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id }),
    });

    loadBookings();
  }

  // ---------------- LOGIN UI ----------------
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-black text-white py-2 rounded">
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <main className="min-h-screen p-6" style={{ background: BG }}>
      <header
        className="mb-6 p-4 rounded flex justify-between items-center"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h1 className="text-xl font-bold">Confirmed Bookings</h1>
        <button
          onClick={loadBookings}
          className="bg-white/20 px-4 py-2 rounded"
        >
          Refresh
        </button>
      </header>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && bookings.length === 0 && (
        <p className="bg-white p-4 rounded">No bookings found.</p>
      )}

      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.id} className="bg-white p-5 rounded shadow">
            <p className="font-semibold text-lg">{b.name}</p>
            <p className="text-sm">{b.phone}</p>

            <p className="text-sm mt-1">
              {format(new Date(b.check_in), "dd MMM yyyy")} →{" "}
              {format(new Date(b.check_out), "dd MMM yyyy")}
            </p>

            <p className="text-sm mt-1">
              ₹{b.amount_paid} / ₹{b.total_amount} • Due ₹{b.amount_due}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {b.id_proof_path && (
                <button
                  onClick={() => openDocument(b.id_proof_path)}
                  className="text-blue-700 font-semibold"
                >
                  View / Download ID Proof
                </button>
              )}

              {b.payment_proof_path && (
                <button
                  onClick={() => openDocument(b.payment_proof_path)}
                  className="text-green-700 font-semibold"
                >
                  View / Download Payment Proof
                </button>
              )}

              {/* 🔥 DELETE BUTTON (ADDED) */}
              <button
                onClick={() => deleteBooking(b.id)}
                className="text-red-600 font-semibold"
              >
                Delete Booking
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}