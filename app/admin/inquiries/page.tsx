"use client";

import React, { useEffect, useState } from "react";

export default function AdminInquiriesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [error, setError] = useState("");

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  // -----------------------------
  // FETCH INQUIRIES
  // -----------------------------
  useEffect(() => {
    if (!authed) return;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/api/inquiries/list");
        const json = await res.json();

        // Extract real array safely
        const arr = json.inquiries || [];

        setInquiries(arr);
      } catch (err) {
        console.error(err);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authed]);

  // -----------------------------
  // LOGIN SCREEN
  // -----------------------------
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -----------------------------
  // ADMIN TABLE
  // -----------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <h1 className="text-3xl font-bold mb-6">All Inquiries</h1>

      {loading && <p className="text-lg">Loading inquiries...</p>}

      {!loading && inquiries.length === 0 && (
        <p className="text-gray-600">No inquiries found.</p>
      )}

      {!loading && inquiries.length > 0 && (
        <div className="overflow-auto border rounded shadow bg-white">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#C29F80] text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Guests</th>
                <th className="p-3 text-left">Occasion</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Submitted</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((i) => (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i.full_name}</td>
                  <td className="p-3">{i.phone}</td>
                  <td className="p-3">{i.email || "-"}</td>
                  <td className="p-3">{i.guests}</td>
                  <td className="p-3">{i.occasion || "-"}</td>
                  <td className="p-3">{i.check_in}</td>
                  <td className="p-3">{i.check_out}</td>
                  <td className="p-3">
                    {i.created_at
                      ? new Date(i.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
