"use client";

import React, { useState } from "react";

const MOCHA = "#C29F80";
const BG = "#EFE5D5";
const DARK = "#0F1F0F";

export default function ConfirmBookingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // FORM FIELDS
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [occasion, setOccasion] = useState("Stay");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [idProofType, setIdProofType] = useState("Aadhaar");

  // FILES
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [paymentScreenshotFile, setPaymentScreenshotFile] =
    useState<File | null>(null);

  const [agree, setAgree] = useState(false);

  // ----------------------------------
  // SUBMIT HANDLER (FormData)
  // ----------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!agree) {
      setError("Please accept Terms & Conditions");
      return;
    }

    if (
      !name ||
      !phone ||
      !guests ||
      !checkIn ||
      !checkOut ||
      !totalAmount
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (!idProofFile) {
      setError("ID proof is required");
      return;
    }

    if (paymentMode === "online" && !paymentScreenshotFile) {
      setError("Payment screenshot is required for online payments");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // TEXT FIELDS
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

      // FILES
      formData.append("id_proof", idProofFile);
      if (paymentMode === "online" && paymentScreenshotFile) {
        formData.append("payment_screenshot", paymentScreenshotFile);
      }

      const res = await fetch("/api/confirm-booking", {
        method: "POST",
        body: formData, // ❗ NO headers
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSuccess(true);

      // RESET FORM
      setName("");
      setPhone("");
      setGuests("");
      setOccasion("Stay");
      setCheckIn("");
      setCheckOut("");
      setTotalAmount("");
      setAmountPaid("");
      setPaymentMode("online");
      setIdProofType("Aadhaar");
      setIdProofFile(null);
      setPaymentScreenshotFile(null);
      setAgree(false);
    } catch (err) {
      console.error(err);
      setError("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------
  return (
    <main className="min-h-screen px-6 py-10" style={{ background: BG }}>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: DARK }}
        >
          Confirm Your Booking
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full p-3 border rounded"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded"
            placeholder="Number of Guests *"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />

          <select
            className="w-full p-3 border rounded"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option value="Stay">Stay</option>
            <option value="Other">Other</option>
          </select>

          <label className="text-sm">Check-in *</label>
          <input
            type="date"
            className="w-full p-3 border rounded"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <label className="text-sm">Check-out *</label>
          <input
            type="date"
            className="w-full p-3 border rounded"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded"
            placeholder="Total Amount *"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded"
            placeholder="Advance Paid (if any)"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />

          <select
            className="w-full p-3 border rounded"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="online">UPI / Online</option>
            <option value="cash">Cash</option>
          </select>

          <select
            className="w-full p-3 border rounded"
            value={idProofType}
            onChange={(e) => setIdProofType(e.target.value)}
          >
            <option>Aadhaar</option>
            <option>Driving Licence</option>
            <option>Passport</option>
            <option>Voter ID</option>
          </select>

          <label className="text-sm">Upload ID Proof *</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setIdProofFile(e.target.files?.[0] || null)}
          />

          {paymentMode === "online" && (
            <>
              <label className="text-sm">
                Upload Payment Screenshot *
              </label>
              <input
                type="file"
                className="w-full"
                onChange={(e) =>
                  setPaymentScreenshotFile(e.target.files?.[0] || null)
                }
              />
            </>
          )}

          <div className="flex items-start gap-2 text-sm mt-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span>
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                className="underline font-semibold"
                style={{ color: DARK }}
              >
                Terms & Conditions
              </a>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 mt-4 rounded text-white font-semibold"
            style={{ background: MOCHA }}
          >
            {loading ? "Submitting..." : "Confirm Booking"}
          </button>

          {error && (
            <p className="text-red-600 text-center mt-3">{error}</p>
          )}

          {success && (
            <p className="text-green-700 text-center mt-3 font-semibold">
              Booking confirmed successfully!
            </p>
          )}
        </form>
      </div>
    </main>
  );
}