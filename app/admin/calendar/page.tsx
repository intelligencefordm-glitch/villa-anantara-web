"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminCalendarPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); // 👈 FIXED
  const [authed, setAuthed] = useState(false);

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 👈 FIXED

  const mocha = "#C29F80";
  const red = "#B00020";

  // -------------------------------
  // LOAD BLOCKED DATES
  // -------------------------------
  const loadBlocked = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blocked", {
        method: "GET",
        headers: {
          "x-admin-password": adminPassword, // 👈 FIXED
        },
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed");

      setBlockedDates(
        (json.blocked || []).map((item: any) => item.date)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load blocked dates.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // LOGIN
  // -------------------------------
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (passwordInput === correctPassword) {
      setAdminPassword(passwordInput); // 👈 FIXED
      setAuthed(true);
      setPasswordInput("");
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  useEffect(() => {
    if (authed) loadBlocked(); // 👈 FIXED NAME
  }, [authed]);

  // -------------------------------
  // TOGGLE DAY SELECT
  // -------------------------------
  const handleDayClick = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");

    setSelectedDates((prev) =>
      prev.includes(iso)
        ? prev.filter((d) => d !== iso)
        : [...prev, iso]
    );
  };

  // -------------------------------
  // BLOCK SELECTED
  // -------------------------------
  async function blockSelected() {
    if (selectedDates.length === 0) return;

    try {
      setError("");

      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword, // 👈 FIXED
        },
        body: JSON.stringify({ dates: selectedDates }),
      });

      if (!res.ok) throw new Error("Failed to block dates");

      await loadBlocked();
      setSelectedDates([]);
    } catch (err) {
      console.error(err);
      setError("Failed to block selected dates.");
    }
  }

  // -------------------------------
  // UNBLOCK SELECTED
  // -------------------------------
  async function unblockSelected() {
    if (selectedDates.length === 0) return;

    try {
      setError("");

      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword, // 👈 FIXED
        },
        body: JSON.stringify({ dates: selectedDates }),
      });

      if (!res.ok) throw new Error("Failed to unblock dates");

      await loadBlocked();
      setSelectedDates([]);
    } catch (err) {
      console.error(err);
      setError("Failed to unblock selected dates.");
    }
  }

  // -------------------------------
  // LOGIN SCREEN
  // -------------------------------
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">
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
              className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -------------------------------
  // LOGGED-IN PAGE
  // -------------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded"
        style={{ backgroundColor: mocha, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>

            <button
              onClick={loadBlocked}
              className="px-3 py-1 rounded border"
            >
              Refresh
            </button>
          </div>

          <DayPicker
            mode="multiple"
            selected={selectedDates.map((d) => new Date(d))}
            onDayClick={handleDayClick}
            modifiers={{
              blocked: blockedDates.map((d) => new Date(d)),
              selectedDay: selectedDates.map((d) => new Date(d)),
            }}
            modifiersStyles={{
              blocked: { backgroundColor: red, color: "white" },
              selectedDay: { backgroundColor: "#0F1F0F", color: "white" },
            }}
          />

          {error && <p className="text-red-600 mt-3">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button
              onClick={blockSelected}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Unblock Selected
            </button>
          </div>
        </section>

        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 && (
            <p className="text-gray-500">No blocked dates.</p>
          )}

          <ul className="space-y-1 max-h-[50vh] overflow-y-auto">
            {blockedDates.map((date) => (
              <li
                key={date}
                className="p-2 rounded bg-[#fff6f0] border"
              >
                {format(new Date(date), "dd MMM yyyy")}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
