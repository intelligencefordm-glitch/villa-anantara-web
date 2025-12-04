"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const mocha = "#C29F80";
const red = "#ff4d4d";

export default function AdminCalendarPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState("");

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Fetch blocked dates WITH PASSWORD HEADER
  const loadBlocked = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blocked", {
        headers: { "x-admin-password": adminPassword ?? "" },
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load blocked dates");
        return;
      }

      const arr = json.blocked || [];
      setBlockedDates(arr.map((d: any) => new Date(d.date)));
    } catch (err) {
      setError("Fetch failed");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // Toggle selected date
  const handleDayClick = (date: Date) => {
    const exists = selectedDates.some(
      (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    if (exists) {
      setSelectedDates(selectedDates.filter(
        (d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  // BLOCK selected dates
  const blockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword ?? "",
        },
        body: JSON.stringify({
          dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to block dates");
      }

      await loadBlocked();
      setSelectedDates([]);
    } catch {
      setError("Failed to block");
    }
  };

  // UNBLOCK selected dates
  const unblockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword ?? "",
        },
        body: JSON.stringify({
          dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to unblock dates");
      }

      await loadBlocked();
      setSelectedDates([]);
    } catch {
      setError("Failed to unblock");
    }
  };

  // LOGIN FORM
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Admin Login
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === adminPassword) {
                setAuthed(true);
              } else {
                setError("Incorrect password");
              }
            }}
            className="space-y-4"
          >
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

  // MAIN ADMIN PAGE
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header className="mb-6 p-4 rounded" style={{ backgroundColor: mocha }}>
        <h1 className="text-2xl font-bold text-white">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE — Calendar */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>

            <button
              onClick={loadBlocked}
              className="px-3 py-1 rounded border bg-white"
            >
              Refresh
            </button>
          </div>

          <DayPicker
            mode="multiple"
            selected={selectedDates}
            onDayClick={handleDayClick}
            modifiers={{ blocked: blockedDates }}
            modifiersStyles={{
              blocked: { backgroundColor: red, color: "white" },
              selected: { backgroundColor: "#000", color: "white" },
            }}
            numberOfMonths={1}
          />

          {error && <p className="text-red-600 mt-3">{error}</p>}

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

        {/* RIGHT SIDE — List */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p>No blocked dates.</p>
          ) : (
            <ul className="space-y-2">
              {blockedDates.map((d) => (
                <li key={d.toISOString()} className="bg-[#fff6f0] p-2 rounded">
                  {format(d, "dd MMM yyyy")}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}
