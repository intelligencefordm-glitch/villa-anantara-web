"use client";

export default function FloatingWhatsApp() {
  // Your WhatsApp number (uses .env if available, otherwise fallback)
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";

  // Pre-filled message
  const message = encodeURIComponent(
    "Hi, I’m interested in Villa Anantara. I would like to know more about it"
  );

  return (
    <a
      href={`https://wa.me/${whatsapp.replace("+", "")}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="
        fixed bottom-6 right-6 z-50 
        flex items-center justify-center 
        w-14 h-14 rounded-full 
        shadow-xl 
        bg-[#25D366] 
        hover:bg-[#1ebe5d] 
        transition
      "
    >
      {/* WhatsApp Icon */}
      <svg
        fill="white"
        viewBox="0 0 32 32"
        width="28"
        height="28"
      >
        <path d="M16.067 3C9.413 3 4 8.412 4 15.067c0 2.658.878 5.11 2.356 7.084L4 29l6.993-2.317a11.94 11.94 0 0 0 5.074 1.133h.001c6.654 0 12.067-5.412 12.067-12.066C28.135 8.412 22.721 3 16.067 3zm0 21.734c-1.73 0-3.42-.457-4.902-1.322l-.351-.207-4.154 1.376 1.383-4.055-.228-.365a10.37 10.37 0 0 1-1.657-5.094c0-5.709 4.648-10.357 10.356-10.357 5.709 0 10.357 4.648 10.357 10.357 0 5.708-4.648 10.357-10.357 10.357zm5.74-7.729c-.313-.157-1.85-.913-2.136-1.018-.286-.105-.495-.157-.703.157-.208.314-.806 1.018-.988 1.226-.182.209-.365.236-.678.079-.314-.157-1.325-.489-2.522-1.559-.931-.83-1.56-1.855-1.742-2.169-.183-.314-.02-.483.137-.64.141-.14.314-.365.471-.548.157-.183.209-.314.314-.523.105-.209.052-.392-.026-.549-.078-.157-.703-1.7-.963-2.327-.254-.61-.513-.528-.703-.536a9.68 9.68 0 0 0-.6-.01c-.209 0-.549.078-.836.392-.286.314-1.1 1.074-1.1 2.617 0 1.542 1.126 3.033 1.283 3.242.157.209 2.215 3.381 5.367 4.742.75.323 1.335.516 1.79.661.75.238 1.434.204 1.974.124.602-.089 1.85-.757 2.113-1.488.261-.73.261-1.356.183-1.489-.079-.131-.287-.209-.6-.365z" />
      </svg>
    </a>
  );
}
