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
  const MOCHA = "#C29F80";
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
  // FETCH MERGED BLOCKED DATES (PUBLIC)
  // ------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/admin/blocked-public");
        const json: BlockedPublicResponse = await res.json();

        const blocked = json.blocked || [];
        const set = new Set<string>();
        blocked.forEach((d) => set.add(d));
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
  // DAY SELECTION HANDLER
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
  // SUBMIT INQUIRY
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

      // Mark dates instantly as blocked
      const days = eachDayOfInterval({
        start: parseISO(payload.check_in),
        end: addDays(parseISO(payload.check_out), -1),
      });

      const next = new Set(disabledDatesSet);
      days.forEach((d) => next.add(format(d, "yyyy-MM-dd")));
      setDisabledDatesSet(next);

      // OPEN WHATSAPP
      setTimeout(() => {
        const message = encodeURIComponent(
          `Hello! I'd like to inquire about booking Villa Anantara.\n\n` +
            `Name: ${name}\nPhone: ${phone}\nGuests: ${guests}\nOccasion: ${occasion}\n` +
            `Check-in: ${payload.check_in}\nCheck-out: ${payload.check_out}\nNights: ${payload.nights}`
        );

        window.open(`https://wa.me/918889777288?text=${message}`, "_blank");

        // IMPORTANT FIX: CLEAR RANGE TO PREVENT RED ERROR
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
  // RENDER UI
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
          <div className="mb-3">
            <label className="block text-sm font-medium text-white mb-1">
              Full name
            </label>
            <input
              className="w-full p-3 rounded outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-white mb-1">
              Phone
            </label>
            <input
              className="w-full p-3 rounded outline-none"
              placeholder="Your WhatsApp / phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-white mb-1">
              Email (optional)
            </label>
            <input
              className="w-full p-3 rounded outline-none"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Guests */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-white mb-1">
              Guests
            </label>
            <input
              type="number"
              min={1}
              max={30}
              className="w-full p-3 rounded outline-none"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value || 0))}
            />
          </div>

          {/* Occasion */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-white mb-1">
              Occasion
            </label>
            <select
              className="w-full p-3 rounded outline-none"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option value="Stay">Stay / Vacation</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Wedding">Wedding / Pre-wedding</option>
              <option value="Workcation">Workcation / Offsite</option>
              <option value="Other">Other</option>
            </select>
          </div>

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
