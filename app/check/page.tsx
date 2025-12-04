"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function CheckAvailability() {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  // Fetch blocked dates
  const loadBlockedDates = async () => {
    setLoading(true);
    const res = await fetch("/api/blocks/list");
    const json = await res.json();

    if (Array.isArray(json)) {
      setBlockedDates(json.map((d: any) => new Date(d.date)));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlockedDates();
  }, []);

  // Handle selecting check-in + check-out
  const handleSelect = (date: Date) => {
    // If no check-in chosen → choose check-in
    if (!checkIn) {
      setCheckIn(date);
      setCheckOut(undefined);
      return;
    }

    // If date is before check-in → reset
    if (date < checkIn) {
      setCheckIn(date);
      setCheckOut(undefined);
      return;
    }

    // If selecting end date
    setCheckOut(date);
  };

  // WhatsApp link generator
  const getWhatsAppLink = () => {
    if (!checkIn || !checkOut) return "#";

    const msg = `Hi, I would like to inquire about Villa Anantara from ${format(
      checkIn,
      "dd MMM yyyy"
    )} to ${format(checkOut, "dd MMM yyyy")}.`;

    return `https://wa.me/918889777288?text=${encodeURIComponent(msg)}`;
  };

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{ backgroundColor: "#EFE5D5" }}
    >
      <h1 className="text-3xl font-bold text-[#0F1F0F] mb-6">
        Check Availability
      </h1>

      <p className="text-[#0F1F0F] mb-6">
        Select your check-in and check-out dates.
      </p>

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onDayClick={handleSelect}
          disabled={blockedDates}
          modifiers={{
            booked: blockedDates,
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: "#C29F80",
              color: "white",
            },
          }}
          numberOfMonths={2}
        />
      )}

      {/* SELECTION SUMMARY */}
      {(checkIn || checkOut) && (
        <div className="mt-10 text-[#0F1F0F]">
          <h2 className="text-xl font-bold mb-3">Your Dates</h2>

          <p>
            Check-in:{" "}
            {checkIn ? format(checkIn, "dd MMM yyyy") : "Not selected"}
          </p>
          <p>
            Check-out:{" "}
            {checkOut ? format(checkOut, "dd MMM yyyy") : "Not selected"}
          </p>

          {checkIn && checkOut && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              className="mt-6 inline-block px-6 py-3 rounded text-white font-bold"
              style={{ backgroundColor: "#0F1F0F" }}
            >
              Send Request on WhatsApp
            </a>
          )}
        </div>
      )}
    </main>
  );
}
