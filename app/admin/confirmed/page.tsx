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
  // ---------------- AUTH ----------------
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  // ---------------- FORM ----------------
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("Stay");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  // ---------------- DATA ----------------
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- AUTH ----------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput) return;

    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
  }

  // ---------------- LOAD ----------------
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
    if (!authed) return;
    loadBookings();
  }, [authed]);

  // ---------------- ADD ----------------
  async function submitBooking() {
    setError("");

    if (!name || !phone || !guests || !checkIn || !checkOut || !totalAmount) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/confirmed/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          name,
          phone,
          guests: Number(guests),
          occasion,
          check_in: checkIn,
          check_out: checkOut,
          total_amount: Number(totalAmount),
          amount_paid: Number(amountPaid || 0),
        }),
      });

      if (!res.ok) throw new Error();

      setName("");
      setPhone("");
      setGuests("");
      setOccasion("Stay");
      setCheckIn("");
      setCheckOut("");
      setTotalAmount("");
      setAmountPaid("");

      loadBookings();
    } catch {
      setError("Failed to add booking");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- DELETE ----------------
  async function deleteBooking(id: number) {
    if (!confirm("Delete this booking?")) return;

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

  // ---------------- VIEW DOCUMENT ----------------
  async function viewDocument(path?: string | null) {
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

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
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
        <button onClick={loadBookings} className="bg-white/20 px-4 py-2 rounded">
          Refresh
        </button>
      </header>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* ADD BOOKING */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Add Booking</h2>

          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="input" placeholder="Guests" value={guests} onChange={e => setGuests(e.target.value)} />

          <select className="input" value={occasion} onChange={e => setOccasion(e.target.value)}>
            <option>Stay</option>
            <option>Other</option>
          </select>

          <input type="date" className="input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          <input type="date" className="input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />

          <input className="input" placeholder="Total Amount" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
          <input className="input" placeholder="Amount Paid" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />

          <button onClick={submitBooking} className="w-full bg-black text-white py-2 rounded">
            Add Booking
          </button>
        </section>

        {/* LIST */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Bookings</h2>

          <ul className="space-y-3 max-h-[65vh] overflow-y-auto">
            {bookings.map(b => (
              <li key={b.id} className="p-4 border rounded">
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm">
                  {format(new Date(b.check_in), "dd MMM")} →{" "}
                  {format(new Date(b.check_out), "dd MMM")}
                </p>
                <p className="text-sm">
                  ₹{b.amount_paid} / ₹{b.total_amount} • Due ₹{b.amount_due}
                </p>

                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  {b.id_proof_path && (
                    <button
                      onClick={() => viewDocument(b.id_proof_path)}
                      className="text-blue-700 font-semibold"
                    >
                      View ID Proof
                    </button>
                  )}

                  {b.payment_proof_path && (
                    <button
                      onClick={() => viewDocument(b.payment_proof_path)}
                      className="text-green-700 font-semibold"
                    >
                      View Payment Proof
                    </button>
                  )}

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </main>
  );
}"use client";

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
  // ---------------- AUTH ----------------
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  // ---------------- FORM ----------------
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("Stay");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  // ---------------- DATA ----------------
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- AUTH ----------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput) return;

    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
  }

  // ---------------- LOAD ----------------
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
    if (!authed) return;
    loadBookings();
  }, [authed]);

  // ---------------- ADD ----------------
  async function submitBooking() {
    setError("");

    if (!name || !phone || !guests || !checkIn || !checkOut || !totalAmount) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/confirmed/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          name,
          phone,
          guests: Number(guests),
          occasion,
          check_in: checkIn,
          check_out: checkOut,
          total_amount: Number(totalAmount),
          amount_paid: Number(amountPaid || 0),
        }),
      });

      if (!res.ok) throw new Error();

      setName("");
      setPhone("");
      setGuests("");
      setOccasion("Stay");
      setCheckIn("");
      setCheckOut("");
      setTotalAmount("");
      setAmountPaid("");

      loadBookings();
    } catch {
      setError("Failed to add booking");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- DELETE ----------------
  async function deleteBooking(id: number) {
    if (!confirm("Delete this booking?")) return;

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

  // ---------------- VIEW DOCUMENT ----------------
  async function viewDocument(path?: string | null) {
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

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
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
        <button onClick={loadBookings} className="bg-white/20 px-4 py-2 rounded">
          Refresh
        </button>
      </header>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* ADD BOOKING */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Add Booking</h2>

          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="input" placeholder="Guests" value={guests} onChange={e => setGuests(e.target.value)} />

          <select className="input" value={occasion} onChange={e => setOccasion(e.target.value)}>
            <option>Stay</option>
            <option>Other</option>
          </select>

          <input type="date" className="input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          <input type="date" className="input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />

          <input className="input" placeholder="Total Amount" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
          <input className="input" placeholder="Amount Paid" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />

          <button onClick={submitBooking} className="w-full bg-black text-white py-2 rounded">
            Add Booking
          </button>
        </section>

        {/* LIST */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Bookings</h2>

          <ul className="space-y-3 max-h-[65vh] overflow-y-auto">
            {bookings.map(b => (
              <li key={b.id} className="p-4 border rounded">
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm">
                  {format(new Date(b.check_in), "dd MMM")} →{" "}
                  {format(new Date(b.check_out), "dd MMM")}
                </p>
                <p className="text-sm">
                  ₹{b.amount_paid} / ₹{b.total_amount} • Due ₹{b.amount_due}
                </p>

                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  {b.id_proof_path && (
                    <button
                      onClick={() => viewDocument(b.id_proof_path)}
                      className="text-blue-700 font-semibold"
                    >
                      View ID Proof
                    </button>
                  )}

                  {b.payment_proof_path && (
                    <button
                      onClick={() => viewDocument(b.payment_proof_path)}
                      className="text-green-700 font-semibold"
                    >
                      View Payment Proof
                    </button>
                  )}

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </main>
  );
}
