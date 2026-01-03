"use client";

import React, { useState, useEffect } from "react";
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
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput) return;
    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
  }

  async function loadBookings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/confirmed/list", {
        headers: { "x-admin-password": password },
      });
      const json = await res.json();
      setBookings(json.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) loadBookings();
  }, [authed]);

  async function viewDocument(path?: string | null) {
    if (!path) return;
    const res = await fetch("/api/admin/document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const json = await res.json();
    if (json.url) window.open(json.url, "_blank");
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button className="w-full bg-black text-white py-2 rounded">
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: BG }}>
      <header
        className="mb-6 p-4 rounded flex justify-between items-center"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h1 className="text-xl font-bold">Confirmed Bookings</h1>
        <button onClick={loadBookings}>Refresh</button>
      </header>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {bookings.map((b) => (
          <li key={b.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{b.name}</p>
            <p className="text-sm">
              {format(new Date(b.check_in), "dd MMM")} →{" "}
              {format(new Date(b.check_out), "dd MMM")}
            </p>
            <p className="text-sm">
              ₹{b.amount_paid} / ₹{b.total_amount}
            </p>

            <div className="flex gap-4 mt-2 text-sm">
              {b.id_proof_path && (
                <button onClick={() => viewDocument(b.id_proof_path)}>
                  View ID
                </button>
              )}
              {b.payment_proof_path && (
                <button onClick={() => viewDocument(b.payment_proof_path)}>
                  View Payment
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}