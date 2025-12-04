"use client";

import React, { useEffect, useState } from "react";

export default function AdminInquiriesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");

  const loadInquiries = async () => {
    const res = await fetch("/api/inquiries/list");
    const json = await res.json();
    setList(json.inquiries || []);
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;

    await fetch("/api/inquiries/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });

    setSelected([]);
    await loadInquiries();
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      loadInquiries();
    } else {
      setError("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="w-full border p-2 rounded mb-3"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <button
              className="w-full bg-[#0F1F0F] text-white py-2 rounded"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">Inquiries</h1>

      <button
        className="mb-4 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={selected.length === 0}
        onClick={deleteSelected}
      >
        Delete Selected ({selected.length})
      </button>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="w-full text-left">
          <thead className="bg-[#C29F80] text-white">
            <tr>
              <th className="p-3">Select</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Occasion</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
              <th className="p-3">Nights</th>
              <th className="p-3">Payment Status</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No inquiries.
                </td>
              </tr>
            )}

            {list.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">{item.guests}</td>
                <td className="p-3">{item.occassion}</td>
                <td className="p-3">{item.check_in}</td>
                <td className="p-3">{item.check_out}</td>
                <td className="p-3">{item.nights}</td>
                <td className="p-3">{item.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
