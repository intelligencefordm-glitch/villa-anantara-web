"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const ADMIN_HEADER = {
  "x-admin-password": process.env.NEXT_PUBLIC_ADMIN_PASSWORD!,
};

export default function AdminCalendarPage() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------
  // 🔵 Load all blocked dates
  // -------------------------------
  const loadBlocked = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blocked", {
        headers: ADMIN_HEADER,
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setBlockedDates(json.blocked.map((d: any) => new Date(d.date)));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load blocked dates.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadBlocked();
  }, []);

  // ----------------------------------
  // 🔵 Toggle selecting dates in UI
  // ----------------------------------
  const handleDayClick = (day: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some(
        (d) => d.toDateString() === day.toDateString()
      );
      if (exists) return prev.filter((d) => d.toDateString() !== day.toDateString());
      return [...prev, day];
    });
  };

  // ----------------------------------
  // 🔴 BLOCK selected dates
  // ----------------------------------
  const blockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          ...ADMIN_HEADER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
        }),
      });

      await loadBlocked();
      setSelectedDates([]);
    } catch (err) {
      console.error(err);
      setError("Failed to block dates.");
    }
  };

  // ----------------------------------
  // 🟢 UNBLOCK selected dates
  // ----------------------------------
  const unblockSelected = async () => {
    if (selectedDates.length === 0) return;

    try {
      await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          ...ADMIN_HEADER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dates: selectedDates.map((d) => format(d, "yyyy-MM-dd")),
        }),
      });

      await loadBlocked();
      setSelectedDates([]);
    } catch (err) {
      console.error(err);
      setError("Failed to unblock dates.");
    }
  };

  // ----------------------------------
  // UI DISPLAY for Blocked days
  // ----------------------------------
  const isBlocked = (day: Date) =>
    blockedDates.some((d) => d.toDateString() === day.toDateString());

  return (
    <main className="min-h-screen p-6 bg-[#EFE5D5]">
      <header
        className="mb-6 p-4 rounded text-white"
        style={{ backgroundColor: "#C29F80" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT — CALENDAR */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Calendar</h2>

            <button
              onClick={loadBlocked}
              className="px-3 py-1 border rounded bg-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <DayPicker
              mode="multiple"
              selected={selectedDates}
              onDayClick={handleDayClick}
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

          {error && <p className="text-red-600 mt-3">{error}</p>}

          {/* ACTION BUTTONS */}
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
        </section>

        {/* RIGHT — LIST OF BLOCKED DAYS */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 ? (
            <p>No blocked dates.</p>
          ) : (
            <ul className="space-y-2">
              {blockedDates.map((d) => (
                <li key={d.toISOString()} className="bg-red-100 p-2 rounded">
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
