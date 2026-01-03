"use client";

import React, { useState } from "react";

const MOCHA = "#C29F80";
const BG = "#EFE5D5";
const DARK = "#0F1F0F";

export default function ConfirmBookingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "",
    check_in: "",
    check_out: "",
    advance_amount: "",
    payment_mode: "online",
    id_proof_type: "Aadhaar",
  });

  const [idProof, setIdProof] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);

  // ---------------------------
  // SUBMIT HANDLER
  // ---------------------------
  const handleSubmit = async () => {
    setMessage(null);

    if (!agree) {
      setMessage("Please accept Terms & Conditions");
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.guests ||
      !form.check_in ||
      !form.check_out
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    if (!idProof) {
      setMessage("Please upload an ID proof");
      return;
    }

    if (form.payment_mode === "online" && !paymentProof) {
      setMessage("Please upload payment screenshot");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append("id_proof", idProof);
      if (paymentProof) data.append("payment_proof", paymentProof);

      const res = await fetch("/api/confirmed/add", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setMessage("✅ Booking confirmed successfully!");
      setForm({
        name: "",
        phone: "",
        email: "",
        guests: "",
        check_in: "",
        check_out: "",
        advance_amount: "",
        payment_mode: "online",
        id_proof_type: "Aadhaar",
      });
      setIdProof(null);
      setPaymentProof(null);
      setAgree(false);
    } catch (err) {
      setMessage("❌ Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: BG }}>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: DARK }}
        >
          Confirm Your Booking
        </h1>

        {/* INPUTS */}
        {[
          ["name", "Full Name *"],
          ["phone", "Phone *"],
          ["email", "Email"],
          ["guests", "Number of Guests *"],
          ["advance_amount", "Advance Amount Paid *"],
        ].map(([key, label]) => (
          <input
            key={key}
            placeholder={label}
            className="w-full p-3 mb-3 border rounded"
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <label className="text-sm">Check-in *</label>
        <input
          type="date"
          className="w-full p-3 mb-3 border rounded"
          value={form.check_in}
          onChange={(e) =>
            setForm({ ...form, check_in: e.target.value })
          }
        />

        <label className="text-sm">Check-out *</label>
        <input
          type="date"
          className="w-full p-3 mb-4 border rounded"
          value={form.check_out}
          onChange={(e) =>
            setForm({ ...form, check_out: e.target.value })
          }
        />

        {/* ID PROOF */}
        <label className="text-sm font-semibold">ID Proof *</label>
        <select
          className="w-full p-3 mb-2 border rounded"
          value={form.id_proof_type}
          onChange={(e) =>
            setForm({ ...form, id_proof_type: e.target.value })
          }
        >
          <option>Aadhaar</option>
          <option>Driving Licence</option>
          <option>Passport</option>
          <option>Voter ID</option>
        </select>

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setIdProof(e.target.files?.[0] || null)}
        />

        {/* PAYMENT MODE */}
        <label className="text-sm font-semibold">Payment Mode *</label>
        <select
          className="w-full p-3 mb-3 border rounded"
          value={form.payment_mode}
          onChange={(e) =>
            setForm({ ...form, payment_mode: e.target.value })
          }
        >
          <option value="online">UPI / Online</option>
          <option value="cash">Cash</option>
        </select>

        {/* PAYMENT PROOF (ONLY IF ONLINE) */}
        {form.payment_mode === "online" && (
          <>
            <label className="text-sm">Upload Payment Screenshot *</label>
            <input
              type="file"
              className="w-full mb-4"
              onChange={(e) =>
                setPaymentProof(e.target.files?.[0] || null)
              }
            />
          </>
        )}

        {/* TERMS */}
        <div className="flex items-start gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <span>
            I accept the{" "}
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
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 rounded text-white font-semibold"
          style={{ background: MOCHA }}
        >
          {loading ? "Submitting..." : "Confirm Booking"}
        </button>

        {message && (
          <p className="mt-4 text-center font-medium">{message}</p>
        )}
      </div>
    </main>
  );
}