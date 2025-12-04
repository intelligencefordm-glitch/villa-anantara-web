"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function CheckAvailabilityPage() {
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState("Stay");

  const formRef = useRef<HTMLDivElement>(null);

  const mocha = "#C29F80";

  /** Auto-scroll to guest details when both dates selected */
  useEffect(() => {
    if (range?.from && range?.to && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [range]);

  /** Fix: prevent same check-in & check-out */
  const normalizeRange = (r: DateRange | undefined): DateRange | undefined => {
    if (!r) return r;
    if (r.from && r.to && r.from.getTime() === r.to.getTime()) {
      const nextDay = new Date(r.from);
      nextDay.setDate(nextDay.getDate() + 1);
      return { from: r.from, to: nextDay };
    }
    return r;
  };

  const nights =
    range?.from && range?.to
      ? Math.round(
          (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  /** Reset dates */
  const resetDates = () => setRange(undefined);

  /** Submit to WhatsApp + save to Supabase via API */
  const handleSubmit = async () => {
    if (!range?.from || !range?.to) return alert("Select your dates");
    if (!name.trim()) return alert("Enter your full name");
    if (!phone.trim()) return alert("Enter your WhatsApp number");

    const checkIn = format(range.from, "dd MMM yyyy");
    const checkOut = format(range.to, "dd MMM yyyy");

    const message = `
Hi, I would like to inquire about booking Villa Anantara.
Name: ${name}
Phone: ${phone}
Email: ${email || "N/A"}
Guests: ${guests}
Occasion: ${occasion}

Check-in: ${checkIn}
Check-out: ${checkOut}
Nights: ${nights}
`;

    const waUrl = `https://wa.me/918889777288?text=${encodeURIComponent(
      message
    )}`;

    // Save inquiry to Supabase
    await fetch("/api/inquiries/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        guests,
        occasion,
        check_in: range.from,
        check_out: range.to,
        nights,
        status: "pending",
      }),
    });

    window.open(waUrl, "_blank");
  };

  return (
    <main className="min-h-screen p-6 pb-20" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">
          Check Availability
        </h1>

        {/* Calendar */}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(val) => setRange(normalizeRange(val))}
          numberOfMonths={1}
          disabled={{ before: today }}
          modifiersStyles={{
            selected: {
              backgroundColor: mocha,
              color: "white",
              borderRadius: "6px",
            },
            range_middle: {
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
          styles={{
            caption: { color: "#0F1F0F", fontWeight: "600" },
            day: { borderRadius: "6px" },
          }}
        />

        {/* Reset */}
        <button
          onClick={resetDates}
          className="mt-3 underline text-sm text-[#0F1F0F]"
        >
          Reset dates
        </button>

        {/* Guest Details */}
        {range?.from && range?.to && (
          <div
            ref={formRef}
            className="mt-10 p-6 rounded-lg"
            style={{ backgroundColor: mocha }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Guest Details</h2>

            {/* Name */}
            <input
              className="w-full p-3 rounded mb-3"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Phone */}
            <input
              className="w-full p-3 rounded mb-3"
              placeholder="Phone (WhatsApp)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Email */}
            <input
              className="w-full p-3 rounded mb-3"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Guests */}
            <input
              className="w-full p-3 rounded mb-3"
              type="number"
              value={guests}
              min={1}
              onChange={(e) => setGuests(Number(e.target.value))}
            />

            {/* Occasion */}
            <select
              className="w-full p-3 rounded mb-4"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option>Stay</option>
              <option>Other</option>
            </select>

            {/* Summary */}
            <p className="text-white text-sm">
              <strong>Check-in:</strong> {format(range.from, "dd MMM yyyy")}
              <br />
              <strong>Check-out:</strong> {format(range.to, "dd MMM yyyy")}
              <br />
              <strong>Nights:</strong> {nights}
            </p>

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded text-white text-center font-bold"
              style={{ backgroundColor: "#0F1F0F" }}
            >
              Confirm & Send on WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* Go Back */}
      <a
        href="/"
        className="fixed bottom-6 left-6 bg-white px-4 py-2 rounded-full shadow flex items-center gap-2"
      >
        ← Go Back
      </a>
    </main>
  );
}
