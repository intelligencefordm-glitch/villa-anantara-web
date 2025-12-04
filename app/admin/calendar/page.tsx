"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export default function AdminCalendar() {
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN
  // ================================
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setAuthed(true);
      setPasswordInput("");
    } else {
      setError("Incorrect password");
    }
  };

  // ================================
  // LOAD BLOCKED DATES
  // ================================
  const loadBlocked = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blocked", {
        headers: { "x-admin-password": ADMIN_PASS },
      });
      const json = await res.json();
      setBlockedDates(json.blocked.map((b: any) => new Date(b.date)));
    } catch (err) {
      setError("Failed to load blocked dates.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // ================================
  // TOGGLE DATE SELECTION (UI only)
  // ================================
  const handleDayClick = (day: Date) => {
    const exists = selectedDates.find(
      (d) => format(d, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );

    if (exists) {
      setSelectedDates(selectedDates.filter((d) => d !== exists));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  // ================================
  // BLOCK SELECTED DATES
  // ================================
  const blockSelected = async () => {
    if (!selectedDates.length) return;

    for (const d of selectedDates) {
      await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify({ date: format(d, "yyyy-MM-dd") }),
      });
    }

    setSelectedDates([]);
    loadBlocked();
  };

  // ================================
  // UNBLOCK SELECTED DATES
  // ================================
  const unblockSelected = async () => {
    if (!selectedDates.length) return;

    for (const d of selectedDates) {
      await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify({ date: format(d, "yyyy-MM-dd") }),
      });
    }

    setSelectedDates([]);
    loadBlocked();
  };

  // ================================
  // LOGIN SCREEN
  // ================================
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
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

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="p-4 mb-6 rounded"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE — CALENDAR */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <button
              onClick={loadBlocked}
              className="px-3 py-1 border rounded bg-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <DayPicker
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              numberOfMonths={1}
              modifiers={{ blocked: blockedDates }}
              modifiersStyles={{
                blocked: {
                  backgroundColor: "#C29F80",
                  color: "white",
                },
              }}
            />
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={blockSelected}
              className="px-4 py-2 bg-[#0F1F0F] text-white rounded"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Unblock Selected
            </button>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* RIGHT SIDE — BLOCKED LIST */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p className="text-gray-500">No blocked dates.</p>
          ) : (
            <ul className="space-y-2">
              {blockedDates.map((d) => (
                <li
                  key={d.toISOString()}
                  className="p-2 bg-[#fceee3] rounded"
                >
                  {format(d, "dd MMM yyyy")}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
