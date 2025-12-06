"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function ConfirmedBookingsPage() {
  const MOCHA = "#C29F80";

  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("Stay");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPaid, setEditPaid] = useState("");
  const [editTotal, setEditTotal] = useState("");

  // -------------------------------------------
  // LOGIN CHECK (Fix for Incorrect Password)
  // -------------------------------------------
  async function verifyPassword(pass: string) {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    });

    const json = await res.json();
    return res.ok;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const ok = await verifyPassword(passwordInput);

    if (!ok) {
      setError("Incorrect password");
      return;
    }

    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
    loadBookings();
  }

  // -------------------------------------------
  async function loadBookings() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/confirmed/list", {
        headers: { "x-admin-password": password },
      });

      const json = await res.json();
      if (!res.ok) throw new Error();

      setBookings(json.bookings || []);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authed) return;
    loadBookings();

    const interval = setInterval(loadBookings, 10000);
    return () => clearInterval(interval);
  }, [authed]);

  // -------------------------------------------
  async function submitBooking() {
    if (!name || !phone || !guests || !checkIn || !checkOut || !totalAmount) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = {
      name,
      phone,
      guests: Number(guests),
      occasion,
      check_in: checkIn,
      check_out: checkOut,
      nights:
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
      total_amount: Number(totalAmount),
      amount_paid: Number(amountPaid || 0),
    };

    try {
      setLoading(true);

      const res = await fetch("/api/admin/confirmed/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      loadBookings();

      setName("");
      setPhone("");
      setGuests("");
      setOccasion("Stay");
      setCheckIn("");
      setCheckOut("");
      setTotalAmount("");
      setAmountPaid("");
    } catch {
      setError("Failed to add booking.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------
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

  async function savePayment(id: number) {
    const res = await fetch("/api/admin/confirmed/updatePayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({
        id,
        total_amount: Number(editTotal),
        amount_paid: Number(editPaid),
      }),
    });

    if (!res.ok) {
      setError("Failed to update payment.");
      return;
    }

    setEditingId(null);
    loadBookings();
  }

  async function markAsPaid(id: number, total: number) {
    const res = await fetch("/api/admin/confirmed/updatePayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({
        id,
        total_amount: total,
        amount_paid: total,
      }),
    });

    if (!res.ok) {
      setError("Failed to update payment.");
      return;
    }

    loadBookings();
  }

  // -------------------------------------------
  // LOGIN UI
  // -------------------------------------------
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">
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

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -------------------------------------------
  // MAIN UI
  // -------------------------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded flex items-center justify-between"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Confirmed Bookings</h1>

        <button
          onClick={loadBookings}
          className="px-4 py-2 bg-white/20 text-white rounded"
        >
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT – ADD BOOKING */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Booking</h2>

          <input className="w-full p-2 mb-3 border rounded" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full p-2 mb-3 border rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full p-2 mb-3 border rounded" placeholder="Guests" value={guests} onChange={(e) => setGuests(e.target.value)} />

          <select className="w-full p-2 mb-3 border rounded" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            <option value="Stay">Stay</option>
            <option value="Other">Other</option>
          </select>

          <input type="date" className="w-full p-2 mb-3 border rounded" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          <input type="date" className="w-full p-2 mb-3 border rounded" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

          <input className="w-full p-2 mb-3 border rounded" placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          <input className="w-full p-2 mb-3 border rounded" placeholder="Amount Paid" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />

          <button onClick={submitBooking} className="w-full bg-black text-white py-2 rounded">
            {loading ? "Saving..." : "Add Booking"}
          </button>
        </section>

        {/* RIGHT – LIST */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">All Confirmed Bookings</h2>

          <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
            {bookings.map((b) => {
              const isPaid = Number(b.amount_due) <= 0;
              const isEditing = editingId === b.id;

              return (
                <li
                  key={b.id}
                  className={`p-4 rounded border ${
                    isPaid
                      ? "bg-green-100 border-green-300"
                      : "bg-red-100 border-red-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{b.name}</p>
                      <p>
                        {format(new Date(b.check_in), "dd MMM")} →{" "}
                        {format(new Date(b.check_out), "dd MMM")}
                      </p>
                      <p>
                        {b.guests} guests • {b.occasion}
                      </p>

                      {!isEditing ? (
                        <p className="mt-1 text-sm leading-5">
                          <strong>Paid:</strong> ₹{b.amount_paid} / ₹
                          {b.total_amount}
                          <br />
                          <strong>Due:</strong> ₹{b.amount_due}
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <input
                            className="border p-1 rounded w-full"
                            value={editTotal}
                            onChange={(e) =>
                              setEditTotal(e.target.value)
                            }
                            placeholder="Total"
                          />
                          <input
                            className="border p-1 rounded w-full"
                            value={editPaid}
                            onChange={(e) =>
                              setEditPaid(e.target.value)
                            }
                            placeholder="Paid"
                          />

                          <button
                            onClick={() => savePayment(b.id)}
                            className="px-3 py-1 bg-black text-white rounded mt-1"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(b.id);
                              setEditPaid(b.amount_paid);
                              setEditTotal(b.total_amount);
                            }}
                            className="text-blue-600 font-semibold"
                          >
                            Edit
                          </button>

                          {!isPaid && (
                            <button
                              onClick={() =>
                                markAsPaid(b.id, b.total_amount)
                              }
                              className="text-green-700 font-semibold"
                            >
                              Mark Paid
                            </button>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-red-600 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </main>
  );
}