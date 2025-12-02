"use client";
import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-[#0F1F0F] mb-6">Terms & Conditions</h1>

      <div className="space-y-8 text-[#333] leading-relaxed font-poppins">

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">1. Booking & Payment Policy</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>The villa can accommodate up to 15 guests.</li>
            <li>20% advance payment is required to confirm the booking.</li>
            <li>The remaining amount must be paid in full before check-in.</li>
            <li>Cash, UPI, bank transfer, and digital payment modes are accepted.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">2. Security Deposit</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Refundable security deposit of ₹20,000 is required before check-in.</li>
            <li>Refunded at check-out after property inspection.</li>
            <li>Deductions apply for damage, missing items, or misconduct.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">3. Cancellation Policy</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>If cancelled 15+ days before check-in, full refund of advance.</li>
            <li>If cancelled within 15 days, advance is non-refundable.</li>
            <li>No refund for no-show, early departure, or reduced stay duration.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">4. Check-In & Check-Out</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Check-in: 11:00 AM</li>
            <li>Check-out: 9:00 AM</li>
            <li>Early check-in or late check-out may incur additional cost.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">5. Guest Rules & House Policies</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Maximum 15 guests allowed. Extra guests will be charged.</li>
            <li>Extra beds available at additional cost.</li>
            <li>Pets are allowed.</li>
            <li>Kitchen can be used responsibly.</li>
            <li>Any property damage must be compensated.</li>
            <li>Government ID required for all adult guests.</li>
            <li>Excessively dirty villa will result in cleaning charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">6. Pool Rules</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Pool usage is at guest’s own risk.</li>
            <li>Children must always be supervised.</li>
            <li>No diving, running, or rough play.</li>
            <li>Guests must shower before entering the pool.</li>
            <li>Food is not allowed inside the pool.</li>
            <li>Damage to pool equipment will be charged.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">7. Safety & Liability</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Guests are responsible for belongings.</li>
            <li>Not liable for injury or loss due to negligence.</li>
            <li>Illegal or disruptive behavior is not allowed.</li>
            <li>CCTV cameras operate only in outdoor areas for security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">8. Food & Breakfast Policy</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Breakfast cook included.</li>
            <li>Groceries must be provided by the guest.</li>
            <li>Additional meals from menu are chargeable.</li>
            <li>Kitchen use allowed responsibly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">9. Additional Charges</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Extra beds</li>
            <li>Guests above 15 persons</li>
            <li>Early/late check-in</li>
            <li>Special requests</li>
            <li>Excessive cleaning</li>
          </ul>
        </section>

      </div>
    </main>
  );
}
