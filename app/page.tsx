{/* =========================
    HERO VIDEO + CENTERED TITLE
   ========================= */}
<header className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-black">

  {/* HERO VIDEO */}
  <video
    src="/videos/hero.mp4"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/30" />

  {/* CENTERED TITLE */}
  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
    <h1 className="text-white text-5xl md:text-7xl font-semibold leading-none">

      {/* "V" - Futura */}
      <span
        className="font-futura font-[500]"
        style={{
          letterSpacing: "-0.03em",
          marginRight: "-0.045em", // reduced space before "illa"
        }}
      >
        V
      </span>

      {/* "illa" - Poppins */}
      <span
        className="font-poppins"
        style={{
          marginLeft: "-0.035em", // reduced gap after V
        }}
      >
        illa
      </span>

      {/* small space between words */}
      <span style={{ margin: "0 0.12em" }} />

      {/* "A" - Futura */}
      <span
        className="font-futura font-[500]"
        style={{
          letterSpacing: "-0.03em",
          marginRight: "-0.045em", // reduced space before "nantara"
        }}
      >
        A
      </span>

      {/* "nantara" - Poppins */}
      <span
        className="font-poppins"
        style={{
          marginLeft: "-0.035em", // reduced gap after A
        }}
      >
        nantara
      </span>

    </h1>
  </div>

</header>
