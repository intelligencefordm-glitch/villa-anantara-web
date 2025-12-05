"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";

export default function CheckAvailabilityPage() {
  const MOCHA = "#C29F80";
  const DARK = "#0F1F0F";

  const [range, setRange] = useState<DateRange | undefined>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [disabledDatesSet, setDisabledDatesSet] = useState<Set<string>>(new Set());

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState("Stay");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ------------------------------------
  // 🔥 FETCH BOOKINGS + BLOCKED DATES
  // ------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. get inquiries
        const bRes = await fetch("/api/inquiries/list");
        const bJson = await bRes.json();

        // 2. get admin blocked dates
        const blkRes = await fetch("/api/blocks/list");
        const blkJson = await blkRes.json();

        setBookings(bJson.inquiries || []);
        setBlockedDates(blkJson.blocked || []);

        // BUILD DISABLED DATES SET
        const set = new Set<string>();

        // A) Booked dates (from inquiries)
        (bJson.inquiries || []).forEach((inq: any) => {
          if (inq.check_in && inq.check_out) {
            const start = parseISO(inq.check_in);
            const end = parseISO(inq.check_out);
            const days = eachDayOfInterval({ start, end: addDays(end, -1) });
            days.forEach((d) => set.add(format(d, "yyyy-MM-dd")));
          }
        });

        // B) Blocked by admin
        (blkJson.blocked || []).forEach((d: string) => set.add(d));

        setDisabledDatesSet(set);
      } catch (err) {
        console.error("Availability Load Error", err);
      }
    };

    loadData();
  }, []);

  // ------------------------------------
  // CHECK IF RANGE OVERLAPS DISABLED
  // ------------------------------------
  const selectionIntersectsDisabled = (sel: DateRange | undefined) => {
    if (!sel?.from || !sel?.to) return false;

    const days = eachDayOfInterval({ start: sel.from, end: addDays(sel.to, -1) });

    for (const d of days) {
      if (disabledDatesSet.has(format(d, "yyyy-MM-dd"))) {
        return true;
      }
    }
    return false;
  };

  // ------------------------------------
  // FIX DAY SELECTION
  // ------------------------------------
  const handleSelect = (val: DateRange | undefined) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!val?.from || !val?.to) {
      setRange(val);
      return;
    }

    if (differenceInDays(val.to, val.from) < 1) {
      val = { from: val.from, to: addDays(val.from, 1) };
    }

    if (selectionIntersectsDisabled(val)) {
      setErrorMsg("Sorry — those dates are not available.");
      return;
    }

    setRange(val);

    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  };

  const disabledPicker = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    if (date < today) return true;
    return disabledDatesSet.has(key);
  };

  // ------------------------------------
  // SUBMIT
  // ------------------------------------
  const handleSubmit = async () => {
    if (!range?.from || !range?.to) return setErrorMsg("Please select dates.");
    if (selectionIntersectsDisabled(range))
      return setErrorMsg("Sorry — those dates are not available.");

    const payload = {
      name,
      phone,
      email,
      guests,
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
      if (!res.ok) throw new Error(json.error);

      setSuccessMsg("Inquiry saved. Opening WhatsApp...");

      // Update UI instantly
      const days = eachDayOfInterval({
        start: parseISO(payload.check_in),
        end: addDays(parseISO(payload.check_out), -1),
      });

      const next = new Set(disabledDatesSet);
      days.forEach((d) => next.add(format(d, "yyyy-MM-dd")));
      setDisabledDatesSet(next);

      setTimeout(() => {
        const message = encodeURIComponent(
          `Hello! I'd like to inquire about booking Villa Anantara.\n\n` +
            `Name: ${name}\nPhone: ${phone}\nGuests: ${guests}\nOccasion: ${occasion}\n` +
            `Check-in: ${payload.check_in}\nCheck-out: ${payload.check_out}\nNights: ${payload.nights}`
        );
        window.open(`https://wa.me/918889777288?text=${message}`, "_blank");
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save inquiry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#EFE5D5" }}>
      <h1 className="text-3xl font-bold mb-2 text-[#0F1F0F]">Check Availability</h1>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabledPicker}
        modifiers={{
          booked: [...disabledDatesSet].map((d) => parseISO(d)),
        }}
        modifiersStyles={{
          booked: { background: "crimson", color: "white" },
          selected: { background: MOCHA, color: "white" },
        }}
      />

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-200 text-red-700 rounded">{errorMsg}</div>
      )}

      {range?.from && range?.to && !selectionIntersectsDisabled(range) && (
        <div ref={formRef} className="mt-6 p-6 rounded" style={{ background: MOCHA }}>
          <h2 className="text-xl text-white font-semibold mb-4">Guest Details</h2>

          <input className="w-full p-3 mb-3 rounded" placeholder="Full name"
            value={name} onChange={(e) => setName(e.target.value)} />

          <input className="w-full p-3 mb-3 rounded" placeholder="Phone"
            value={phone} onChange={(e) => setPhone(e.target.value)} />

          <input className="w-full p-3 mb-3 rounded" placeholder="Email (optional)"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <button onClick={handleSubmit}
            className="w-full p-3 mt-4 bg-black text-white rounded">
            {saving ? "Saving..." : "Confirm & Send on WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}
