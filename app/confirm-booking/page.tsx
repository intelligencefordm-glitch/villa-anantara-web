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
  const [paymentMode, setPaymentMode] = useState("");
  const [idProofType, setIdProofType] = useState("");

  const [idFile, setIdFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !name ||
      !phone ||
      !guests ||
      !checkIn ||
      !checkOut ||
      !totalAmount ||
      !paymentMode ||
      !idProofType ||
      !idFile
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (paymentMode === "UPI" && !paymentFile) {
      setError("Please upload payment screenshot for UPI payment.");
      return;
    }

    if (!agree) {
      setError("Please accept Terms & Conditions.");
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
    formData.append("id_proof_type", idProofType);
    formData.append("id_proof", idFile);

    if (paymentMode === "UPI" && paymentFile) {
      formData.append("payment_proof", paymentFile);
    }

    try {
      setLoading(true);

      const res = await fetch("/api/confirm-booking", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      setSuccess("Booking submitted successfully!");

      // reset form
      setName("");
      setPhone("");
      setGuests("");
      setOccasion("Stay");
      setCheckIn("");
      setCheckOut("");
      setTotalAmount("");
      setAmountPaid("");
      setPaymentMode("");
      setIdProofType("");
      setIdFile(null);
      setPaymentFile(null);
      setAgree(false);
    } catch (err) {
      setError("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#EFE5D5" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Confirm Booking
        </h1>

        <input
          className="w-full border p-3 mb-3 rounded"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-3 mb-3 rounded"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full border p-3 mb-3 rounded"
          placeholder="Number of Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />

        <select
          className="w-full border p-3 mb-3 rounded"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option value="Stay">Stay</option>
          <option value="Other">Other</option>
        </select>

        <label className="text-sm font-semibold">Check-in *</label>
        <input
          type="date"
          className="w-full border p-3 mb-3 rounded"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />

        <label className="text-sm font-semibold">Check-out *</label>
        <input
          type="date"
          className="w-full border p-3 mb-3 rounded"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />

        <input
          className="w-full border p-3 mb-3 rounded"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />

        <input
          className="w-full border p-3 mb-3 rounded"
          placeholder="Amount Paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
        />

        <select
          className="w-full border p-3 mb-3 rounded"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="">Select Payment Mode</option>
          <option value="UPI">UPI / Online</option>
          <option value="Cash">Cash</option>
        </select>

        {paymentMode === "UPI" && (
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Upload Payment Screenshot *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <select
          className="w-full border p-3 mb-3 rounded"
          value={idProofType}
          onChange={(e) => setIdProofType(e.target.value)}
        >
          <option value="">Select ID Proof</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Driving License">Driving License</option>
          <option value="Passport">Passport</option>
        </select>

        <label className="block text-sm font-semibold mb-1">
          Upload ID Proof *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIdFile(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <label className="flex items-center gap-2 mb-3 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I accept the{" "}
          <a
            href="/terms"
            target="_blank"
            className="underline font-semibold"
          >
            Terms & Conditions
          </a>
        </label>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded text-white font-semibold"
          style={{ backgroundColor: MOCHA }}
        >
          {loading ? "Submitting..." : "Confirm Booking"}
        </button>
      </form>
    </main>
  );
}