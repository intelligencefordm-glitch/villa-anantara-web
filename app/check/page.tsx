"use client";

import React, { useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, differenceInDays, format } from "date-fns";

export default function CheckAvailabilityPage() {
  const MOCHA = "#C29F80";

  const [range, setRange] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState<number | "">("");
  const [occasion, setOccasion] = useState("Stay");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

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

    setRange(val);

    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  };

  const handleResetDates = () => {
    setRange(undefined);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async () => {
    if (!range?.from || !range?.to)
      return setErrorMsg("Please select dates first.");

    if (!name || !phone)
      return setErrorMsg("Please fill all required fields.");

    if (guests === "" || Number.isNaN(Number(guests))) {
      return setErrorMsg("Please enter number of guests.");
    }

    const guestsNum = Number(guests);

    const payload = {
      name,
      phone,
      email,
      guests: guestsNum,
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

      setTimeout(() => {
        const message = encodeURIComponent(
          `Hello! I'd like to inquire about booking Villa Anantara.\n\n` +
            `Name: ${name}\nPhone: ${phone}\nGuests: ${guestsNum}\nOccasion: ${occasion}\n` +
            `Check-in: ${payload.check_in}\nCheck-out: ${payload.check_out}\nNights: ${payload.nights}`
        );

        window.location.href =
          `https://api.whatsapp.com/send?phone=918889777288&text=${message}`;
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save inquiry. Please try again.");
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
        modifiersClassNames={{
          selected: "custom-selected",
        }}
      />

      <style jsx global>{`
        .custom-selected {
          background-color: ${MOCHA} !important;
          color: white !important;
        }
      `}</style>

      <button
        onClick={handleResetDates}
        className="mt-3 mb-2 px-4 py-2 rounded border border-[#0F1F0F]/40 text-sm"
      >
        Reset dates
      </button>

      {errorMsg && (
        <div className="mt-2 p-3 bg-red-200 text-red-700 rounded">{errorMsg}</div>
      )}

      {range?.from && range?.to && (
        <div
          ref={formRef}
          className="mt-6 p-6 rounded"
          style={{ background: MOCHA }}
        >
          <h2 className="text-xl text-white font-semibold mb-4">Guest Details</h2>

          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full p-3 mb-3 rounded"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            min={1}
            max={15}
            className="w-full p-3 mb-3 rounded"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value === "" ? "" : Number(e.target.value))}
          />

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
            className="w-full p-3 mt-4 bg-black text-white rounded"
          >
            {saving ? "Saving..." : "Confirm & Send on WhatsApp"}
          </button>

          {successMsg && (
            <div className="mt-4 p-3 bg-green-200 text-green-700 rounded">
              {successMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}