"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminCalendarPage() {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");

  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState("");

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

  // -----------------------------
  // Load Blocked Dates
  // -----------------------------
  const loadBlocked = async () => {
    try {
      setError("");
      const res = await fetch("/api/admin/blocked", {
        headers: {
          "x-admin-password": ADMIN_PASS,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const arr = (data.blocked || []).map((item: any) => new Date(item.date));
      setBlockedDates(arr);
    } catch (err: any) {
      console.log(err);
      setError("Failed to load blocked dates.");
    }
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // -----------------------------
  // Login Handler
  // -----------------------------
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) setAuthed(true);
    else setError("Incorrect password");
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
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
  // Toggle selection
  // -----------------------------
  const handleDayClick = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");

    const exists = selectedDates.some((d) => format(d, "yyyy-MM-dd") === iso);

    if (exists) {
      setSelectedDates(selectedDates.filter((d) => format(d, "yyyy-MM-dd") !== iso));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  // -----------------------------
  // BLOCK SELECTED
  // -----------------------------
  const blockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      setError("");

      const payload = {
        dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
      };

      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSelectedDates([]);
      loadBlocked();
    } catch (err: any) {
      console.log(err);
      setError("Failed to block selected dates.");
    }
  };

  // -----------------------------
  // UNBLOCK SELECTED
  // -----------------------------
  const unblockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      setError("");

      const payload = {
        dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
      };

      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSelectedDates([]);
      loadBlocked();
    } catch (err: any) {
      console.log(err);
      setError("Failed to unblock selected dates.");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded text-white"
        style={{ backgroundColor: "#C29F80" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <button
              onClick={loadBlocked}
              className="px-3 py-1 rounded border bg-white text-black"
            >
              Refresh
            </button>
          </div>

          <DayPicker
            mode="multiple"
            selected={selectedDates}
            onDayClick={handleDayClick}
            numberOfMonths={1}
            modifiers={{
              blocked: blockedDates,
            }}
            modifiersStyles={{
              blocked: {
                backgroundColor: "red",
                color: "white",
              },
              selected: {
                backgroundColor: "#0F1F0F",
                color: "white",
              },
            }}
          />

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex gap-3 mt-4">
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

        {/* RIGHT SIDE */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 && (
            <p className="text-gray-500">No blocked dates.</p>
          )}

          <ul className="space-y-2">
            {blockedDates.map((d) => (
              <li key={d.toString()} className="bg-[#fff6f0] p-2 rounded">
                {format(d, "dd MMM yyyy")}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
