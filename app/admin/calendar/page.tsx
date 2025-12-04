"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const mocha = "#C29F80";

export default function AdminCalendarPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  // ================================
  // FETCH BLOCKED DATES
  // ================================
  const loadBlocked = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blocked", {
        headers: { "x-admin-password": ADMIN_PASS },
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const arr = json.blocked || [];
      setBlockedDates(arr.map((d: any) => new Date(d.date)));
    } catch (err) {
      console.error(err);
      setError("Failed to load blocked dates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // ================================
  // SELECT DATES (multi-select)
  // ================================
  const toggleDate = (day: Date) => {
    const exists = selectedDates.find(
      (d) => format(d, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );

    if (exists) {
      setSelectedDates((prev) =>
        prev.filter(
          (d) => format(d, "yyyy-MM-dd") !== format(day, "yyyy-MM-dd")
        )
      );
    } else {
      setSelectedDates((prev) => [...prev, day]);
    }
  };

  // ================================
  // BLOCK SELECTED
  // ================================
  const blockSelected = async () => {
    if (selectedDates.length === 0) return alert("Select at least one date.");

    setError("");

    for (const day of selectedDates) {
      const iso = format(day, "yyyy-MM-dd");

      try {
        await fetch("/api/admin/block", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": ADMIN_PASS,
          },
          body: JSON.stringify({ date: iso }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    await loadBlocked();
    setSelectedDates([]);
  };

  // ================================
  // UNBLOCK SELECTED
  // ================================
  const unblockSelected = async () => {
    if (selectedDates.length === 0) return alert("Select at least one date.");

    setError("");

    for (const day of selectedDates) {
      const iso = format(day, "yyyy-MM-dd");

      try {
        await fetch("/api/admin/unblock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": ADMIN_PASS,
          },
          body: JSON.stringify({ date: iso }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    await loadBlocked();
    setSelectedDates([]);
  };

  // ================================
  // LOGIN
  // ================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
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

            <button className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold">
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ================================
  // MAIN PAGE
  // ================================
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded"
        style={{ backgroundColor: mocha, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <button
              onClick={loadBlocked}
              className="px-3 py-1 rounded border bg-white text-[#0F1F0F]"
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
              onDayClick={toggleDate}
              modifiers={{ blocked: blockedDates }}
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

          <div className="flex gap-3 mt-4">
            <button
              onClick={blockSelected}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Unblock Selected
            </button>
          </div>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </section>

        {/* RIGHT SIDE */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p className="text-gray-600">No blocked dates.</p>
          ) : (
            <ul className="space-y-2">
              {blockedDates.map((d) => (
                <li key={format(d, "yyyy-MM-dd")}>
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
