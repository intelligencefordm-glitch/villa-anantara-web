"use client";

import React, { useEffect, useState, useRef } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, differenceInDays } from "date-fns";

export default function CheckAvailabilityPage() {
  // ⭐ FIXED: DateRange must always have from/to keys (can be undefined)
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Stay");

  const formRef = useRef<HTMLDivElement | null>(null);

  const mocha = "#C29F80";

  // AUTO SCROLL TO FORM AFTER DATES SELECTED
  useEffect(() => {
    if (range.from && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [range]);

  const nights =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // RESET FUNCTION
  const resetDates = () =>
    setRange({
      from: undefined,
      to: undefined,
    });

  // SEND WHATSAPP MESSAGE
  const handleWhatsApp = () => {
    if (!range.from || !range.to)
      return alert("Please select your dates first.");
    if (!name) return alert("Please enter your name.");
    if (!phone) return alert("Please enter your phone number.");

    const msg = encodeURIComponent(
      `Hello, I would like to book Villa Anantara.\n\n` +
        `👤 Name: ${name}\n` +
        `📱 Phone: ${phone}\n` +
        `✉️ Email: ${email || "Not provided"}\n` +
        `🎉 Occasion: ${occasion}\n` +
        `👥 Guests: ${guests}\n\n` +
        `📅 Check-in: ${format(range.from, "dd MMM yyyy")}\n` +
        `📅 Check-out: ${format(range.to, "dd MMM yyyy")}\n` +
        `🌙 Nights: ${nights}\n`
    );

    window.open(`https://wa.me/918889777288?text=${msg}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">
        Check Availability
      </h1>

      {/* CALENDAR */}
      <div className="mb-10">
        <DayPicker
          mode="range"
          numberOfMonths={1}
          selected={range}
          onSelect={setRange}
          disabled={{ before: today }}
          modifiersClassNames={{
            selected: "selected-day",
          }}
          styles={{
            caption: { color: "#0F1F0F", fontWeight: "600" },
            day: { borderRadius: "6px" },
            selected: {
              backgroundColor: mocha,
              color: "white",
            },
            range_start: {
              backgroundColor: mocha,
              color: "white",
            },
            range_end: {
              backgroundColor: mocha,
              color: "white",
            },
          }}
        />

        {/* RESET */}
        <button
          onClick={resetDates}
          className="mt-3 underline text-[#0F1F0F] text-sm hover:opacity-70"
        >
          Reset dates
        </button>
      </div>

      {/* GUEST DETAILS */}
      <div
        ref={formRef}
        className="p-6 rounded-lg max-w-3xl"
        style={{ backgroundColor: mocha }}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Guest Details
        </h2>

        {/* NAME */}
        <p className="text-white mb-1">Full Name</p>
        <input
          className="w-full p-2 rounded mb-4 bg-white"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* PHONE */}
        <p className="text-white mb-1">Phone (WhatsApp)</p>
        <input
          className="w-full p-2 rounded mb-4 bg-white"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* EMAIL */}
        <p className="text-white mb-1">Email (optional)</p>
        <input
          className="w-full p-2 rounded mb-4 bg-white"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* OCCASION */}
        <p className="text-white mb-1">Occasion</p>
        <select
          className="w-full p-2 rounded mb-4 bg-white"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option value="Stay">Stay</option>
          <option value="Other">Other</option>
        </select>

        {/* GUESTS */}
        <p className="text-white mb-1">Guests</p>
        <input
          type="number"
          min={1}
          max={30}
          className="w-full p-2 rounded mb-4 bg-white"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />

        {/* SUMMARY */}
        {range.from && range.to && (
          <div className="text-white text-sm mb-4">
            <p>
              <strong>Check-in:</strong>{" "}
              {format(range.from, "dd MMM yyyy")}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {format(range.to, "dd MMM yyyy")}
            </p>
            <p>
              <strong>Nights:</strong> {nights}
            </p>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleWhatsApp}
          className="bg-[#0F1F0F] text-white px-5 py-2 rounded font-semibold hover:opacity-90"
        >
          Confirm & Send on WhatsApp
        </button>
      </div>

      {/* GO BACK BUTTON */}
      <a
        href="/"
        className="fixed bottom-6 left-6 flex items-center gap-2 bg-white text-[#0F1F0F] px-4 py-2 shadow rounded-full hover:scale-105 transition"
      >
        <span className="text-xl">←</span>
        <span className="font-semibold">Go Back</span>
      </a>
    </main>
  );
}
