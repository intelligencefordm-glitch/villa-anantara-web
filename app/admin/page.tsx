"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  // === FETCH BLOCKED DATES ON LOGIN ===
  const fetchBlocked = async () => {
    setLoading(true);
    const res = await fetch("/api/blocks/list");
    const json = await res.json();

    if (Array.isArray(json)) {
      setBlockedDates(json.map((d: any) => new Date(d.date)));
    }

    setLoading(false);
  };

  // === LOGIN HANDLER ===
  const handleLogin = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    const json = await res.json();

    if (json.success) {
      setAuthed(true);
      fetchBlocked();
    } else {
      alert("Incorrect password");
    }
  };

  // === CLICK DATE TO TOGGLE BLOCK ===
  const toggleDate = async (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");

    const isBlocked = blockedDates.some(
      (d) => format(d, "yyyy-MM-dd") === dateString
    );

    if (isBlocked) {
      // Remove from DB
      await fetch("/api/blocks/remove", {
        method: "POST",
        body: JSON.stringify({ date: dateString }),
      });
    } else {
      // Add to DB
      await fetch("/api/blocks/add", {
        method: "POST",
        body: JSON.stringify({ date: dateString, reason: "Admin block" }),
      });
    }

    // Refresh calendar
    fetchBlocked();
  };

  if (!authed) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: "#EFE5D5" }}
      >
        <div
          className="p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#C29F80" }}
        >
          <h1 className="text-white text-xl font-bold mb-4 text-center">
            Admin Login
          </h1>

          <input
            type="password"
            placeholder="Enter password"
            className="px-4 py-2 rounded w-64 text-black"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="mt-4 px-4 py-2 rounded text-white font-bold w-full"
            style={{ backgroundColor: "#0F1F0F" }}
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // === ADMIN CALENDAR VIEW ===
  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{ backgroundColor: "#EFE5D5" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">Admin Panel</h1>

      <p className="mb-4 text-[#0F1F0F]">
        Click dates to block or unblock them.
      </p>

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <DayPicker
          mode="multiple"
          selected={blockedDates}
          onDayClick={toggleDate}
          modifiers={{
            blocked: blockedDates,
          }}
          modifiersStyles={{
            blocked: {
              backgroundColor: "#C29F80",
              color: "white",
            },
          }}
        />
      )}

      <h2 className="text-xl font-bold mt-10 mb-4 text-[#0F1F0F]">
        Blocked Dates
      </h2>

      <ul className="space-y-2">
        {blockedDates.map((d, index) => (
          <li key={index} className="text-[#0F1F0F]">
            • {format(d, "dd MMM yyyy")}
          </li>
        ))}
      </ul>
    </main>
  );
}
