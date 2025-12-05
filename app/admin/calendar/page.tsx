"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function AdminCalendarPage() {
  // AUTH
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  // DATA
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mocha = "#C29F80";
  const red = "#B00020";

  // ------------------------------------
  // LOAD BLOCKED DATES
  // ------------------------------------
  async function loadBlockedDates(usePassword = password) {
    setError("");

    if (!usePassword) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/blocked", {
        method: "GET",
        headers: {
          "x-admin-password": usePassword,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      setBlockedDates(json.blocked || []);
    } catch (err: any) {
      console.error("loadBlockedDates error:", err);
      setError(err.message || "Failed to load dates");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // HANDLE LOGIN
  // ------------------------------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!passwordInput) return setError("Enter password");

    setLoading(true);

    try {
      const res = await fetch("/api/admin/blocked", {
        method: "GET",
        headers: { "x-admin-password": passwordInput },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");

      setPassword(passwordInput);
      setAuthed(true);
      setPasswordInput("");

      setBlockedDates(json.blocked || []);
    } catch (err: any) {
      setError("Incorrect password");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) loadBlockedDates(password);
  }, [authed]);

  // ------------------------------------
  // SELECT DATE
  // ------------------------------------
  const handleDayClick = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");
    setSelectedDates((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]
    );
  };

  // ------------------------------------
  // BLOCK SELECTED
  // ------------------------------------
  async function blockSelected() {
    if (selectedDates.length === 0) return;

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

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Block failed");

      await loadBlockedDates(password);
      setSelectedDates([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to block dates");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // UNBLOCK SELECTED
  // ------------------------------------
  async function unblockSelected() {
    if (selectedDates.length === 0) return;

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

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unblock failed");

      await loadBlockedDates(password);
      setSelectedDates([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to unblock dates");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------
  // LOGIN SCREEN
  // ------------------------------------
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

  // ------------------------------------
  // LOGGED IN VIEW
  // ------------------------------------
  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded"
        style={{ backgroundColor: mocha, color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar</h2>

            <div className="flex gap-3">
              <button
                onClick={() => loadBlockedDates(password)}
                className="px-3 py-1 rounded border"
                disabled={loading}
              >
                {loading ? "..." : "Refresh"}
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

          {/* CALENDAR */}
          <DayPicker
            mode="single"
            onDayClick={handleDayClick}
            selected={selectedDates.map((d) => new Date(d))}
            modifiers={{}}
            styles={{
              day: (day) => {
                const iso = format(day, "yyyy-MM-dd");

                if (blockedDates.includes(iso)) {
                  return {
                    backgroundColor: red,
                    color: "white",
                    borderRadius: "50%",
                  };
                }

                if (selectedDates.includes(iso)) {
                  return {
                    backgroundColor: "#0F1F0F",
                    color: "white",
                    borderRadius: "50%",
                  };
                }

                return {};
              },
            }}
          />

          {error && <p className="text-red-600 mt-3">{error}</p>}

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={blockSelected}
              disabled={selectedDates.length === 0 || loading}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Block Selected
            </button>

            <button
              onClick={unblockSelected}
              disabled={selectedDates.length === 0 || loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Unblock Selected
            </button>
          </div>
        </section>

        {/* RIGHT — BLOCKED LIST */}
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
