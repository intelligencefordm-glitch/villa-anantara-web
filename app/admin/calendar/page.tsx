// app/admin/calendar/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminCalendarPage() {
  // auth
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState(""); // saved after successful login
  const [authed, setAuthed] = useState(false);

  // data + UI state
  const [blockedDates, setBlockedDates] = useState<string[]>([]); // ISO strings "YYYY-MM-DD"
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mocha = "#C29F80";
  const red = "#B00020";

  // -------------------------------
  // HELPER — Load blocked dates (API returns: string[])
  // -------------------------------
  async function loadBlockedDates(usePassword = password) {
    setLoading(true);
    setError("");

    try {
      if (!usePassword) {
        setBlockedDates([]);
        return;
      }

      const res = await fetch("/api/admin/blocked", {
        method: "GET",
        headers: {
          "x-admin-password": usePassword,
        },
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || `Failed (${res.status})`);

      // NEW FORMAT: blocked = ["2025-12-10", "2025-12-11"]
      const isoDates = (json.blocked || []).map((d: string) => d);
      setBlockedDates(isoDates);
    } catch (err: any) {
      console.error("loadBlockedDates error:", err);
      if (err?.message === "Unauthorized") {
        setError("Incorrect admin password.");
        setAuthed(false);
        setPassword("");
      } else {
        setError("Failed to load blocked dates.");
      }
      setBlockedDates([]);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // LOGIN
  // -------------------------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!passwordInput) {
      setError("Enter password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/blocked", {
        method: "GET",
        headers: {
          "x-admin-password": passwordInput,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Login failed`);

      // login successful now
      setPassword(passwordInput);
      setAuthed(true);
      setPasswordInput("");

      // NEW FORMAT: strings only
      const isoDates = (json.blocked || []).map((d: string) => d);
      setBlockedDates(isoDates);
    } catch (err: any) {
      console.error("login error:", err);
      if (err?.message === "Unauthorized") setError("Incorrect password");
      else setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // EFFECT — Keep refreshed when authed
  // -------------------------------
  useEffect(() => {
    if (authed) loadBlockedDates(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  // -------------------------------
  // DAY CLICK
  // -------------------------------
  const handleDayClick = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");
    setSelectedDates((prev) => {
      if (prev.includes(iso)) return prev.filter((d) => d !== iso);
      return [...prev, iso];
    });
  };

  // -------------------------------
  // BLOCK SELECTED
  // -------------------------------
  async function blockSelected() {
    if (!authed || selectedDates.length === 0) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ dates: selectedDates }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to block");
      }

      await loadBlockedDates(password);
      setSelectedDates([]);
    } catch (err) {
      console.error("blockSelected error:", err);
      setError("Failed to block selected dates.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // UNBLOCK SELECTED
  // -------------------------------
  async function unblockSelected() {
    if (!authed || selectedDates.length === 0) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ dates: selectedDates }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to unblock");
      }

      await loadBlockedDates(password);
      setSelectedDates([]);
    } catch (err) {
      console.error("unblockSelected error:", err);
      setError("Failed to unblock selected dates.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // LOGIN VIEW
  // -------------------------------
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5]">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">
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

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold"
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -------------------------------
  // LOGGED-IN VIEW
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
        {/* LEFT — CALENDAR */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <div className="flex gap-3">
              <button
                onClick={() => loadBlockedDates(password)}
                className="px-3 py-1 rounded border"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>

              <button
                onClick={() => {
                  setAuthed(false);
                  setPassword("");
                  setBlockedDates([]);
                  setSelectedDates([]);
                }}
                className="px-3 py-1 rounded border"
              >
                Logout
              </button>
            </div>
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
              disabled={loading || selectedDates.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              disabled={loading || selectedDates.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Unblock Selected
            </button>
          </div>
        </section>

        {/* RIGHT — BLOCKED DATES LIST */}
        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          {blockedDates.length === 0 && (
            <p className="text-gray-500">No blocked dates.</p>
          )}

          <ul className="space-y-1 max-h-[50vh] overflow-y-auto">
            {blockedDates.map((date) => (
              <li
                key={date}
                className="p-2 rounded bg-[#fff6f0] border flex justify-between"
              >
                <span>{format(new Date(date), "dd MMM yyyy")}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
