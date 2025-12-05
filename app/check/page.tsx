"use client";

import React, { useEffect, useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";

type BlockedPublicResponse = {
  blocked: string[];
};

export default function CheckAvailabilityPage() {
  const MOCHA = "#C29F0F";
  const DARK = "#0F1F0F";

  const [range, setRange] = useState<DateRange | undefined>();
  const [disabledDatesSet, setDisabledDatesSet] = useState<Set<string>>(
    new Set()
  );

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
  // FETCH PUBLIC BLOCKED DATES
  // ------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/admin/blocked-public");
        const json: BlockedPublicResponse = await res.json();

        const set = new Set<string>();
        (json.blocked || []).forEach((d) => set.add(d));

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

    const days = eachDayOfInterval({
      start: sel.from,
      end: addDays(sel.to, -1),
    });

    for (const d of days) {
      if (disabledDatesSet.has(format(d, "yyyy-MM-dd"))) return true;
    }
    return false;
  };

  // ------------------------------------
  // DAY PICKER SELECT
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

    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      150
    );
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
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!range?.from || !range?.to)
      return setErrorMsg("Please select your check-in and check-out dates.");

    if (!name.trim()) return setErrorMsg("Please enter your full name.");
    if (!phone.trim()) return setErrorMsg("Please enter your phone number.");

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
      if (!res.ok) throw new Error(json.error || "Failed to save");

      setSuccessMsg("Inquiry saved. Opening WhatsApp...");

      // Block selected dates instantly
      const days = eachDayOfInterval({
        start: parseISO(payload.check_in),
        end: addDays(parseISO(payload.check_out), -1),
      });

      const next = new Set(disabledDatesSet);
      days.forEach((d) => next.add(format(d, "yyyy-MM-dd")));
      setDisabledDatesSet(next);

      // ------------------------------------
      // FIXED WHATSAPP MESSAGE
      // ------------------------------------
      const whatsappMessage = encodeURIComponent(
        `Hello! I'd like to inquire about booking Villa Anantara.\n\n` +
          `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          `Guests: ${guests}\n` +
          `Occasion: ${occasion}\n` +
          `Check-in: ${payload.check_in}\n` +
          `Check-out: ${payload.check_out}\n` +
          `Nights: ${payload.nights}`
      );

      setTimeout(() => {
        window.open(
          `https://wa.me/918889777288?text=${whatsappMessage}`,
          "_blank"
        );

        // Clear selected range AFTER message is built
        setRange(undefined);
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save inquiry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className="min-h-screen p-6" style={{ background: "#EFE5D5" }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: DARK }}>
        Check Availability
      </h1>

      <p className="mb-4 text-sm" style={{ color: DARK }}>
        Select your check-in and check-out dates to see if Villa Anantara is
        available.
      </p>

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

      {successMsg && (
        <div className="mt-4 p-3 bg-green-200 text-green-700 rounded">
          {successMsg}
        </div>
      )}

      {range?.from && range?.to && !selectionIntersectsDisabled(range) && (
        <div
          ref={formRef}
          className="mt-6 p-6 rounded-lg shadow-md"
          style={{ background: MOCHA }}
        >
          <h2 className="text-xl text-white font-semibold mb-4">
            Guest Details
          </h2>

          {/* Full Name */}
          <label className="block text-white text-sm mb-1">Full name</label>
          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Phone */}
          <label className="block text-white text-sm mb-1">Phone</label>
          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="WhatsApp / phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Email */}
          <label className="block text-white text-sm mb-1">
            Email (optional)
          </label>
          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Guests */}
          <label className="block text-white text-sm mb-1">Guests</label>
          <input
            type="number"
            min={1}
            max={30}
            className="w-full p-3 mb-3 rounded"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value || 0))}
          />

          {/* Occasion */}
          <label className="block text-white text-sm mb-1">Occasion</label>
          <select
            className="w-full p-3 mb-3 rounded"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option value="Stay">Stay</option>
            <option value="Other">Other</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full p-3 mt-4 bg-black text-white rounded font-medium disabled:opacity-70"
          >
            {saving ? "Saving..." : "Confirm & Send on WhatsApp"}
          </button>
        </div>
      )}
    </div>
  );
}
