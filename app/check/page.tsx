"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, eachDayOfInterval, isBefore, isAfter } from "date-fns";

export default function CheckAvailability() {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  const [warning, setWarning] = useState("");

  // Load blocked dates from API
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

  // Helper: Check if the selected range includes a blocked date
  const rangeHasBlockedDates = (start: Date, end: Date) => {
    const allDays = eachDayOfInterval({ start, end });
    return allDays.some((d) =>
      blockedDates.some(
        (b) => format(b, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
      )
    );
  };

  // Handle selecting dates
  const handleSelect = (day: Date) => {
    setWarning("");

    // STEP 1: If no check-in chosen → set check-in
    if (!checkIn) {
      setCheckIn(day);
      setCheckOut(undefined);
      return;
    }

    // STEP 2: If selecting check-out
    if (isBefore(day, checkIn)) {
      // restart selection
      setCheckIn(day);
      setCheckOut(undefined);
      return;
    }

    // STEP 3: Check if range crosses blocked dates
    if (rangeHasBlockedDates(checkIn, day)) {
      setWarning("Your selected dates include unavailable dates. Please choose again.");
      return;
    }

    // Valid range
    setCheckOut(day);
  };

  const nights =
    checkIn && checkOut
      ? eachDayOfInterval({ start: checkIn, end: checkOut }).length - 1
      : 0;

  const getWhatsAppLink = () => {
    if (!checkIn || !checkOut) return "#";

    const msg = `Hi, I want to book Villa Anantara from ${format(
      checkIn,
      "dd MMM yyyy"
    )} to ${format(checkOut, "dd MMM yyyy")} (${nights} nights).`;

    return `https://wa.me/918889777288?text=${encodeURIComponent(msg)}`;
  };

  const resetDates = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setWarning("");
  };

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: "#EFE5D5" }}>
      <h1 className="text-3xl font-bold text-[#0F1F0F] mb-6">Check Availability</h1>

      {warning && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">
          {warning}
        </div>
      )}

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onDayClick={handleSelect}
          disabled={blockedDates}
          modifiers={{
            blocked: blockedDates,
          }}
          modifiersStyles={{
            blocked: {
              color: "white",
              backgroundColor: "#C29F80",
              opacity: 0.9,
            },
          }}
          numberOfMonths={2}
        />
      )}

      <div className="mt-10 text-[#0F1F0F] space-y-4">
        <h2 className="text-xl font-bold">Your Selection</h2>

        <p>
          <strong>Check-in:</strong>{" "}
          {checkIn ? format(checkIn, "dd MMM yyyy") : "Not selected"}
        </p>

        <p>
          <strong>Check-out:</strong>{" "}
          {checkOut ? format(checkOut, "dd MMM yyyy") : "Not selected"}
        </p>

        {checkIn && checkOut && (
          <p>
            <strong>Number of Nights:</strong> {nights}
          </p>
        )}

        {/* WhatsApp button */}
        {checkIn && checkOut && (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            className="inline-block px-6 py-3 rounded text-white font-bold"
            style={{ backgroundColor: "#0F1F0F" }}
          >
            Send Request on WhatsApp
          </a>
        )}

        {/* Reset button */}
        {(checkIn || checkOut) && (
          <button
            onClick={resetDates}
            className="block mt-4 text-sm underline text-[#0F1F0F]"
          >
            Reset dates
          </button>
        )}
      </div>
    </main>
  );
}
