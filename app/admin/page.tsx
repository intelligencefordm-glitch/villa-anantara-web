"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EFE5D5] px-4">
        <div className="w-80 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-center text-xl font-semibold text-[#0F1F0F]">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded border border-gray-300 p-3"
              autoComplete="current-password"
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded bg-[#0F1F0F] py-3 font-semibold text-white transition hover:opacity-90"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6 sm:p-8">
      <header
        className="mb-8 rounded-lg p-5 sm:p-6"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 opacity-90">Manage Villa Anant</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <button
          onClick={() => router.push("/admin/inquiries")}
          className="rounded-lg border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="mb-2 text-xl font-semibold text-[#0F1F0F]">
            Inquiries
          </h2>
          <p className="text-gray-600">
            View and manage customer booking inquiries.
          </p>
        </button>

        <button
          onClick={() => router.push("/admin/confirmed")}
          className="rounded-lg border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="mb-2 text-xl font-semibold text-[#0F1F0F]">
            Confirmed Bookings
          </h2>
          <p className="text-gray-600">
            View and manage confirmed reservations.
          </p>
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            setAuthed(false);
            setPasswordInput("");
            setError("");
          }}
          className="rounded-md bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
