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
  const [error, setError] = useState("");

  // Fetch blocked dates from API
  const loadBlocked = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blocked");
      const json = await res.json();
      // API returns { blocked: [...] }
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

  // Handler: block a date
  const addBlock = async (date: Date) => {
    setError("");
    const dateString = format(date, "yyyy-MM-dd");
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateString }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        // optimistic refresh
        await loadBlocked();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to block date.");
    }
  };

  // Handler: unblock a date
  const removeBlock = async (date: Date) => {
    setError("");
    const dateString = format(date, "yyyy-MM-dd");
    try {
      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateString }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        await loadBlocked();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to unblock date.");
    }
  };

  // Clicking a day toggles block/unblock
  const handleDayClick = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");
    const exists = blockedDates.some(
      (d) => format(d, "yyyy-MM-dd") === iso
    );
    if (exists) removeBlock(day);
    else addBlock(day);
  };

  // Simple login (client-side check) — matches other admin pages
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
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
      <header className="mb-6 p-4 rounded" style={{ backgroundColor: "#C29F80", color: "white" }}>
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
        <p className="opacity-90">Click a date to block or unblock it.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onClick={() => { setAuthed(false); setBlockedDates([]); }}
                className="px-3 py-1 rounded border bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <DayPicker
              mode="single"
              numberOfMonths={1}
              selected={[]}
              onDayClick={handleDayClick}
              modifiers={{ blocked: blockedDates }}
              modifiersStyles={{
                blocked: {
                  backgroundColor: "#C29F80",
                  color: "white",
                },
              }}
            />
          )}

          {error && <p className="text-red-600 mt-3">{error}</p>}
          <p className="mt-3 text-sm text-gray-600">
            Click a date to toggle block. Blocked dates are shown in mocha.
          </p>
        </section>

        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {blockedDates.length === 0 && <p className="text-gray-500">No blocked dates.</p>}

            {blockedDates.map((d) => {
              const iso = format(d, "yyyy-MM-dd");
              return (
                <div key={iso} className="flex items-center justify-between bg-[#fff6f0] p-2 rounded">
                  <div>{format(d, "dd MMM yyyy")}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeBlock(d)}
                      className="px-2 py-1 text-sm rounded border bg-white"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">Tip: blocked dates prevent guests from selecting those days on the public booking page.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
