"use client";

import React, { useEffect, useRef, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function CheckAvailabilityPage() {
  const mocha = "#C29F80";
  const router = useRouter();

  const today = new Date();

  const [range, setRange] = useState<DateRange | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("0");
  const [occasion, setOccasion] = useState("Stay");

  const formRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to form when dates selected
  useEffect(() => {
    if (range?.from && range?.to) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [range]);

  const nights =
    range?.from && range?.to
      ? Math.ceil(
          (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  // Prevent selecting same-day in/out
  const handleSelect = (selected: DateRange | undefined) => {
    if (selected?.from && selected?.to) {
      if (format(selected.from, "yyyy-MM-dd") === format(selected.to, "yyyy-MM-dd")) {
        return; // ignore invalid selection
      }
    }
    setRange(selected);
  };

  // Reset calendar + form
  const resetAll = () => {
    setRange(undefined);
    setName("");
    setPhone("");
    setEmail("");
    setGuests("0");
    setOccasion("Stay");
  };

  // Send WhatsApp
  const submitWhatsApp = () => {
    if (!name || !phone || !range?.from || !range?.to) return alert("Please fill all required fields.");

    const msg = encodeURIComponent(
      `New Inquiry:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nGuests: ${guests}\nOccasion: ${occasion}\n\nCheck-in: ${format(
        range.from,
        "dd MMM yyyy"
      )}\nCheck-out: ${format(range.to, "dd MMM yyyy")}\nNights: ${nights}`
    );

    window.open(`https://wa.me/918889777288?text=${msg}`, "_blank");
  };

  return (
    <main className="min-h-screen p-6 pb-20" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-[#0F1F0F]">Check Availability</h1>

        {/* Calendar */}
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={1}
          disabled={{ before: today }}
          modifiers={{ selected: range }}
          modifiersStyles={{
            selected: {
              backgroundColor: mocha,
              color: "white",
              borderRadius: "6px",
            },
          }}
          styles={{
            caption: { color: "#0F1F0F", fontWeight: "600" },
            day: { borderRadius: "6px" },
          }}
        />

        <button
          className="mt-3 underline text-sm"
          onClick={resetAll}
        >
          Reset dates
        </button>

        {/* Guest Details Box */}
        {range?.from && range?.to && (
          <div
            ref={formRef}
            className="p-6 mt-8 rounded shadow-lg"
            style={{ backgroundColor: mocha }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Guest Details</h2>

            {/* Full Name */}
            <label className="text-white text-sm">Full Name</label>
            <input
              className="w-full p-2 rounded mb-3"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Phone */}
            <label className="text-white text-sm">Phone (WhatsApp)</label>
            <input
              className="w-full p-2 rounded mb-3"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Email */}
            <label className="text-white text-sm">Email (optional)</label>
            <input
              className="w-full p-2 rounded mb-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Guests */}
            <label className="text-white text-sm">Guests</label>
            <input
              className="w-full p-2 rounded mb-3"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />

            {/* Occasion */}
            <label className="text-white text-sm">Occasion</label>
            <select
              className="w-full p-2 rounded mb-3"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option>Stay</option>
              <option>Other</option>
            </select>

            {/* Dates Summary */}
            <div className="text-white text-sm mt-3">
              <p>Check-in: <b>{format(range.from, "dd MMM yyyy")}</b></p>
              <p>Check-out: <b>{format(range.to, "dd MMM yyyy")}</b></p>
              <p>Nights: <b>{nights}</b></p>
            </div>

            {/* CTA */}
            <button
              onClick={submitWhatsApp}
              className="w-full mt-5 py-3 rounded text-white font-semibold"
              style={{ backgroundColor: "#0F1F0F" }}
            >
              Confirm & Send on WhatsApp
            </button>

            {/* Reset Button */}
            <button
              onClick={resetAll}
              className="mt-3 px-4 py-2 border rounded text-white"
            >
              Reset details
            </button>
          </div>
        )}

        {/* Go Back */}
        <button
          onClick={() => router.back()}
          className="fixed bottom-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"
        >
          ← Go Back
        </button>
      </div>
    </main>
  );
}
