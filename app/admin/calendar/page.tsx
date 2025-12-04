"use client";

import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const mocha = "#C29F80";

export default function AdminCalendarPage() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adminPassword =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  // 🔥 Helper: convert Date → "yyyy-MM-dd"
  const toISO = (d: Date) => format(d, "yyyy-MM-dd");

  // ============================================================
  // 🔵 LOAD BLOCKED DATES FROM BACKEND
  // ============================================================
  const loadBlocked = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blocked", {
        headers: {
          "x-admin-password": adminPassword ?? "",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load");
        setLoading(false);
        return;
      }

      // Convert response into ISO date strings
      const arr: string[] = json.blocked.map((d: any) => d.date);

      setBlockedDates(arr);
    } catch (err) {
      setError("Fetch failed");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // ============================================================
  // 🔵 SELECT / UNSELECT A DATE
  // ============================================================
  const toggleSelect = (day: Date) => {
    const id = toISO(day);

    setSelectedDates((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // ============================================================
  // 🔴 BLOCK DATES
  // ============================================================
  const blockSelected = async () => {
    if (selectedDates.length === 0) {
      setError("No dates selected");
      return;
    }

    setError("");

    const res = await fetch("/api/admin/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword ?? "",
      },
      body: JSON.stringify({ dates: selectedDates }), // MUST BE ARRAY
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Block failed");
      return;
    }

    await loadBlocked();
    setSelectedDates([]);
  };

  // ============================================================
  // 🟢 UNBLOCK DATES
  // ============================================================
  const unblockSelected = async () => {
    if (selectedDates.length === 0) {
      setError("No dates selected");
      return;
    }

    setError("");

    const res = await fetch("/api/admin/unblock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword ?? "",
      },
      body: JSON.stringify({ dates: selectedDates }), // MUST BE ARRAY
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Unblock failed");
      return;
    }

    await loadBlocked();
    setSelectedDates([]);
  };

  // ============================================================
  // 🔐 LOGIN SCREEN
  // ============================================================
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <input
            type="password"
            placeholder="Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            className="w-full bg-[#0F1F0F] text-white py-2 rounded font-bold"
            onClick={() => {
              if (passwordInput === adminPassword) {
                setAuthed(true);
              } else {
                setError("Incorrect password");
              }
            }}
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // ============================================================
  // 🟦 MAIN ADMIN CALENDAR PAGE
  // ============================================================
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="p-4 rounded mb-6"
        style={{ backgroundColor: mocha, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT — Calendar */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">Calendar</h2>
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
              selected={selectedDates.map((d) => new Date(d))}
              onDayClick={toggleSelect}
              modifiers={{
                blocked: blockedDates.map((d) => new Date(d)),
              }}
              modifiersStyles={{
                blocked: {
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "6px",
                },
                selected: {
                  backgroundColor: "#0F1F0F",
                  color: "white",
                  borderRadius: "6px",
                },
              }}
            />
          )}

          {error && <p className="text-red-600 mt-3">{error}</p>}

          <div className="flex gap-4 mt-4">
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

        {/* RIGHT — Blocked Dates */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p>No blocked dates.</p>
          ) : (
            <ul className="space-y-2">
              {blockedDates.map((d) => (
                <li
                  key={d}
                  className="bg-[#fff0f0] p-2 rounded border border-red-300"
                >
                  {format(new Date(d), "dd MMM yyyy")}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
