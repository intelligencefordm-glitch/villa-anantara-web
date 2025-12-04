"use client";

import React, { useEffect, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInDays, format } from "date-fns";

export default function CheckPage() {
  const mocha = "#C29F80";

  // Calendar range
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [showForm, setShowForm] = useState(false);

  // Guest form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Stay");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Auto-open guest form when dates selected
  useEffect(() => {
    if (range.from && range.to) {
      setShowForm(true);
      setTimeout(() => {
        document.getElementById("guest-form")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
  }, [range]);

  const nights =
    range.from && range.to
      ? differenceInDays(range.to, range.from)
      : 0;

  // Submit to Supabase + WhatsApp
  const handleSubmit = async () => {
    if (!range.from || !range.to) return alert("Please select dates");
    if (!name) return alert("Please enter your name");
    if (!phone) return alert("Please enter your phone number");

    const payload = {
      name,
      phone,
      email,
      guests,
      occasion,
      check_in: format(range.from, "yyyy-MM-dd"),
      check_out: format(range.to, "yyyy-MM-dd"),
      nights,
    };

    // Save inquiry in Supabase
    await fetch("/api/inquiries/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // WhatsApp message
    const waMessage = encodeURIComponent(
      `New Booking Inquiry:\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Guests: ${guests}\n` +
        `Occasion: ${occasion}\n` +
        `Check-in: ${payload.check_in}\n` +
        `Check-out: ${payload.check_out}\n` +
        `Nights: ${nights}`
    );

    window.location.href = `https://wa.me/918889777288?text=${waMessage}`;
  };

  // Reset calendar
  const resetDates = () =>
    setRange({ from: undefined, to: undefined });

  return (
    <main className="min-h-screen p-6 pb-20" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">
          Check Availability
        </h1>

        {/* CALENDAR */}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          disabled={{ before: today }}
          modifiers={{
            selected: range,
            range_start: range.from,
            range_end: range.to,
          }}
          modifiersStyles={{
            selected: { backgroundColor: mocha, color: "white" },
            range_start: { backgroundColor: mocha, color: "white" },
            range_end: { backgroundColor: mocha, color: "white" },
          }}
        />

        {/* Display selected dates */}
        {range.from && range.to && (
          <p className="mt-3 text-[#0F1F0F] font-medium">
            {format(range.from, "dd MMM")} → {format(range.to, "dd MMM")}
          </p>
        )}

        {/* Reset */}
        <button
          onClick={resetDates}
          className="mt-4 underline text-[#0F1F0F] hover:opacity-70"
        >
          Reset dates
        </button>

        {/* GUEST FORM */}
        {showForm && (
          <section
            id="guest-form"
            className="mt-10 p-6 rounded shadow"
            style={{ backgroundColor: mocha }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Guest Details
            </h2>

            <div className="grid grid-cols-1 gap-4">

              {/* Name */}
              <input
                placeholder="Full name"
                className="p-2 rounded bg-white text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Phone */}
              <input
                placeholder="Phone (WhatsApp)"
                className="p-2 rounded bg-white text-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* Email */}
              <input
                placeholder="Email (optional)"
                className="p-2 rounded bg-white text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Guests */}
              <input
                type="number"
                min={1}
                max={30}
                placeholder="Guests"
                className="p-2 rounded bg-white text-black"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />

              {/* Occasion */}
              <select
                className="p-2 rounded bg-white text-black"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="Stay">Stay</option>
                <option value="Other">Other</option>
              </select>

              {/* Summary */}
              <div className="text-white text-sm">
                <p>Check-in: {range.from && format(range.from, "dd MMM yyyy")}</p>
                <p>Check-out: {range.to && format(range.to, "dd MMM yyyy")}</p>
                <p>Nights: {nights}</p>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded font-bold"
                style={{ backgroundColor: "#0F1F0F", color: "white" }}
              >
                Confirm & Send on WhatsApp
              </button>

            </div>
          </section>
        )}

        {/* GO BACK */}
        <a
          href="/"
          className="fixed bottom-6 left-6 flex items-center gap-2 bg-white text-[#0F1F0F] px-4 py-2 shadow rounded-full hover:scale-105"
        >
          <span className="text-xl">←</span>
          <span className="font-semibold">Go Back</span>
        </a>
      </div>
    </main>
  );
}
