"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Updated Villa Anantara admin page:
 * - Envelope colors (light BG + dark primary)
 * - Username field added to login
 * - Show / hide password toggle
 * - Logo support: place file at /public/logo.png
 * - Keeps same dashboard UI when authed
 *
 * Environment variables used:
 * - NEXT_PUBLIC_ADMIN_PASSWORD  (required)
 * - NEXT_PUBLIC_ADMIN_USERNAME  (optional; if set username must match)
 */

export default function AdminDashboard() {
  const router = useRouter();

  // login fields
  const [username, setUsername] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // auth state
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  // envelope colors (can tweak if you want exact shades)
  const BG_LIGHT = "#E7F3FF"; // envelope light blue
  const BTN_DARK = "#0A2540"; // envelope dark blue / navy

  // -----------------------------
  // Login check
  // -----------------------------
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? ""; // optional

    // basic validation
    if (!passwordInput) {
      setError("Please enter the admin password.");
      return;
    }

    // If an admin username env var is provided, require it to match (case-insensitive)
    if (adminUsername && adminUsername.trim().length > 0) {
      if (!username || username.trim().toLowerCase() !== adminUsername.trim().toLowerCase()) {
        setError("Incorrect username");
        return;
      }
    }

    // password check (compare as plain text using env var as before)
    if (passwordInput === adminPassword) {
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
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG_LIGHT }}
      >
        <div
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                // If logo missing, ignore silently
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username (optional in logic) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Password with show/hide */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2 text-sm text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 rounded-md font-semibold text-white"
              style={{ background: BTN_DARK }}
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -----------------------------
  // DASHBOARD UI (after auth)
  // -----------------------------
  return (
    <main className="min-h-screen" style={{ background: BG_LIGHT }}>
      {/* Header with logo and title */}
      <header
        className="flex items-center justify-between p-4 md:p-6"
        style={{ backgroundColor: BTN_DARK, color: "white" }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm opacity-90">Manage Villa Anantara</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthed(false)}
            className="py-2 px-3 rounded bg-white text-[#0A2540] font-semibold hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-8">
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

          {/* Logout / Danger */}
          <button
            onClick={() => setAuthed(false)}
            className="bg-red-600 text-white p-6 rounded shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-xl font-semibold mb-2">Logout</h3>
            <p>End admin session.</p>
          </button>
        </div>
      </div>
    </main>
  );
}
