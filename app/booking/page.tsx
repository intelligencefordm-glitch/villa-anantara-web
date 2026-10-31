"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import axios from "axios";

export default function BookingPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Today's date in local time, formatted as YYYY-MM-DD
  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (start < todayString) {
      setStatus("Please select today or a future date for your arrival.");
      return;
    }

    if (end <= start) {
      setStatus("Your departure date must be after your arrival date.");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting your booking request...");

    try {
      await axios.post("/api/book", {
        name,
        phone,
        startDate: start,
        endDate: end,
        message,
        totalAmount: 0,
        depositAmount: 0,
        depositPaid: false,
      });

      setStatus(
        "Your booking request has been submitted. We will contact you to confirm your reservation."
      );
      setName("");
      setPhone("");
      setStart("");
      setEnd("");
      setMessage("");
    } catch {
      setStatus(
        "We couldn't submit your booking request. Please try again or contact us on WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-6 pb-20 pt-32">
      <h1 className="font-display text-4xl md:text-5xl font-medium text-ink mb-4">
        Book Villa Anant
      </h1>

      <p className="text-gray-600 mb-8">
        Submit your preferred dates and contact details. Your reservation will
        be confirmed after we review your request.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="booking-name" className="block mb-2 font-medium">
            Full Name
          </label>
          <input
            id="booking-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className="block mb-2 font-medium">
            Phone Number
          </label>
          <input
            id="booking-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="booking-start" className="block mb-2 font-medium">
            Check-in Date
          </label>
          <input
            id="booking-start"
            type="date"
            value={start}
            min={todayString}
            onChange={(e) => setStart(e.target.value)}
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="booking-end" className="block mb-2 font-medium">
            Check-out Date
          </label>
          <input
            id="booking-end"
            type="date"
            value={end}
            min={start || todayString}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="booking-message" className="block mb-2 font-medium">
            Message (Optional)
          </label>
          <textarea
            id="booking-message"
            placeholder="Tell us about your stay or any special requests"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded border border-gray-300 p-3"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-ink px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Request Booking (Pay Later)"}
        </button>

        {status && (
          <p role="status" aria-live="polite" className="text-sm text-gray-700">
            {status}
          </p>
        )}
      </form>
    </main>
      <SiteFooter />
    </>
  );
}
