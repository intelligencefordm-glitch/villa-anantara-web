export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";
  const mapUrl =
    process.env.NEXT_PUBLIC_MAP_URL ??
    "https://maps.app.goo.gl/dNiPHToeJaQQFf3e9";

  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center">
        <img
          src="/images/contact-hero.jpg"
          alt="Contact Villa Anantara"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-4xl font-semibold text-white drop-shadow-lg">
          Contact Us
        </h1>
      </section>

      {/* CONTACT INFO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-primary">We’re Here to Help</h2>
        <p className="mt-4 text-gray-700 max-w-2xl leading-relaxed">
          Whether you're planning a weekend getaway, a family stay, or a small celebration,
          our team at Villa Anantara is happy to assist you with bookings, pricing,
          availability, and special requests.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {/* Contact Cards */}
          <div className="p-5 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-primary">Phone & WhatsApp</h3>
            <p className="mt-2 text-gray-700">{whatsapp}</p>
            <a
              href={`https://wa.me/${whatsapp.replace("+", "")}`}
              target="_blank"
              className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#152b15] transition"
            >
              Message on WhatsApp
            </a>
          </div>

          <div className="p-5 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-primary">Location</h3>
            <p className="mt-2 text-gray-700">
              Villa Anantara  
              <br />
              Near Raipur, Chhattisgarh
            </p>
            <a
              href={mapUrl}
              target="_blank"
              className="inline-block mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              Open in Maps
            </a>
          </div>

          <div className="p-5 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-primary">Hours</h3>
            <p className="mt-2 text-gray-700">
              Front Desk: 9 AM – 8 PM  
              <br />
              Bookings: 24/7 on WhatsApp
            </p>
          </div>

        </div>
      </section>

      {/* MAP EMBED */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-semibold text-primary mb-6">Find Us</h2>

        <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center pb-20 px-6">
        <h3 className="text-2xl font-semibold text-primary">
          Ready to plan your stay?
        </h3>
        <p className="mt-2 text-gray-600">Message us anytime for availability.</p>

        <a
          href={`https://wa.me/${whatsapp.replace("+", "")}`}
          target="_blank"
          className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-lg shadow hover:bg-[#152b15] transition"
        >
          Book via WhatsApp
        </a>
      </section>
    </main>
  );
}
