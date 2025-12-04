"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function CheckPage() {
  const mocha = "#C29F80";
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [showForm, setShowForm] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState("Stay");

  const today = new Date();

  // auto-open form when both dates are selected
  useEffect(() => {
    if (range.from && range.to) {
      setShowForm(true);
      setTimeout(() => {
        document.getElementById("guest-form")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [range]);

  const handleSubmit = async () => {
    if (!range.from || !range.to) return;

    const payload = {
      name,
      phone,
      email,
      guests,
      occasion,
      check_in: format(range.from, "yyyy-MM-dd"),
      check_out: format(range.to, "yyyy-MM-dd"),
      nights:
        (range.to.getTime() - range.from.getTime()) /
        (1000 * 60 * 60 * 24),
    };

    await fetch("/api/inquire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const waMessage = encodeURIComponent(
      `New Booking Inquiry:\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}\nOccasion: ${occasion}\nCheck-in: ${payload.check_in}\nCheck-out: ${payload.check_out}\nNights: ${payload.nights}`
    );

    window.location.href = `https://wa.me/918889777288?text=${waMessage}`;
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#EFE5D5" }}>
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-[#0F1F0F] mb-6">
          Check Availability
        </h1>

        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          disabled={{ before: today }}
          modifiersStyles={{
            selected: {
              backgroundColor: mocha,
              color: "white",
            },
          }}
        />

        {range.from && range.to && (
          <p className="mt-3 text-[#0F1F0F] font-medium">
            {`Selected: ${format(range.from, "dd MMM")} → ${format(
              range.to,
              "dd MMM"
            )}`}
          </p>
        )}

        <button
          onClick={() => setRange({ from: undefined, to: undefined })}
          className="mt-4 underline"
        >
          Reset dates
        </button>

        {showForm && (
          <section
            id="guest-form"
            className="mt-10 p-6 rounded shadow"
            style={{ backgroundColor: mocha, color: "white" }}
          >
            <h2 className="text-xl font-semibold mb-4">Guest Details</h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                className="p-2 rounded text-black"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="p-2 rounded text-black"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                className="p-2 rounded text-black"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="p-2 rounded text-black"
                type="number"
                placeholder="Guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />

              {/* Occasion */}
              <select
                className="p-2 rounded text-black"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="Stay">Stay</option>
                <option value="Other">Other</option>
              </select>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded font-bold mt-4"
                style={{ backgroundColor: "#0F1F0F", color: "white" }}
              >
                Confirm & Send on WhatsApp
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
