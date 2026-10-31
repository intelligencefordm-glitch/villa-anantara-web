"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

type InquiryStatus = "New Inquiry" | "Currently Talking" | "Rejected";

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  guests: number;
  occasion?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  created_at: string;
  status?: InquiryStatus;
};

type InquiryForm = {
  name: string;
  phone: string;
  email: string;
  guests: string;
  occasion: string;
  check_in: string;
  check_out: string;
};

const EMPTY_FORM: InquiryForm = {
  name: "",
  phone: "",
  email: "",
  guests: "1",
  occasion: "",
  check_in: "",
  check_out: "",
};

const STATUSES: InquiryStatus[] = [
  "New Inquiry",
  "Currently Talking",
  "Rejected",
];

export default function AdminInquiriesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState(() =>
    typeof window !== "undefined" ? window.sessionStorage.getItem("va_admin") || "" : ""
  );
  const [authed, setAuthed] = useState(() =>
    typeof window !== "undefined" && !!window.sessionStorage.getItem("va_admin")
  );

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [checkInFilter, setCheckInFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM);

  const mocha = "#1d2a1d";

  useEffect(() => {
    if (authed && password) loadInquiries(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInquiries(currentPassword = password) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries/list", {
        cache: "no-store",
        headers: { "x-admin-password": currentPassword },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load inquiries");

      setInquiries(
        (json.inquiries || []).map((inq: Inquiry) => ({
          ...inq,
          status: inq.status || "New Inquiry",
        }))
      );
    } catch (err) {
      console.error("Load inquiries error:", err);
      setError("Failed to load inquiries. Please refresh or log in again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!passwordInput) {
      setError("Enter admin password");
      return;
    }

    try {
      const check = await fetch("/api/admin/blocked", {
        headers: { "x-admin-password": passwordInput },
        cache: "no-store",
      });

      if (!check.ok) {
        setError("Incorrect password");
        return;
      }

      setPassword(passwordInput);
      setAuthed(true);
      setPasswordInput("");
      await loadInquiries(passwordInput);
    } catch {
      setError("Unable to verify your password. Please try again.");
    }
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditForm(inq: Inquiry) {
    setEditingId(inq.id);
    setForm({
      name: inq.name || "",
      phone: inq.phone || "",
      email: inq.email || "",
      guests: String(inq.guests || 1),
      occasion: inq.occasion || "",
      check_in: inq.check_in?.slice(0, 10) || "",
      check_out: inq.check_out?.slice(0, 10) || "",
    });
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function updateForm(field: keyof InquiryForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function saveInquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone number are required.");
      return;
    }

    if (!form.check_in || !form.check_out || form.check_out <= form.check_in) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }

    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 100) {
      setError("Enter a valid number of guests (1–100).");
      return;
    }

    const nights = Math.round(
      (Date.parse(`${form.check_out}T00:00:00Z`) -
        Date.parse(`${form.check_in}T00:00:00Z`)) /
        (24 * 60 * 60 * 1000)
    );

    setSaving(true);

    try {
      const endpoint = editingId
        ? "/api/inquiries/update"
        : "/api/inquiries/add";

      const payload = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        guests,
        occasion: form.occasion.trim(),
        check_in: form.check_in,
        check_out: form.check_out,
        nights,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to save inquiry.");

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setNotice(editingId ? "Inquiry updated successfully." : "Inquiry added successfully.");
      await loadInquiries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save inquiry.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: number, status: InquiryStatus) {
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/inquiries/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status.");

      setInquiries((previous) =>
        previous.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      setNotice("Inquiry status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
      await loadInquiries();
    }
  }

  async function deleteInquiry(id: number) {
    if (!confirm("Delete this inquiry permanently?")) return;

    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/inquiries/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete inquiry.");

      setInquiries((previous) => previous.filter((inq) => inq.id !== id));
      setNotice("Inquiry deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inquiry.");
    }
  }

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = inquiries.filter((inq) => {
      const matchesSearch =
        !normalizedSearch ||
        (inq.name || "").toLowerCase().includes(normalizedSearch) ||
        (inq.phone || "").toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || (inq.status || "New Inquiry") === statusFilter;

      const matchesCheckIn =
        !checkInFilter || inq.check_in?.slice(0, 10) === checkInFilter;

      return matchesSearch && matchesStatus && matchesCheckIn;
    });

    return result.sort((a, b) => {
      if (sortBy === "earliest") return a.check_in.localeCompare(b.check_in);
      if (sortBy === "latest") return b.check_in.localeCompare(a.check_in);
      return (b.created_at || "").localeCompare(a.created_at || "");
    });
  }, [inquiries, search, statusFilter, checkInFilter, sortBy]);

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-center text-2xl font-semibold text-[#0F1F0F]">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded border p-3"
              autoComplete="current-password"
              required
            />

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-[#0F1F0F] py-3 font-semibold text-white disabled:opacity-60"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand p-4 sm:p-6">
      <header
        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg p-4 text-white sm:p-5"
        style={{ backgroundColor: mocha }}
      >
        <div>
          <h1 className="font-display tracking-wide text-3xl md:text-4xl font-medium">Inquiries</h1>
          <p className="text-sm opacity-90">Manage Villa Anant enquiries</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openAddForm}
            className="rounded bg-[#0F1F0F] px-4 py-2 font-semibold text-white"
          >
            + Add Inquiry
          </button>
          <button
            onClick={() => loadInquiries()}
            disabled={loading}
            className="rounded bg-white px-4 py-2 font-semibold text-[#0F1F0F] disabled:opacity-60"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-4 rounded bg-white p-3 text-red-600">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-4 rounded bg-white p-3 text-green-700">
          {notice}
        </p>
      )}

      {showForm && (
        <section className="mb-6 rounded-lg bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold text-[#0F1F0F]">
            {editingId ? "Edit Inquiry" : "Add Inquiry"}
          </h2>

          <form onSubmit={saveInquiry} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Customer Name *
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Phone Number *
              <input
                required
                maxLength={20}
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Number of Guests *
              <input
                type="number"
                min="1"
                max="100"
                required
                value={form.guests}
                onChange={(e) => updateForm("guests", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Check-in *
              <input
                type="date"
                required
                value={form.check_in}
                onChange={(e) => updateForm("check_in", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium">
              Check-out *
              <input
                type="date"
                required
                min={form.check_in || undefined}
                value={form.check_out}
                onChange={(e) => updateForm("check_out", e.target.value)}
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Occasion
              <input
                value={form.occasion}
                onChange={(e) => updateForm("occasion", e.target.value)}
                maxLength={200}
                placeholder="Family stay, birthday, etc."
                className="mt-1 w-full rounded border p-3"
              />
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-[#0F1F0F] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Inquiry"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                className="rounded border px-5 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mb-6 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone..."
          className="rounded border p-3"
          aria-label="Search inquiries"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border p-3"
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={checkInFilter}
          onChange={(e) => setCheckInFilter(e.target.value)}
          className="rounded border p-3"
          aria-label="Filter by check-in date"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded border p-3"
          aria-label="Sort inquiries"
        >
          <option value="newest">Newest inquiries</option>
          <option value="earliest">Earliest check-in</option>
          <option value="latest">Latest check-in</option>
        </select>
      </section>

      <section className="rounded-lg bg-white p-4 shadow sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#0F1F0F]">
            Customer Inquiries ({filteredInquiries.length})
          </h2>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>

        {!loading && filteredInquiries.length === 0 && (
          <p className="py-8 text-center text-gray-500">No matching inquiries found.</p>
        )}

        <ul className="space-y-4">
          {filteredInquiries.map((inq) => (
            <li
              key={inq.id}
              className="rounded-lg border bg-[#fff9f3] p-4 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1F0F]">{inq.name}</h3>
                  <p className="text-sm text-gray-600">Inquiry #{inq.id}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openEditForm(inq)}
                    className="rounded bg-[#C29F80] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteInquiry(inq.id)}
                    className="rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <p><strong>Phone:</strong> {inq.phone}</p>
                {inq.email && <p><strong>Email:</strong> {inq.email}</p>}
                <p><strong>Guests:</strong> {inq.guests}</p>
                <p><strong>Occasion:</strong> {inq.occasion || "—"}</p>
                <p>
                  <strong>Dates:</strong>{" "}
                  {format(new Date(`${inq.check_in.slice(0, 10)}T00:00:00`), "dd MMM yyyy")}{" "}
                  →{" "}
                  {format(new Date(`${inq.check_out.slice(0, 10)}T00:00:00`), "dd MMM yyyy")}
                </p>
                <p><strong>Nights:</strong> {inq.nights}</p>
                <p className="text-gray-600 sm:col-span-2">
                  <strong>Submitted:</strong>{" "}
                  {inq.created_at
                    ? format(new Date(inq.created_at), "dd MMM yyyy, hh:mm a")
                    : "Manually added"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[#e7d6c7] pt-3">
                <label className="text-sm font-semibold text-[#0F1F0F]">
                  Status
                </label>
                <select
                  value={inq.status || "New Inquiry"}
                  onChange={(e) =>
                    updateStatus(inq.id, e.target.value as InquiryStatus)
                  }
                  className="min-w-48 rounded border bg-white p-2"
                  aria-label={`Status for ${inq.name}`}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
