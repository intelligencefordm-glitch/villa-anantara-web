"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  id_proof_path?: string | null;
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
const emptyForm: BookingForm = {
  name: "",
  phone: "",
  guests: "1",
  occasion: "",
  check_in: "",
  check_out: "",
  total_amount: "",
  amount_paid: "0",
};
function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
export default function ConfirmedBookingsPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState<number | null>(null);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setError("Please enter your admin password.");
      return;
    }
    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
    setError("");
    setNotice("");
  }
  function handleUnauthorized(message: string) {
    setAuthed(false);
    setPassword("");
    setPasswordInput("");
    setBookings([]);
    setError(message || "Your session expired. Please log in again.");
  }
  async function loadBookings() {
    if (!password) return;
    try {
      setLoading(true);
      setError("");
      setNotice("");
      const res = await fetch("/api/admin/confirmed/list", {
        method: "GET",
        headers: {
          "x-admin-password": password,
        },
        cache: "no-store",
      });
      const json = await res.json();
      if (res.status === 401) {
        handleUnauthorized("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(json.error || "Failed to load bookings.");
      }
      setBookings(Array.isArray(json.bookings) ? json.bookings : []);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password]);
  const monthlyBookings = useMemo(() => {
    return bookings
      .filter((booking) => booking.check_in?.slice(0, 7) === selectedMonth)
      .sort((a, b) => a.check_in.localeCompare(b.check_in));
  }, [bookings, selectedMonth]);
  const monthlyTotal = monthlyBookings.reduce(
    (sum, booking) => sum + Number(booking.total_amount || 0),
    0
  );
  const monthlyPaid = monthlyBookings.reduce(
    (sum, booking) => sum + Number(booking.amount_paid || 0),
    0
  );
  const monthlyDue = monthlyBookings.reduce(
    (sum, booking) => sum + Number(booking.amount_due || 0),
    0
  );
  const fullyPaidCount = monthlyBookings.filter(
    (booking) => Number(booking.amount_due || 0) <= 0
  ).length;
  async function addBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      handleUnauthorized("Please log in again before adding a booking.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    const total = Number(form.total_amount);
    const paid = Number(form.amount_paid);
    const guestCount = Number(form.guests);
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.check_in ||
      !form.check_out ||
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      !Number.isFinite(total) ||
      total < 0 ||
      !Number.isFinite(paid) ||
      paid < 0 ||
      paid > total
    ) {
      setError("Please check the booking details and payment amounts.");
      setSaving(false);
      return;
    }
    if (form.check_out <= form.check_in) {
      setError("Check-out must be after check-in.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/confirmed/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          guests: guestCount,
          occasion: form.occasion.trim(),
          check_in: form.check_in,
          check_out: form.check_out,
          total_amount: total,
          amount_paid: paid,
        }),
      });
      const json = await res.json();
      if (res.status === 401) {
        handleUnauthorized("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(
          json.error || "Could not save the booking."
        );
      }
      setForm(emptyForm);
      setShowAddForm(false);
      setNotice("Booking added successfully.");
      await loadBookings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the booking."
      );
    } finally {
      setSaving(false);
    }
  }
  async function markAsPaid(booking: Booking) {
    if (Number(booking.amount_due || 0) <= 0) {
      setNotice("This booking is already fully paid.");
      return;
    }
    const confirmed = window.confirm(
      `Mark ${booking.name}'s booking as fully paid?\n\n` +
        `Outstanding amount: ${money(Number(booking.amount_due))}`
    );
    if (!confirmed) return;
    setMarkingPaidId(booking.id);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/confirmed/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id: booking.id }),
      });
      const json = await res.json();
      if (res.status === 401) {
        handleUnauthorized("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(
          json.error ||
            "Could not mark this booking as paid. Check that the mark-paid API route exists."
        );
      }
      setNotice(`${booking.name}'s booking is now fully paid.`);
      await loadBookings();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not mark this booking as paid."
      );
    } finally {
      setMarkingPaidId(null);
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
      if (res.status === 401) {
        handleUnauthorized("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok || !json.url) {
        throw new Error(json.error || "Failed to open document.");
      }
      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to open document.");
    }
  }
  async function deleteBooking(id: number) {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    setError("");
    setNotice("");
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
      if (res.status === 401) {
        handleUnauthorized("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(json.error || "Could not delete booking.");
      }
      setNotice("Booking deleted successfully.");
      await loadBookings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete booking."
      );
    }
  }
  if (!authed) {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: BG }}
      >
        <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin Login
          </h2>
          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-3 rounded"
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen p-4 md:p-6" style={{ background: BG }}>
      <header
        className="mb-6 p-4 rounded-lg flex flex-col gap-3 md:flex-row md:justify-between md:items-center"
        style={{ backgroundColor: MOCHA, color: "white" }}
      >
        <h1 className="text-xl md:text-2xl font-bold">
          Confirmed Bookings
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowAddForm((current) => !current);
              setError("");
              setNotice("");
            }}
            className="bg-white text-black px-4 py-2 rounded font-semibold"
          >
            {showAddForm ? "Cancel Add" : "+ Add Booking"}
          </button>
          <button
            onClick={loadBookings}
            disabled={loading}
            className="bg-white/20 border border-white/60 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {notice && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {notice}
        </div>
      )}
      {showAddForm && (
        <section className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">
            Add Confirmed Booking
          </h2>
          <form
            onSubmit={addBooking}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <label className="text-sm font-medium">
              Guest Name *
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="Full name"
              />
            </label>
            <label className="text-sm font-medium">
              Phone Number *
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="Phone number"
              />
            </label>
            <label className="text-sm font-medium">
              Number of Guests *
              <input
                required
                min="1"
                step="1"
                type="number"
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <label className="text-sm font-medium">
              Occasion
              <input
                value={form.occasion}
                onChange={(e) =>
                  setForm({ ...form, occasion: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="Birthday, family stay, etc."
              />
            </label>
            <label className="text-sm font-medium">
              Check-in *
              <input
                required
                type="date"
                value={form.check_in}
                onChange={(e) =>
                  setForm({ ...form, check_in: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <label className="text-sm font-medium">
              Check-out *
              <input
                required
                type="date"
                min={form.check_in || undefined}
                value={form.check_out}
                onChange={(e) =>
                  setForm({ ...form, check_out: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <label className="text-sm font-medium">
              Total Amount (₹) *
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.total_amount}
                onChange={(e) =>
                  setForm({ ...form, total_amount: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <label className="text-sm font-medium">
              Amount Paid (₹) *
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.amount_paid}
                onChange={(e) =>
                  setForm({ ...form, amount_paid: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <div className="md:col-span-2 bg-gray-50 border rounded p-3">
              <span className="text-sm text-gray-600">Amount Due: </span>
              <strong>
                {money(
                  Math.max(
                    0,
                    Number(form.total_amount || 0) -
                      Number(form.amount_paid || 0)
                  )
                )}
              </strong>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-5 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Booking"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setForm(emptyForm);
                }}
                className="border px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
      <section className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Monthly Booking View</h2>
            <p className="text-sm text-gray-600">
              Bookings are grouped by check-in month.
            </p>
          </div>
          <label className="text-sm font-medium">
            Select Month
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block mt-1 border p-2 rounded"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="rounded p-3 bg-[#EFE5D5]">
            <p className="text-xs text-gray-600">Bookings</p>
            <p className="text-xl font-bold">{monthlyBookings.length}</p>
          </div>
          <div className="rounded p-3 bg-[#EFE5D5]">
            <p className="text-xs text-gray-600">Total Booking Value</p>
            <p className="text-lg font-bold">{money(monthlyTotal)}</p>
          </div>
          <div className="rounded p-3 bg-[#EFE5D5]">
            <p className="text-xs text-gray-600">Payments Received</p>
            <p className="text-lg font-bold">{money(monthlyPaid)}</p>
          </div>
          <div className="rounded p-3 bg-[#EFE5D5]">
            <p className="text-xs text-gray-600">Outstanding Due</p>
            <p className="text-lg font-bold">{money(monthlyDue)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Fully paid bookings: {fullyPaidCount} of {monthlyBookings.length}
        </p>
      </section>
      {loading && <p className="mb-4">Loading bookings...</p>}
      {!loading && monthlyBookings.length === 0 && (
        <p className="bg-white p-4 rounded-lg">
          No bookings found for this month.
        </p>
      )}
      <ul className="space-y-4">
        {monthlyBookings.map((booking) => {
          const due = Number(booking.amount_due || 0);
          const paid = due <= 0;
          return (
            <li
              key={booking.id}
              className="bg-white p-5 rounded-lg shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <p className="font-semibold text-lg">{booking.name}</p>
                  <p className="text-sm text-gray-600">{booking.phone}</p>
                  <p className="text-sm mt-1">
                    {format(
                      new Date(`${booking.check_in.slice(0, 10)}T00:00:00`),
                      "dd MMM yyyy"
                    )}
                    {" → "}
                    {format(
                      new Date(`${booking.check_out.slice(0, 10)}T00:00:00`),
                      "dd MMM yyyy"
                    )}
                  </p>
                  <p className="text-sm mt-1">
                    Guests: {booking.guests || 1}
                    {booking.occasion
                      ? ` • Occasion: ${booking.occasion}`
                      : ""}
                  </p>
                </div>
                <div className="md:text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      paid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {paid ? "PAID" : "PAYMENT DUE"}
                  </span>
                  <p className="text-sm mt-2">
                    Paid:{" "}
                    <strong>
                      {money(Number(booking.amount_paid || 0))}
                    </strong>
                  </p>
                  <p className="text-sm">
                    Total:{" "}
                    <strong>
                      {money(Number(booking.total_amount || 0))}
                    </strong>
                  </p>
                  <p className="text-sm">
                    Due: <strong>{money(due)}</strong>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                {booking.id_proof_path && (
                  <button
                    onClick={() => openDocument(booking.id_proof_path)}
                    className="text-blue-700 font-semibold"
                  >
                    View / Download ID Proof
                  </button>
                )}
                {booking.payment_proof_path && (
                  <button
                    onClick={() =>
                      openDocument(booking.payment_proof_path)
                    }
                    className="text-green-700 font-semibold"
                  >
                    View / Download Payment Proof
                  </button>
                )}
                {!paid && (
                  <button
                    onClick={() => markAsPaid(booking)}
                    disabled={markingPaidId === booking.id}
                    className="text-green-700 font-semibold disabled:opacity-50"
                  >
                    {markingPaidId === booking.id
                      ? "Updating..."
                      : "✓ Mark as Paid"}
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(booking.id)}
                  className="text-red-600 font-semibold"
                >
                  Delete Booking
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
