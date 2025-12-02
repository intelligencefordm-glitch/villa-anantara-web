"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      
      <h1 className="text-4xl font-bold text-[#0F1F0F] mb-6">
        Privacy Center
      </h1>

      <div className="space-y-8 text-[#333] leading-relaxed font-poppins">

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information necessary for booking and maintaining
            guest security, including:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Name & contact details</li>
            <li>Government ID proof</li>
            <li>Payment details (we do NOT store sensitive banking data)</li>
            <li>Number of guests & stay details</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To confirm and manage reservations</li>
            <li>To verify guest identity at check-in</li>
            <li>To maintain safety and comply with legal requirements</li>
            <li>To communicate regarding your stay and services</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            3. CCTV Monitoring
          </h2>
          <p>
            CCTV cameras are installed in <strong>outdoor public areas</strong> for
            safety and security. Cameras are <strong>NOT placed inside private indoor spaces</strong>.
            By entering the property, guests consent to being recorded in monitored zones.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            4. Payment Security
          </h2>
          <p>
            Payments made through UPI, bank transfer, or digital modes are processed 
            securely. We do not store sensitive payment information such as card
            numbers or banking credentials.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            5. Sharing of Information
          </h2>
          <p>We do NOT sell or share your information with advertisers.</p>
          <p>Data may be shared only with:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Government authorities (as legally required)</li>
            <li>Law enforcement (if requested)</li>
            <li>Internal villa staff for operational purposes only</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            6. Your Rights
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>You may request correction of your personal details.</li>
            <li>You may request deletion of non-essential information.</li>
            <li>You may ask how your data is stored and used.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-[#0F1F0F] mb-3">
            7. Contact Us
          </h2>
          <p>
            For any privacy-related questions or concerns, please contact:
          </p>
          <p className="mt-2">
            📞 <strong>+91 8889777288</strong><br />
            📧 <strong>villaanantara@gmail.com</strong><br />
            📍 Villa Anantara, Raipur
          </p>
        </section>

      </div>
    </main>
  );
}
