"use client";
import React from "react";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      
      <h1 className="text-4xl font-bold text-[#0F1F0F] mb-6">
        Refund & Cancellation Policy
      </h1>

      <div className="space-y-8 text-[#333] leading-relaxed font-poppins">

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            1. Cancellation Rules
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              If cancelled <strong>15 days or more</strong> before check-in, the 
              <strong> full advance amount is refundable</strong>.
            </li>
            <li>
              If cancelled <strong>within 15 days</strong> of check-in, the advance becomes 
              <strong> non-refundable</strong>.
            </li>
            <li>No refunds for NO-SHOW, early departure, reduced stay, or date changes within 15 days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            2. Refund of Security Deposit
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>A security deposit of <strong>₹20,000</strong> is collected before check-in.</li>
            <li>Refunded after check-out following property inspection.</li>
            <li>Deductions apply for damage, missing items, or misconduct.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            3. Non-Refundable Situations
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Cancellation within 15 days of stay</li>
            <li>No-show</li>
            <li>Early check-out</li>
            <li>Reducing stay duration after booking</li>
            <li>Termination due to misconduct or rule violations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            4. Payment Refund Method
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Refunds processed via the same payment mode used for booking.</li>
            <li>Refunds may take 5–7 business days depending on the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            5. Rescheduling Policy
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Date changes requested 15+ days before check-in are allowed subject to availability.</li>
            <li>Date changes within 15 days are treated as cancellations.</li>
          </ul>
        </section>

      </div>
    </main>
  );
}
