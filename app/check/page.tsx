"use client";

import React, { useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  addDays,
  differenceInCalendarDays,
  format,
  startOfDay,
} from "date-fns";

const MOCHA = "#b5714a";
const WHATSAPP_NUMBER = "918889777288";

export default function CheckAvailabilityPage() {
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

  const getCalendarText = () => {
    if (!range?.from && !range?.to) return "Select Check In Date";
    if (range?.from && !range?.to) return "Select Check Out Date";
    return "";
  };

  const handleSelect = (value: DateRange | undefined) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!value?.from) {
      setRange(value);
      return;
    }

    if (startOfDay(value.from) < startOfDay(new Date())) {
      setErrorMsg("Please select today or a future check-in date.");
      return;
    }

    if (!value.to) {
      setRange(value);
      return;
    }

    if (differenceInCalendarDays(value.to, value.from) < 1) {
      value = { from: value.from, to: addDays(value.from, 1) };
    }

    setRange(value);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const handleResetDates = () => {
    setRange(undefined);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async () => {
    if (saving) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!range?.from || !range?.to) {
      setErrorMsg("Please select your check-in and check-out dates.");
      return;
    }

    if (startOfDay(range.from) < startOfDay(new Date())) {
      setErrorMsg("Please select today or a future check-in date.");
      return;
    }

    if (differenceInCalendarDays(range.to, range.from) < 1) {
      setErrorMsg("Check-out must be at least one night after check-in.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please enter your full name and phone number.");
      return;
    }

    if (!/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (
      guests === "" ||
      !Number.isInteger(Number(guests)) ||
      Number(guests) < 1 ||
      Number(guests) > 15
    ) {
      setErrorMsg("Please enter a number of guests between 1 and 15.");
      return;
    }

    const guestsNum = Number(guests);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      guests: guestsNum,
      occasion,
      check_in: format(range.from, "yyyy-MM-dd"),
      check_out: format(range.to, "yyyy-MM-dd"),
      nights: differenceInCalendarDays(range.to, range.from),
    };

    try {
      setSaving(true);

      const response = await fetch("/api/inquiries/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Unable to save your inquiry."
        );
      }

      setSuccessMsg("Inquiry saved. Opening WhatsApp...");

      const message = encodeURIComponent(
        `Hello! I'd like to inquire about booking Villa Anant.\n\n` +
          `Name: ${payload.name}\n` +
          `Phone: ${payload.phone}\n` +
          `Email: ${payload.email || "Not provided"}\n` +
          `Guests: ${guestsNum}\n` +
          `Occasion: ${occasion}\n` +
          `Check-in: ${payload.check_in}\n` +
          `Check-out: ${payload.check_out}\n` +
          `Nights: ${payload.nights}`
      );

      window.location.href =
        `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    } catch (error) {
      console.error("Failed to save inquiry:", error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to save inquiry. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-sand px-6 pb-16 pt-28">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-5 px-4 py-2 rounded border border-ink/30 text-ink hover:bg-black/5 transition"
        >
          ← Back
        </button>

        <h1 className="font-display text-4xl md:text-5xl font-medium mb-2 text-ink">
          Check Availability
        </h1>

        <p className="mb-6 text-[#4a4a4a]">
          Choose your preferred stay dates and share your details to inquire
          about Villa Anant. We will contact you to confirm your reservation.
        </p>

        {getCalendarText() && (
          <div className="mb-3 text-lg font-medium text-ink">
            {getCalendarText()}
          </div>
        )}

        <div className="rounded-2xl border border-ink/10 bg-cream p-4 md:p-6 shadow-sm overflow-x-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={{ before: startOfDay(new Date()) }}
          />
        </div>

        <button
          type="button"
          onClick={handleResetDates}
          className="mt-4 mb-2 px-4 py-2 rounded border border-ink/40 text-sm text-ink hover:bg-black/5 transition"
        >
          Reset dates
        </button>

        {errorMsg && (
          <div
            role="alert"
            className="mt-3 p-3 bg-red-100 text-red-800 rounded"
          >
            {errorMsg}
          </div>
        )}

        {range?.from && range?.to && (
          <div
            ref={formRef}
            className="mt-6 p-6 rounded-xl shadow-sm"
            style={{ background: MOCHA }}
          >
            <h2 className="text-xl text-white font-semibold mb-4">
              Guest Details
            </h2>

            <label className="block text-white text-sm mb-1" htmlFor="guest-name">
              Full name *
            </label>
            <input
              id="guest-name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              className="w-full p-3 mb-3 rounded"
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <label className="block text-white text-sm mb-1" htmlFor="guest-phone">
              Phone *
            </label>
            <input
              id="guest-phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={20}
              className="w-full p-3 mb-3 rounded"
              placeholder="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <label className="block text-white text-sm mb-1" htmlFor="guest-email">
              Email (optional)
            </label>
            <input
              id="guest-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className="w-full p-3 mb-3 rounded"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label className="block text-white text-sm mb-1" htmlFor="guest-count">
              Number of guests *
            </label>
            <input
              id="guest-count"
              type="number"
              min={1}
              max={15}
              step={1}
              required
              className="w-full p-3 mb-3 rounded"
              placeholder="Guests (1–15)"
              value={guests}
              onChange={(event) =>
                setGuests(
                  event.target.value === "" ? "" : Number(event.target.value)
                )
              }
            />

            <label className="block text-white text-sm mb-1" htmlFor="guest-occasion">
              Occasion
            </label>
            <select
              id="guest-occasion"
              className="w-full p-3 mb-3 rounded bg-white"
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
            >
              <option value="Stay">Stay</option>
              <option value="Other">Other</option>
            </select>

            <p className="text-white/90 text-sm mt-2">
              Selected stay: {format(range.from, "dd MMM yyyy")} –{" "}
              {format(range.to, "dd MMM yyyy")} (
              {differenceInCalendarDays(range.to, range.from)} night
              {differenceInCalendarDays(range.to, range.from) === 1 ? "" : "s"})
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full p-3 mt-4 bg-ink text-white rounded font-semibold hover:bg-[#1b321b] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving inquiry..." : "Confirm & Send on WhatsApp"}
            </button>

            {successMsg && (
              <div
                role="status"
                className="mt-4 p-3 bg-green-100 text-green-800 rounded"
              >
                {successMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
      <SiteFooter />
    </>
  );
}
