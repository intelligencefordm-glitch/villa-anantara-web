"use client";

export default function FloatingInstagram() {
  const instagramUrl = "https://www.instagram.com/villa.anantara";

  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noreferrer"
      className="
        fixed bottom-24 right-6 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        shadow-xl
        bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500
        hover:opacity-90
        transition
      "
    >
      {/* Instagram Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="white"
        width="28"
        height="28"
      >
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-
