"use client";

import { useState } from "react";

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
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function calculateNights(inDate: string, outDate: string) {
    const start = new Date(inDate);
    const end = new Date(outDate);
    return Math.max(
      1,
      Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !name ||
      !phone ||
      !guests ||
      !checkIn ||
      !checkOut ||
      !totalAmount ||
      !paymentMode ||
      !idProofType ||
      !idFile ||
      !accepted
    ) {
      setError("Missing required fields");
      return;
    }

    const nights = calculateNights(checkIn, checkOut);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("guests", guests);
    formData.append("occasion", occasion);
    formData.append("check_in", checkIn);
    formData.append("check_out", checkOut);
    formData.append("nights", String(nights));
    formData.append("total_amount", totalAmount);
    formData.append("amount_paid", amountPaid || "0");
    formData.append("payment_mode", paymentMode);
    formData.append("id_proof_type", idProofType);
    formData.append("id_file", idFile);

    try {
      setLoading(true);

      const res = await fetch("/api/confirm-booking", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] flex justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-xl shadow p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Confirm Booking
        </h1>

        <input className="input" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Phone *" value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="input" placeholder="Guests *" value={guests} onChange={e => setGuests(e.target.value)} />

        <select className="input" value={occasion} onChange={e => setOccasion(e.target.value)}>
          <option value="Stay">Stay</option>
          <option value="Other">Other</option>
        </select>

        <label className="label">Check-in *</label>
        <input type="date" className="input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />

        <label className="label">Check-out *</label>
        <input type="date" className="input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />

        <input className="input" placeholder="Total Amount *" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
        <input className="input" placeholder="Amount Paid" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />

        <select className="input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
          <option value="">Payment Mode *</option>
          <option value="Cash">Cash</option>
          <option value="UPI / Online">UPI / Online</option>
        </select>

        <select className="input" value={idProofType} onChange={e => setIdProofType(e.target.value)}>
          <option value="">ID Proof *</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="Driving License">Driving License</option>
        </select>

        <label className="label">Upload ID Proof *</label>
        <input type="file" onChange={e => setIdFile(e.target.files?.[0] || null)} />

        <label className="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
          <span>
            I accept the{" "}
            <a href="/terms" className="underline font-semibold">
              Terms & Conditions
            </a>
          </span>
        </label>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">Booking submitted successfully!</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded text-white font-semibold"
          style={{ backgroundColor: MOCHA }}
        >
          {loading ? "Submitting..." : "Confirm Booking"}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          display: block;
        }
      `}</style>
    </main>
  );
}