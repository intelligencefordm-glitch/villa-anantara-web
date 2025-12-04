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
} from "date-fns";

type Inquiry = {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  guests?: number;
  occassion?: string;
  check_in?: string; // "yyyy-mm-dd"
  check_out?: string;
  nights?: number;
  payment_status?: string;
};

export default function CheckAvailabilityPage() {
  const MOCHA = "#C29F80";
  const DARK = "#0F1F0F";

  // DateRange state (DayPicker v8)
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  // form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState<number | string>(2);
  const [occasion, setOccasion] = useState("Stay");

  // bookings + disabled days
  const [bookings, setBookings] = useState<Inquiry[]>([]);
  const [disabledDatesSet, setDisabledDatesSet] = useState<Set<string>>(new Set());
  const [loadingBookings, setLoadingBookings] = useState(false);

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // form scroll
  const formRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lock previous months by setting fromDate to today (prevents navigating earlier months)
  const fromDate = today;

  // Fetch bookings on mount
  useEffect(() => {
    const load = async () => {
      setLoadingBookings(true);
      try {
        const res = await fetch("/api/inquiries/list");
        const json = await res.json();
        const arr: Inquiry[] = json.inquiries || [];
        setBookings(arr);

        // Build set of disabled dates (all dates in each booked interval)
        const set = new Set<string>();
        arr.forEach((inq) => {
          try {
            if (inq.check_in && inq.check_out) {
              const start = parseISO(inq.check_in);
              const end = parseISO(inq.check_out);
              // treat booking as nights [check_in .. check_out-1] — ensure check_out day itself is not bookable as arrival
              const days = eachDayOfInterval({ start, end: addDays(end, -1) });
              days.forEach((d) => set.add(format(d, "yyyy-MM-dd")));
            }
          } catch (e) {
            // ignore parse errors
            console.warn("Error parsing booking dates", e);
          }
        });
        setDisabledDatesSet(set);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    load();
  }, []);

  // derived: convenience boolean whether selection intersects disabled set
  const selectionIntersectsDisabled = (sel: DateRange | undefined) => {
    if (!sel || !sel.from || !sel.to) return false;
    const days = eachDayOfInterval({ start: sel.from, end: addDays(sel.to, -1) }); // nights interval
    for (const d of days) {
      const key = format(d, "yyyy-MM-dd");
      if (disabledDatesSet.has(key)) return true;
    }
    return false;
  };

  // normalize selected range: prevent same-day checkin/out; ensure from < to
  const normalizeSelectedRange = (sel: DateRange | undefined): DateRange | undefined => {
    if (!sel) return undefined;
    if (!sel.from) return sel;
    if (!sel.to) {
      // user selected only checkin; keep
      return sel;
    }
    // if to <= from, force to = from + 1
    const diff = differenceInDays(sel.to, sel.from);
    if (diff < 1) {
      const correctedTo = addDays(sel.from, 1);
      return { from: sel.from, to: correctedTo };
    }
    return sel;
  };

  // DayPicker onSelect handler — unselectable dates enforced by disabled prop, but also check full-range overlap.
  const handleSelect = (val: DateRange | undefined) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const normalized = normalizeSelectedRange(val);

    // If normalized has both from & to, ensure it does NOT intersect disabled dates
    if (selectionIntersectsDisabled(normalized)) {
      // A) per your choice, make booked dates unselectable — here we still double-check and show message
      setErrorMsg("Sorry — the selected dates are not available.");
      // do NOT set the range (so user's previous selection remains or clear)
      return;
    }

    // otherwise set range
    setRange(normalized);

    // auto open form when both dates chosen
    if (normalized && normalized.from && normalized.to) {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    }
  };

  // Build DayPicker disabled prop: combine before: today and specific dates from disabledDatesSet
  // DayPicker accepts function (date) => boolean
  const disabledPicker = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    // disable past
    if (date < today) return true;
    // disable dates in booked set
    if (disabledDatesSet.has(key)) return true;
    return false;
  };

  // Convert disabledDatesSet to a small sample for modifiers (so we can style booked dates red)
  const bookedModifiers = useMemo(() => {
    // produce array of Date objects (a sample; DayPicker accepts modifiers as Date[])
    const arr: Date[] = [];
    disabledDatesSet.forEach((s) => {
      try {
        arr.push(parseISO(s));
      } catch (e) {}
    });
    return { booked: arr };
  }, [disabledDatesSet]);

  // Submit handler: save inquiry to server FIRST, then open WhatsApp
  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!range || !range.from || !range.to) {
      setErrorMsg("Please select check-in and check-out dates.");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    // final overlap check before saving (race condition protection)
    if (selectionIntersectsDisabled(range)) {
      setErrorMsg("Sorry — the selected dates are no longer available.");
      return;
    }

    const payload = {
      name,
      phone,
      email,
      guests: typeof guests === "string" ? Number(guests) : guests,
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
      if (!res.ok) {
        throw new Error(json?.error || "Save failed");
      }

      // update local bookings/disables quickly to avoid duplicate selections
      // add all days to disabled set
      const start = parseISO(payload.check_in);
      const end = parseISO(payload.check_out);
      const days = eachDayOfInterval({ start, end: addDays(end, -1) });
      const nextSet = new Set(disabledDatesSet);
      days.forEach((d) => nextSet.add(format(d, "yyyy-MM-dd")));
      setDisabledDatesSet(nextSet);

      setSuccessMsg("Inquiry saved. Opening WhatsApp...");
      // whatsapp message (nicely formatted)
      const waMessage = `Hello 👋%0A%0AI'd like to inquire about booking *Villa Anantara*.%0A%0A` +
        `*Name:* ${payload.name}%0A*Phone:* ${payload.phone}%0A*Email:* ${payload.email || "N/A"}%0A` +
        `*Guests:* ${payload.guests}%0A*Occasion:* ${payload.occasion}%0A%0A` +
        `*Check-in:* ${format(range.from, "dd MMM yyyy")}%0A*Check-out:* ${format(range.to, "dd MMM yyyy")}%0A*Nights:* ${payload.nights}%0A%0A` +
        `Please confirm availability and payment instructions.`;

      // small delay to show success message then open WA
      setTimeout(() => {
        window.open(`https://wa.me/918889777288?text=${waMessage}`, "_blank");
      }, 650);
    } catch (err: any) {
      console.error("Save error", err);
      setErrorMsg(err?.message || "Failed to save inquiry");
    } finally {
      setSaving(false);
    }
  };

  // small helpers for UI
  const nights =
    range && range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  return (
    <main className="min-h-screen p-6 pb-24" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-[#0F1F0F]">Check Availability</h1>
        <p className="text-sm text-[#4a4a4a] mb-6">Select dates to check availability. Booked days are shown in red and cannot be selected.</p>

        {/* Calendar panel */}
        <div className="rounded-lg shadow-sm bg-white p-4 mb-6" style={{ transition: "box-shadow .2s ease" }}>
          {loadingBookings ? (
            <div className="py-10 text-center text-gray-500">Loading availability…</div>
          ) : (
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              numberOfMonths={1}
              fromDate={fromDate} // prevents navigating to earlier months
              disabled={disabledPicker}
              modifiers={{ booked: bookedModifiers.booked }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "crimson",
                  color: "white",
                },
                selected: {
                  backgroundColor: MOCHA,
                  color: "white",
                },
                range_start: {
                  backgroundColor: MOCHA,
                  color: "white",
                },
                range_end: {
                  backgroundColor: MOCHA,
                  color: "white",
                },
              }}
              // visual easing
              styles={{
                caption: { color: DARK, fontWeight: 600, transition: "all .18s ease" },
                day: { borderRadius: 8, transition: "transform .12s ease" },
              }}
              // a small animation on hover via CSS class fallback (DayPicker doesn't support hover styles directly)
            />
          )}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span style={{ width: 14, height: 14, backgroundColor: MOCHA, display: "inline-block", borderRadius: 4 }} />
              <span className="text-sm text-[#333]">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ width: 14, height: 14, backgroundColor: "crimson", display: "inline-block", borderRadius: 4 }} />
              <span className="text-sm text-[#333]">Booked / Unavailable</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded text-white" style={{ backgroundColor: "#cc4b4b" }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded text-white" style={{ backgroundColor: "#2f9d6f" }}>
            {successMsg}
          </div>
        )}

        {/* Guest details (shows only when both dates selected and valid) */}
        {range && range.from && range.to && !selectionIntersectsDisabled(range) && (
          <section ref={formRef} className="rounded-lg p-6" style={{ backgroundColor: MOCHA, transition: "transform .18s ease" }}>
            <h2 className="text-xl font-semibold text-white mb-4">Guest Details</h2>

            {/* Full name */}
            <label className="block text-white text-sm font-medium mb-1">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded mb-3"
              placeholder="e.g. Rahul Sharma"
            />

            {/* Phone */}
            <label className="block text-white text-sm font-medium mb-1">Phone (WhatsApp)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded mb-3"
              placeholder="+91 98765 43210"
            />

            {/* Email */}
            <label className="block text-white text-sm font-medium mb-1">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded mb-3"
              placeholder="you@example.com"
            />

            {/* Guests */}
            <label className="block text-white text-sm font-medium mb-1">Guests</label>
            <input
              value={guests}
              onChange={(e) => setGuests(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-3 rounded mb-3"
              type="number"
              min={1}
              placeholder="Number of guests"
            />

            {/* Occasion */}
            <label className="block text-white text-sm font-medium mb-1">Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full p-3 rounded mb-4">
              <option value="Stay">Stay</option>
              <option value="Other">Other</option>
            </select>

            {/* Summary */}
            <div className="text-white text-sm mb-4">
              <div><strong>Check-in:</strong> {format(range.from, "dd MMM yyyy")}</div>
              <div><strong>Check-out:</strong> {format(range.to, "dd MMM yyyy")}</div>
              <div><strong>Nights:</strong> {nights}</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 rounded text-white font-semibold"
                style={{ backgroundColor: DARK, transition: "transform .08s ease" }}
              >
                {saving ? "Saving..." : "Confirm & Send on WhatsApp"}
              </button>

              <button
                onClick={() => { resetSelection(); }}
                className="px-4 py-3 rounded bg-white text-[#0F1F0F] font-semibold"
              >
                Reset
              </button>
            </div>
          </section>
        )}

        {/* If user selected an unavailable range, show instruction */}
        {range && range.from && range.to && selectionIntersectsDisabled(range) && (
          <div className="mt-6 p-4 rounded" style={{ backgroundColor: "#fee6e6", color: "#7a1c1c" }}>
            <strong>Sorry — those dates are not available.</strong>
            <div className="text-sm mt-2">Please choose different dates or contact us on WhatsApp for assistance.</div>
          </div>
        )}
      </div>

      {/* GO BACK */}
      <a
        href="/"
        className="fixed bottom-6 left-6 flex items-center gap-2 bg-white text-[#0F1F0F] px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
      >
        <span className="text-lg">←</span>
        <span className="font-semibold">Go Back</span>
      </a>
    </main>
  );

  // small helper to clear selection — kept as inner function to use closure
  function resetSelection() {
    setRange(undefined);
    setErrorMsg(null);
    setSuccessMsg(null);
  }
}
