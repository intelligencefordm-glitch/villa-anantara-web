"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
  isBefore,
  startOfDay
} from "date-fns";

type Inquiry = {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  guests?: number;
  occassion?: string;
  check_in?: string;
  check_out?: string;
  nights?: number;
};

export default function CheckAvailabilityPage() {
  const MOCHA = "#C29F80";
  const DARK = "#0F1F0F";

  // FORM + UI STATE
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState<number | string>(2);
  const [occasion, setOccasion] = useState("Stay");

  const [bookings, setBookings] = useState<Inquiry[]>([]);
  const [blockedAdmin, setBlockedAdmin] = useState<string[]>([]);
  const [disabledDatesSet, setDisabledDatesSet] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  const today = startOfDay(new Date());

  // ----------------------------------------
  // LOAD INQUIRIES + ADMIN BLOCKED DATES
  // ----------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // FETCH BOOKINGS
        const res = await fetch("/api/inquiries/list");
        const json = await res.json();
        const arr: Inquiry[] = json.inquiries || [];
        setBookings(arr);

        // FETCH ADMIN BLOCKED
        const res2 = await fetch("/api/blocked");
        const json2 = await res2.json();
        const blockedArr: string[] = json2.blocked || [];
        setBlockedAdmin(blockedArr);

        const set = new Set<string>();

        // Add inquiry dates
        arr.forEach((inq) => {
          if (inq.check_in && inq.check_out) {
            const start = parseISO(inq.check_in);
            const end = parseISO(inq.check_out);
            const days = eachDayOfInterval({ start, end: addDays(end, -1) });
            days.forEach((d) => set.add(format(d, "yyyy-MM-dd")));
          }
        });

        // Add admin-blocked dates
        blockedArr.forEach((d) => set.add(d));

        setDisabledDatesSet(set);
      } catch (err) {
        console.error("Error loading availability:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ----------------------------------------
  // CHECK IF RANGE INTERSECTS BLOCKED
  // ----------------------------------------
  const selectionIntersectsDisabled = (sel: DateRange | undefined) => {
    if (!sel || !sel.from || !sel.to) return false;
    const days = eachDayOfInterval({ start: sel.from, end: addDays(sel.to, -1) });

    for (const d of days) {
      const key = format(d, "yyyy-MM-dd");
      if (disabledDatesSet.has(key)) return true;
    }
    return false;
  };

  // Prevent same-day check-in/out
  const normalizeRange = (sel: DateRange | undefined): DateRange | undefined => {
    if (!sel || !sel.from) return sel;
    if (!sel.to) return sel;
    const diff = differenceInDays(sel.to, sel.from);
    if (diff < 1) return { from: sel.from, to: addDays(sel.from, 1) };
    return sel;
  };

  // ----------------------------------------
  // HANDLE DATE SELECTION
  // ----------------------------------------
  const handleSelect = (val: DateRange | undefined) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const normalized = normalizeRange(val);

    // Check disabled intersection
    if (selectionIntersectsDisabled(normalized)) {
      setErrorMsg("Sorry — the selected dates are not available.");
      return;
    }

    setRange(normalized);

    if (normalized?.from && normalized?.to) {
      setTimeout(
        () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
        200
      );
    }
  };

  // ----------------------------------------
  // DISABLE DATES IN CALENDAR
  // ----------------------------------------
  const disabledPicker = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    if (date < today) return true;
    if (disabledDatesSet.has(key)) return true;
    return false;
  };

  // ----------------------------------------
  // SUBMIT FORM
  // ----------------------------------------
  const handleSubmit = async () => {
    if (!range?.from || !range?.to) {
      setErrorMsg("Select both check-in and check-out dates.");
      return;
    }
    if (!name.trim()) return setErrorMsg("Enter your name.");
    if (!phone.trim()) return setErrorMsg("Enter your phone.");

    if (selectionIntersectsDisabled(range)) {
      setErrorMsg("Sorry — these dates are no longer available.");
      return;
    }

    const payload = {
      name,
      phone,
      email,
      guests: Number(guests),
      occasion,
      check_in: format(range.from, "yyyy-MM-dd"),
      check_out: format(range.to, "yyyy-MM-dd"),
      nights: differenceInDays(range.to, range.from),
    };

    try {
      setSaving(true);
      const res = await fetch("/api/inquiries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      const waMsg =
        `Hello 👋%0A%0AI'd like to book *Villa Anantara*.%0A%0A` +
        `*Name:* ${payload.name}%0A*Phone:* ${payload.phone}%0A*Email:* ${payload.email || "N/A"}%0A` +
        `*Guests:* ${payload.guests}%0A*Occasion:* ${payload.occasion}%0A%0A` +
        `*Check-in:* ${format(range.from, "dd MMM yyyy")}%0A` +
        `*Check-out:* ${format(range.to, "dd MMM yyyy")}%0A*Nights:* ${payload.nights}%0A`;

      window.open(`https://wa.me/918889777288?text=${waMsg}`, "_blank");

      setSuccessMsg("Inquiry saved! Opening WhatsApp…");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save inquiry.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // RESET
  // ----------------------------------------
  const resetSelection = () => {
    setRange(undefined);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const nights =
    range?.from && range?.to
      ? differenceInDays(range.to, range.from)
      : 0;

  // ----------------------------------------
  // UI RENDER
  // ----------------------------------------
  return (
    <main className="min-h-screen p-6 pb-24" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-3 text-[#0F1F0F]">
          Check Availability
        </h1>

        <p className="text-sm text-[#4a4a4a] mb-6">
          Booked dates (including admin-blocked dates) are shown in red.
        </p>

        {/* CALENDAR */}
        <div className="bg-white p-4 rounded shadow-sm mb-6">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading…</p>
          ) : (
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              numberOfMonths={1}
              disabled={disabledPicker}
              modifiers={{
                booked: Array.from(disabledDatesSet).map((d) =>
                  parseISO(d)
                ),
              }}
              modifiersStyles={{
                booked: { backgroundColor: "crimson", color: "white" },
                range_start: { backgroundColor: MOCHA, color: "white" },
                range_end: { backgroundColor: MOCHA, color: "white" },
                selected: { backgroundColor: MOCHA, color: "white" },
              }}
            />
          )}

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2">
              <span style={{ width: 14, height: 14, background: MOCHA }} />
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ width: 14, height: 14, background: "crimson" }} />
              <span className="text-sm">Unavailable</span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {errorMsg && (
          <div className="p-3 rounded bg-red-500 text-white mb-4">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="p-3 rounded bg-green-600 text-white mb-4">{successMsg}</div>
        )}

        {/* FORM */}
        {range?.from && range?.to && !selectionIntersectsDisabled(range) && (
          <section
            ref={formRef}
            className="rounded p-6"
            style={{ backgroundColor: MOCHA }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Guest Details
            </h2>

            {/* Full name */}
            <label className="block text-white text-sm mb-1">Full name</label>
            <input
              className="w-full p-3 rounded mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />

            {/* Phone */}
            <label className="block text-white text-sm mb-1">Phone</label>
            <input
              className="w-full p-3 rounded mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />

            {/* Email */}
            <label className="block text-white text-sm mb-1">Email (optional)</label>
            <input
              className="w-full p-3 rounded mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Guests */}
            <label className="block text-white text-sm mb-1">Guests</label>
            <input
              className="w-full p-3 rounded mb-3"
              value={guests}
              type="number"
              min={1}
              onChange={(e) =>
                setGuests(e.target.value === "" ? "" : Number(e.target.value))
              }
            />

            {/* Occasion */}
            <label className="block text-white text-sm mb-1">Occasion</label>
            <select
              className="w-full p-3 rounded mb-4"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option>Stay</option>
              <option>Other</option>
            </select>

            <div className="text-white text-sm mb-4">
              <strong>Check-in:</strong> {format(range.from, "dd MMM yyyy")}  
              <br />
              <strong>Check-out:</strong> {format(range.to, "dd MMM yyyy")}  
              <br />
              <strong>Nights:</strong> {nights}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 bg-[#0F1F0F] text-white rounded font-semibold"
              >
                {saving ? "Saving…" : "Confirm & Send on WhatsApp"}
              </button>

              <button
                onClick={resetSelection}
                className="px-4 py-3 bg-white text-[#0F1F0F] rounded font-semibold"
              >
                Reset
              </button>
            </div>
          </section>
        )}

        {range?.from && range?.to && selectionIntersectsDisabled(range) && (
          <div className="p-4 rounded bg-red-100 text-red-800 mt-6">
            <strong>Sorry — the selected dates are not available.</strong>
            <p className="text-sm mt-1">
              Please choose different dates.
            </p>
          </div>
        )}
      </div>

      {/* GO BACK */}
      <a
        href="/"
        className="fixed bottom-6 left-6 bg-white text-[#0F1F0F] px-4 py-2 rounded-full shadow flex gap-2 items-center"
      >
        ← <span className="font-semibold">Go Back</span>
      </a>
    </main>
  );
}
