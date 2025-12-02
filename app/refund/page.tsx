"use client";
import React from "react";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      
      <h1 className="text-4xl font-bold text-[#0F1F0F] mb-6">
        Refund & Cancellation Policy
      </h1>

      <div className="space-y-8 text-[#333] leading-relaxed font-poppins">

        {/* Section 1 */}
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
            <li>No refunds for:</li>
            <ul className="list-disc ml-10 space-y-2">
              <li>No-show</li>
              <li>Early departure</li>
              <li>Reduction in number of nights</li>
              <li>Date change request within 15 days of check-in</li>
            </ul>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            2. Refund of Security Deposit
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              A security deposit of <strong>₹20,000</strong> is collected before check-in.
            </li>
            <li>
              Refunded after check-out following property inspection.
            </li>
            <li>Deductions apply for:</li>
            <ul className="list-disc ml-10 space-y-2">
              <li>Damage to furniture, appliances, decor, or property</li>
              <li>Damage to pool tiles, lights, filters, or equipment</li>
              <li>Missing items</li>
              <li>Misconduct or violation of villa rules</li>
            </ul>
            <li>
              If damage exceeds the deposit amount, guests must pay the additional amount.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            3. Non-Refundable Situations
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Cancellation within 15 days of stay</li>
            <li>No-show</li>
            <li>Early check-out</li>
            <li>Reducing the stay duration after booking</li>
            <li>If stay is terminated due to misconduct or rule violations</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            4. Payment Refund Method
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Refunds are processed through the{" "}
              <strong>same mode of payment</strong> used during booking.
            </li>
            <li>
              Refunds may take <strong>5–7 business days</strong> depending on payment platform.
            </li>
            <li>
              Cash advances may be refunded in cash or UPI.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            5. Rescheduling Policy
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              Date changes requested <strong>15 days or more</strong> before check-in 
              are allowed, subject to availability.
            </li>
            <li>
              Date changes requested within 15 days are treated as a 
              <strong> cancellation</strong>.
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}
