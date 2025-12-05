"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  occasion: string;
  check_in: string;
  check_out: string;
  nights: number;
  created_at: string;
};

export default function AdminInquiriesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mocha = "#C29F80";

  // ---------------------------------------
  // LOAD INQUIRIES
  // ---------------------------------------
  const loadInquiries = async (usePassword = password) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries/list", {
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load inquiries");

      setInquiries(json.inquiries || []);
    } catch (err: any) {
      console.error("Load inquiries error:", err);
      setError("Failed to load inquiries");
    }

    setLoading(false);
  };

  // ---------------------------------------
  // LOGIN CHECK (Reuses same ADMIN_PASSWORD)
  // ---------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return setError("Enter admin password");

    // Try a protected route to validate password
    const check = await fetch("/api/admin/blocked", {
      headers: { "x-admin-password": passwordInput },
    });

    if (!check.ok) {
      setError("Incorrect password");
      return;
    }

    setPassword(passwordInput);
    setPasswordInput("");
    setAuthed(true);
    loadInquiries();
  };

  // ---------------------------------------
  // DELETE INQUIRY
  // ---------------------------------------
  const deleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry?")) return;

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
      if (!res.ok) throw new Error(json.error || "Failed to delete");

      await loadInquiries();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError("Failed to delete inquiry");
    }
  };

  // ---------------------------------------
  // LOGIN SCREEN
  // ---------------------------------------
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

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold"
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ---------------------------------------
  // MAIN PAGE
  // ---------------------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded flex justify-between items-center"
        style={{ backgroundColor: mocha, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Inquiries</h1>

        {/* REFRESH BUTTON */}
        <button
          onClick={() => loadInquiries()}
          className="bg-white text-black px-4 py-2 rounded shadow"
        >
          Refresh
        </button>
      </header>

      {error && (
        <p className="text-red-600 bg-white p-3 rounded mb-4">{error}</p>
      )}

      <div className="bg-white p-6 rounded shadow">
        {inquiries.length === 0 && (
          <p className="text-gray-500 text-center py-6">No inquiries found.</p>
        )}

        <ul className="space-y-4">
          {inquiries.map((inq) => (
            <li
              key={inq.id}
              className="border rounded p-4 bg-[#fff9f3] shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{inq.name}</h2>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteInquiry(inq.id)}
                  className="text-white bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

              <p><strong>Phone:</strong> {inq.phone}</p>
              {inq.email && <p><strong>Email:</strong> {inq.email}</p>}

              <p><strong>Guests:</strong> {inq.guests}</p>
              <p><strong>Occasion:</strong> {inq.occasion}</p>

              <p>
                <strong>Dates:</strong>{" "}
                {format(new Date(inq.check_in), "dd MMM yyyy")} →{" "}
                {format(new Date(inq.check_out), "dd MMM yyyy")}
              </p>

              <p><strong>Nights:</strong> {inq.nights}</p>

              <p className="text-sm text-gray-600 mt-2">
                Submitted on: {format(new Date(inq.created_at), "dd MMM yyyy hh:mm a")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
