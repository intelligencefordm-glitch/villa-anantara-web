"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, eachDayOfInterval, isBefore } from "date-fns";

export default function CheckAvailability() {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  // guest form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState<number>(2);

  const [warning, setWarning] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadBlockedDates();
  }, []);

  async function loadBlockedDates() {
    setLoading(true);
    try {
      const res = await fetch("/api/blocks/list");
      const json = await res.json();
      if (Array.isArray(json)) {
        setBlockedDates(json.map((d: any) => new Date(d.date)));
      }
    } catch (e) {
      console.error("Failed load blocked", e);
    } finally {
      setLoading(false);
    }
  }

  const rangeHasBlockedDates = (start: Date, end: Date) => {
    const allDays = eachDayOfInterval({ start, end });
    return allDays.some((d) =>
      blockedDates.some(
        (b) => format(b, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
      )
    );
  };

  const handleSelect = (day: Date) => {
    setWarning("");

    if (!checkIn) {
      setCheckIn(day);
      setCheckOut(undefined);
      return;
    }

    if (isBefore(day, checkIn)) {
      setCheckIn(day);
      setCheckOut(undefined);
      return;
    }

    if (rangeHasBlockedDates(checkIn, day)) {
      setWarning("Selected range includes unavailable dates. Choose different dates.");
      return;
    }

    setCheckOut(day);
  };

  const nights =
    checkIn && checkOut
      ? eachDayOfInterval({ start: checkIn, end: checkOut }).length - 1
      : 0;

  const resetDates = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setWarning("");
  };

  // form validation
  const validateForm = () => {
    if (!name.trim()) {
      setWarning("Please enter your name.");
      return false;
    }
    if (!phone.trim()) {
      setWarning("Please enter your phone number.");
      return false;
    }
    if (!checkIn || !checkOut) {
      setWarning("Please select check-in and check-out dates.");
      return false;
    }
    return true;
  };

  const sendInquiry = async () => {
    setWarning("");
    if (!validateForm()) return;

    setSending(true);
    const payload = {
      name,
      phone,
      email,
      guests,
      check_in: format(checkIn!, "yyyy-MM-dd"),
      check_out: format(checkOut!, "yyyy-MM-dd"),
      nights,
    };

    try {
      await fetch("/api/inquiries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const waMsg = `Hi, I am ${payload.name}. I want to book Villa Anantara from ${format(
        checkIn!,
        "dd MMM yyyy"
      )} to ${format(checkOut!, "dd MMM yyyy")} (${nights} nights) for ${
        payload.guests
      } guests. My contact: ${payload.phone}${
        payload.email ? `, Email: ${payload.email}` : ""
      }.`;

      window.open(
        `https://wa.me/918889777288?text=${encodeURIComponent(waMsg)}`,
        "_blank"
      );
    } catch (err) {
      console.error(err);
      setWarning("Failed to send request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{ backgroundColor: "#EFE5D5" }}
    >
      <h1 className="text-3xl font-bold text-[#0F1F0F] mb-4">Check Availability</h1>

      {warning && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{warning}</div>
      )}

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <>
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={{ from: checkIn, to: checkOut }}
            onDayClick={handleSelect}
            disabled={blockedDates}
            modifiers={{ blocked: blockedDates }}
            modifiersStyles={{
              selected: {
                backgroundColor: "#C29F80",
                color: "white",
              },
              blocked: {
                backgroundColor: "#A67C5A",
                color: "white",
              },
            }}
          />

          {/* SECOND RESET BUTTON BELOW CALENDAR */}
          <div className="mt-4">
            <button onClick={resetDates} className="underline text-[#0F1F0F]">
              Reset dates
            </button>
          </div>
        </>
      )}

      {/* GUEST DETAILS */}
      <div
        className="mt-8 max-w-2xl rounded shadow p-6"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h2 className="text-xl font-semibold mb-3">Guest Details</h2>

        <label className="block mb-2 text-sm">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-white text-black"
          placeholder="e.g. Rahul Sharma"
        />

        <label className="block mb-2 text-sm">Phone (WhatsApp)</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-white text-black"
          placeholder="+91 9xxxxxxxxx"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-3 bg-white text-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Guests</label>
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3 bg-white text-black"
            />
          </div>
        </div>

        <div className="mt-4 text-white">
          <p>
            <strong>Check-in:</strong>{" "}
            {checkIn ? format(checkIn, "dd MMM yyyy") : "-"}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {checkOut ? format(checkOut, "dd MMM yyyy") : "-"}
          </p>
          {checkIn && checkOut && (
            <p>
              <strong>Nights:</strong> {nights}
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={sendInquiry}
            disabled={sending}
            className="px-5 py-2 rounded text-white font-semibold"
            style={{ backgroundColor: "#0F1F0F" }}
          >
            {sending ? "Sending..." : "Confirm & Send on WhatsApp"}
          </button>

          <button onClick={resetDates} className="px-4 py-2 rounded border">
            Reset dates
          </button>
        </div>
      </div>

      {/* FLOATING GO BACK BUTTON */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border hover:scale-105 transition"
        >
          {/* SVG Arrow */}
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <span className="text-[#0F1F0F] font-semibold">Go Back</span>
      </div>
    </main>
  );
}
