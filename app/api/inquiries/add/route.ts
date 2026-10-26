"use client";

import { useState } from "react";

export default function BookingPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [occasion, setOccasion] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");

    if (start < todayString) {
      setStatus("Please select today or a future check-in date.");
      return;
    }

    if (end <= start) {
      setStatus("Check-out must be after check-in.");
      return;
    }

    const nights = Math.round(
      (Date.parse(`${end}T00:00:00Z`) -
        Date.parse(`${start}T00:00:00Z`)) /
        (1000 * 60 * 60 * 24)
    );

    setSubmitting(true);
    setStatus("Submitting your booking request...");

    try {
      const response = await fetch("/api/inquiries/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          guests: Number(guests),
          occasion: occasion.trim(),
          check_in: start,
          check_out: end,
          nights,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your request.");
      }

      setStatus(
        "Your booking inquiry has been submitted successfully. We will contact you to confirm availability."
      );

      setName("");
      setPhone("");
      setGuests("1");
      setOccasion("");
      setStart("");
      setEnd("");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md sm:p-10">
        <h1 className="mb-4 text-3xl font-bold text-[#0F1F0F]">
          Book Villa Anant
        </h1>

        <p className="mb-8 text-gray-600">
          Tell us about your planned stay. Submitting this form sends a booking
          inquiry; your reservation is not confirmed until we contact you.
        </p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="booking-name" className="mb-2 block font-medium">
              Full Name
            </label>
            <input
              id="booking-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full rounded border border-gray-300 p-3"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="booking-phone" className="mb-2 block font-medium">
              Phone Number
            </label>
            <input
              id="booking-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={20}
              className="w-full rounded border border-gray-300 p-3"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="booking-guests" className="mb-2 block font-medium">
              Number of Guests
            </label>
            <input
              id="booking-guests"
              type="number"
              min="1"
              max="100"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="booking-occasion"
              className="mb-2 block font-medium"
            >
              Occasion (Optional)
            </label>
            <input
              id="booking-occasion"
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              maxLength={200}
              className="w-full rounded border border-gray-300 p-3"
              placeholder="Family stay, birthday, etc."
            />
          </div>

          <div>
            <label htmlFor="booking-start" className="mb-2 block font-medium">
              Check-in Date
            </label>
            <input
              id="booking-start"
              type="date"
              min={todayString}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-3"
            />
          </div>

          <div>
            <label htmlFor="booking-end" className="mb-2 block font-medium">
              Check-out Date
            </label>
            <input
              id="booking-end"
              type="date"
              min={start || todayString}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full rounded border border-gray-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-[#0F1F0F] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Request Booking"}
          </button>

          {status && (
            <p role="status" aria-live="polite" className="text-sm text-gray-700">
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
