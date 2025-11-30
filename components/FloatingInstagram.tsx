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
        fill="white"
        viewBox="0 0 24 24"
        width="28"
        height="28"
      >
        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3a3.004 3.004 0 01-3-3c0-1.654 1.346-3 3-3zm4.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/>
      </svg>
    </a>
  );
}
