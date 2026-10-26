“use client”;

import React, { useEffect, useState } from “react”;
import { format } from “date-fns”;

const MOCHA = “#C29F80”;
const BG = “#EFE5D5”;

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

type BookingForm = {
name: string;
phone: string;
guests: string;
occasion: string;
check_in: string;
check_out: string;
total_amount: string;
amount_paid: string;
};

const EMPTY_FORM: BookingForm = {
name: “”,
phone: “”,
guests: “1”,
occasion: “”,
check_in: “”,
check_out: “”,
total_amount: “”,
amount_paid: “”,
};

export default function ConfirmedBookingsPage() {
const [passwordInput, setPasswordInput] = useState(””);
const [password, setPassword] = useState(””);
const [authed, setAuthed] = useState(false);

const [bookings, setBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const [showAddForm, setShowAddForm] = useState(false);
const [saving, setSaving] = useState(false);
const [form, setForm] = useState(EMPTY_FORM);

function handleLogin(e: React.FormEvent) {
e.preventDefault();
if (!passwordInput.trim()) return;

setPassword(passwordInput);
setAuthed(true);
setError("");
setPasswordInput("");

}

async function loadBookings() {
try {
setLoading(true);
setError(””);

  const res = await fetch("/api/admin/confirmed/list", {
    headers: { "x-admin-password": password },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to load bookings.");
  }
  setBookings(json.bookings || []);
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Failed to load bookings."
  );
} finally {
  setLoading(false);
}

}

useEffect(() => {
if (authed && password) {
loadBookings();
}
}, [authed, password]);

function updateForm(field: keyof BookingForm, value: string) {
setForm((previous) => ({ …previous, [field]: value }));
}

async function addBooking(e: React.FormEvent) {
e.preventDefault();
setError(””);

const guests = Number(form.guests);
const totalAmount = Number(form.total_amount);
const amountPaid = Number(form.amount_paid);
if (!form.name.trim() || !form.phone.trim()) {
  setError("Please enter the guest's name and phone number.");
  return;
}
if (!form.check_in || !form.check_out) {
  setError("Please select check-in and check-out dates.");
  return;
}
const checkIn = new Date(`${form.check_in}T00:00:00Z`);
const checkOut = new Date(`${form.check_out}T00:00:00Z`);
if (
  Number.isNaN(checkIn.getTime()) ||
  Number.isNaN(checkOut.getTime()) ||
  checkOut <= checkIn
) {
  setError("Check-out must be after check-in.");
  return;
}
if (!Number.isInteger(guests) || guests < 1) {
  setError("Number of guests must be at least 1.");
  return;
}
if (
  !Number.isFinite(totalAmount) ||
  totalAmount < 0 ||
  !Number.isFinite(amountPaid) ||
  amountPaid < 0 ||
  amountPaid > totalAmount
) {
  setError("Please enter valid payment amounts. Amount paid cannot exceed the total.");
  return;
}
const nights = Math.round(
  (checkOut.getTime() - checkIn.getTime()) / 86400000
);
const payload = {
  name: form.name.trim(),
  phone: form.phone.trim(),
  guests,
  occasion: form.occasion.trim(),
  check_in: form.check_in,
  check_out: form.check_out,
  total_amount: totalAmount,
  amount_paid: amountPaid,
  amount_due: totalAmount - amountPaid,
  nights,
};
try {
  setSaving(true);
  const res = await fetch("/api/admin/confirmed/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to add booking.");
  }
  setForm({ ...EMPTY_FORM });
  setShowAddForm(false);
  await loadBookings();
  alert("Booking added successfully.");
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Failed to add booking."
  );
} finally {
  setSaving(false);
}

}

async function openDocument(path?: string | null) {
if (!path) return;

try {
  const res = await fetch("/api/admin/document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify({ path }),
  });
  const json = await res.json();
  if (!res.ok || !json.url) {
    throw new Error(json.error || "Failed to open document.");
  }
  window.location.href = json.url;
} catch (err) {
  alert(
    err instanceof Error ? err.message : "Failed to open document."
  );
}

}

async function deleteBooking(id: number) {
if (!confirm(“Are you sure you want to delete this booking?”)) return;

try {
  const res = await fetch("/api/admin/confirmed/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify({ id }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to delete booking.");
  }
  await loadBookings();
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Failed to delete booking."
  );
}

}

if (!authed) {
return (
Admin Login
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="password"
          placeholder="Admin Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  </main>
);

}

return (
<main className=“min-h-screen p-6” style={{ background: BG }}>
<header
className=“mb-6 p-4 rounded flex flex-wrap gap-3 justify-between items-center”
style={{ backgroundColor: MOCHA, color: “white” }}
>
Confirmed Bookings

    <div className="flex gap-2">
      <button
        onClick={() => {
          setError("");
          setShowAddForm((previous) => !previous);
        }}
        className="bg-white text-black px-4 py-2 rounded font-semibold"
      >
        {showAddForm ? "Cancel" : "+ Add Booking"}
      </button>
      <button
        onClick={loadBookings}
        className="bg-white/20 px-4 py-2 rounded"
      >
        Refresh
      </button>
    </div>
  </header>
  {error && (
    <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
      {error}
    </p>
  )}
  {showAddForm && (
    <form
      onSubmit={addBooking}
      className="bg-white p-5 rounded shadow mb-6"
    >
      <h2 className="text-lg font-bold mb-4">Add Confirmed Booking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          Guest Name *
          <input
            className="border rounded p-2 w-full mt-1"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Phone Number *
          <input
            className="border rounded p-2 w-full mt-1"
            type="tel"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Number of Guests *
          <input
            className="border rounded p-2 w-full mt-1"
            type="number"
            min="1"
            step="1"
            value={form.guests}
            onChange={(e) => updateForm("guests", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Occasion
          <input
            className="border rounded p-2 w-full mt-1"
            value={form.occasion}
            onChange={(e) => updateForm("occasion", e.target.value)}
            placeholder="Birthday, wedding, etc."
          />
        </label>
        <label className="text-sm">
          Check-in *
          <input
            className="border rounded p-2 w-full mt-1"
            type="date"
            value={form.check_in}
            onChange={(e) => updateForm("check_in", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Check-out *
          <input
            className="border rounded p-2 w-full mt-1"
            type="date"
            min={form.check_in || undefined}
            value={form.check_out}
            onChange={(e) => updateForm("check_out", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Total Amount (₹) *
          <input
            className="border rounded p-2 w-full mt-1"
            type="number"
            min="0"
            step="0.01"
            value={form.total_amount}
            onChange={(e) => updateForm("total_amount", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Amount Paid (₹) *
          <input
            className="border rounded p-2 w-full mt-1"
            type="number"
            min="0"
            step="0.01"
            value={form.amount_paid}
            onChange={(e) => updateForm("amount_paid", e.target.value)}
            required
          />
        </label>
      </div>
      <p className="text-sm text-gray-600 mt-3">
        Amount due: ₹
        {Math.max(
          0,
          (Number(form.total_amount) || 0) -
            (Number(form.amount_paid) || 0)
        )}
      </p>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 bg-black text-white px-5 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Booking"}
      </button>
    </form>
  )}
  {loading && <p>Loading bookings...</p>}
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
