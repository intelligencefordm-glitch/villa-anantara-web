"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminCalendarPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState("");

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  // Fetch blocked dates
  const loadBlocked = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blocked", {
        headers: { "x-admin-password": ADMIN_PASS },
      });
      const json = await res.json();
      const arr = json.blocked || [];
      setBlockedDates(arr.map((d: any) => new Date(d.date)));
    } catch {
      setError("Failed to load blocked dates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // Toggle selection (multi-select)
  const handleSelect = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");

    // Already selected → unselect
    if (selectedDates.some((d) => format(d, "yyyy-MM-dd") === iso)) {
      setSelectedDates(selectedDates.filter((d) => format(d, "yyyy-MM-dd") !== iso));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  // BLOCK selected dates
  const blockSelected = async () => {
    if (selectedDates.length === 0) return alert("Select at least one date.");

    for (const d of selectedDates) {
      const iso = format(d, "yyyy-MM-dd");

      await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify({ date: iso }),
      });
    }

    setSelectedDates([]);
    loadBlocked();
  };

  // UNBLOCK selected dates
  const unblockSelected = async () => {
    if (selectedDates.length === 0) return alert("Select at least one date.");

    for (const d of selectedDates) {
      const iso = format(d, "yyyy-MM-dd");

      await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASS,
        },
        body: JSON.stringify({ date: iso }),
      });
    }

    setSelectedDates([]);
    loadBlocked();
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setAuthed(true);
      setPasswordInput("");
      setError("");
    } else {
      setError("Incorrect password");
    }
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
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-2 rounded"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold">
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">

      {/* HEADER */}
      <header className="mb-6 p-4 rounded" style={{ backgroundColor: "#C29F80", color: "white" }}>
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT — CALENDAR */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={loadBlocked}
                className="px-3 py-1 rounded border bg-white text-[#0F1F0F]"
              >
                Refresh
              </button>

              <button
                onClick={() => {
                  setAuthed(false);
                  setSelectedDates([]);
                }}
                className="px-3 py-1 rounded border bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DayPicker
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                modifiers={{ blocked: blockedDates }}
                modifiersStyles={{
                  blocked: { backgroundColor: "#C29F80", color: "white" },
                  selected: { backgroundColor: "#0F1F0F", color: "white" },
                }}
                numberOfMonths={1}
              />

              {error && <p className="text-red-600 mt-3">{error}</p>}
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={blockSelected}
              className="px-4 py-2 font-semibold bg-[#C29F80] text-white rounded"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              className="px-4 py-2 font-semibold bg-black text-white rounded"
            >
              Unblock Selected
            </button>
          </div>
        </section>

        {/* RIGHT — LIST */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p className="text-gray-500">No blocked dates.</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {blockedDates.map((d) => {
                const iso = format(d, "yyyy-MM-dd");
                return (
                  <div key={iso} className="flex items-center justify-between bg-[#fff6f0] p-2 rounded">
                    <span>{format(d, "dd MMM yyyy")}</span>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
