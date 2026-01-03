"use client";

import React, { useState } from "react";

export default function ConfirmBookingPage() {
  const MOCHA = "#C29F80";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("Stay");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI / Online");
  const [idType, setIdType] = useState("Aadhaar");

  const [idFile, setIdFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitBooking() {
    setError("");
    setSuccess("");

    if (
      !name ||
      !phone ||
      !guests ||
      !checkIn ||
      !checkOut ||
      !totalAmount ||
      !idFile ||
      !agree
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (paymentMode !== "Cash" && !paymentFile) {
      setError("Payment screenshot required for online payments.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("guests", guests);
    formData.append("occasion", occasion);
    formData.append("check_in", checkIn);
    formData.append("check_out", checkOut);
    formData.append("total_amount", totalAmount);
    formData.append("amount_paid", amountPaid || "0");
    formData.append("payment_mode", paymentMode);
    formData.append("id_type", idType);
    formData.append("id_file", idFile);

    if (paymentFile) {
      formData.append("payment_file", paymentFile);
    }

    try {
      setLoading(true);

      const res = await fetch("/api/confirm-booking", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Submission failed");

      setSuccess("Booking confirmed successfully.");
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] flex justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Confirm Booking
        </h1>

        <input className="input" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
        <input className="input" placeholder="Guests" onChange={(e) => setGuests(e.target.value)} />

        <select className="input" onChange={(e) => setOccasion(e.target.value)}>
          <option>Stay</option>
          <option>Other</option>
        </select>

        <label>Check-in *</label>
        <input type="date" className="input" onChange={(e) => setCheckIn(e.target.value)} />

        <label>Check-out *</label>
        <input type="date" className="input" onChange={(e) => setCheckOut(e.target.value)} />

        <input className="input" placeholder="Total Amount" onChange={(e) => setTotalAmount(e.target.value)} />
        <input className="input" placeholder="Amount Paid" onChange={(e) => setAmountPaid(e.target.value)} />

        <select className="input" onChange={(e) => setPaymentMode(e.target.value)}>
          <option>UPI / Online</option>
          <option>Cash</option>
        </select>

        <select className="input" onChange={(e) => setIdType(e.target.value)}>
          <option>Aadhaar</option>
          <option>Driving License</option>
        </select>

        <label>ID Proof *</label>
        <input type="file" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />

        {paymentMode !== "Cash" && (
          <>
            <label>Payment Screenshot *</label>
            <input type="file" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} />
          </>
        )}

        <div className="mt-3">
          <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />{" "}
          I accept{" "}
          <a href="/terms" className="underline">
            Terms & Conditions
          </a>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}

        <button
          onClick={submitBooking}
          disabled={loading}
          className="w-full mt-4 py-3 rounded text-white font-bold"
          style={{ backgroundColor: MOCHA }}
        >
          {loading ? "Submitting..." : "Confirm Booking"}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
      `}</style>
    </main>
  );
}