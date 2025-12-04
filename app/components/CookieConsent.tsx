"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-3"
      style={{ backgroundColor: "#C29F80", color: "white", width: "90%", maxWidth: "500px" }}
    >
      <p className="text-center md:text-left">
        We use cookies to improve your experience at Villa Anantara.
      </p>

      <button
        onClick={acceptCookies}
        className="px-4 py-2 rounded font-semibold"
        style={{ backgroundColor: "#0F1F0F", color: "white" }}
      >
        Okay
      </button>
    </div>
  );
}
