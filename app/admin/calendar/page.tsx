"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

// CSS: you'll want to include the .rdp-blocked style in your globals.css (see note below)

type NullableDate = Date | undefined;

export default function AdminCalendarPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // ISO 'yyyy-MM-dd'
  const [error, setError] = useState<string>("");

  const iso = (d: Date) => format(d, "yyyy-MM-dd");

  // load blocked dates from server
  const loadBlocked = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blocked", {
        headers: {
          "x-admin-password": adminPassword ?? "",
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || res.statusText);
      }
      const json = await res.json();
      const arr = json.blocked || [];
      setBlockedDates(arr.map((r: any) => new Date(r.date)));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load blocked dates.");
      setBlockedDates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadBlocked();
  }, [authed]);

  // Toggle selection (multi-select)
  const toggleSelect = (d: Date) => {
    const id = iso(d);
    setSelectedDates((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk block selected dates
  const blockSelected = async () => {
    if (!adminPassword) return setError("Missing admin password");
    if (selectedDates.length === 0) return setError("No dates selected");
    setError("");
    try {
      const res = await fetch("/api/admin/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ dates: selectedDates }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || res.statusText);
      setSelectedDates([]);
      await loadBlocked();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to block dates.");
    }
  };

  // Bulk unblock selected dates
  const unblockSelected = async () => {
    if (!adminPassword) return setError("Missing admin password");
    if (selectedDates.length === 0) return setError("No dates selected");
    setError("");
    try {
      const res = await fetch("/api/admin/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ dates: selectedDates }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || res.statusText);
      setSelectedDates([]);
      await loadBlocked();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to unblock dates.");
    }
  };

  // handle login form -- store password in state (so we can pass header)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // compare with public env variable on client only for UX; server will re-check
    // the server route will still validate.
    if (!passwordInput) {
      setError("Enter password");
      return;
    }
    setAdminPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
    setError("");
    loadBlocked();
  };

  // DayPicker modifiers
  const blockedIsoSet = new Set(blockedDates.map(iso));

  return !authed ? (
    <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5] p-6">
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
  ) : (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h1 className="text-2xl font-bold">Manage Calendar</h1>
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
            </div>
          </div>

          <DayPicker
            mode="multiple"
            numberOfMonths={1}
            onDayClick={(day) => toggleSelect(day)}
            // mark blocked via modifiers
            modifiers={{ blocked: blockedDates }}
            modifiersClassNames={{ blocked: "rdp-blocked" }}
            selected={selectedDates.map((s) => new Date(s))}
          />

          <div className="mt-6 flex gap-3">
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

          {error && <p className="text-red-600 mt-3">{error}</p>}
          <p className="mt-3 text-sm text-gray-600">
            Selected: {selectedDates.length} — Blocked are highlighted in red.
          </p>
        </section>

        <aside className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Blocked Dates</h2>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {blockedDates.length === 0 && (
              <p className="text-gray-500">No blocked dates.</p>
            )}

            {blockedDates.map((d) => {
              const id = iso(d);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-[#fff6f0] p-2 rounded"
                >
                  <div>{format(d, "dd MMM yyyy")}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Tip: blocked dates prevent guests from selecting those days on the
              public booking page.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
