"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Login check
  // -----------------------------
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

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
  // DASHBOARD UI
  // -----------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-8">
      <header
        className="p-4 rounded mb-8"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="opacity-90">Manage Villa Anantara</p>
      </header>

      {/* GRID BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Inquiries */}
        <button
          onClick={() => router.push("/admin/inquiries")}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition text-left border"
        >
          <h3 className="text-xl font-semibold mb-2 text-[#0F1F0F]">View Inquiries</h3>
          <p className="text-gray-600">See all booking interest submissions.</p>
        </button>

        {/* Calendar */}
        <button
          onClick={() => router.push("/admin/calendar")}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition text-left border"
        >
          <h3 className="text-xl font-semibold mb-2 text-[#0F1F0F]">Manage Calendar</h3>
          <p className="text-gray-600">Block dates or sync with Airbnb (coming soon).</p>
        </button>

        {/* Pricing */}
        <button
          onClick={() => router.push("/admin/pricing")}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition text-left border"
        >
          <h3 className="text-xl font-semibold mb-2 text-[#0F1F0F]">Pricing</h3>
          <p className="text-gray-600">Adjust weekday / weekend pricing.</p>
        </button>

        {/* Bookings */}
        <button
          onClick={() => router.push("/admin/confirmed")}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition text-left border"
        >
          <h3 className="text-xl font-semibold mb-2 text-[#0F1F0F]">Confirmed Bookings</h3>
          <p className="text-gray-600">Track confirmed guests.</p>
        </button>

        {/* Settings */}
        <button
          onClick={() => router.push("/admin/settings")}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition text-left border"
        >
          <h3 className="text-xl font-semibold mb-2 text-[#0F1F0F]">Settings</h3>
          <p className="text-gray-600">Website / admin custom settings.</p>
        </button>

        {/* Logout */}
        <button
          onClick={() => setAuthed(false)}
          className="bg-red-600 text-white p-6 rounded shadow hover:shadow-lg transition text-left"
        >
          <h3 className="text-xl font-semibold mb-2">Logout</h3>
          <p>End admin session.</p>
        </button>
      </div>
    </main>
  );
}
