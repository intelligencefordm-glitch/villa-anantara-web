export default function RoomsPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918889777288";

  return (
    <main className="bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center">
        <img
          src="/images/rooms-hero.jpg"
          alt="Rooms at Villa Anantara"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative z-10 text-4xl font-semibold text-white drop-shadow-lg">
          Our Rooms
        </h1>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-primary">Stay in Comfort</h2>
        <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">
          Villa Anantara offers 3 spacious, thoughtfully designed bedrooms—
          ideal for families, couples, and group getaways. Every room provides
          comfort, privacy, and a serene ambiance with modern amenities.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {/* ROOMS LIST */}
          {[
            {
              title: "Master Bedroom",
              img: "/images/room1.jpg",
              features: ["King Bed", "Pool View", "Attached Washroom"],
            },
            {
              title: "Garden Bedroom",
              img: "/images/room2.jpg",
              features: ["Queen Bed", "Garden View", "Private Sit-Out"],
            },
            {
              title: "Family Bedroom",
              img: "/images/room3.jpg",
              features: ["2 Double Beds", "Great for Families", "Spacious Layout"],
            },
          ].map((room, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={room.img}
                alt={room.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold text-primary">
                  {room.title}
                </h3>

                <ul className="mt-3 text-gray-600 text-sm space-y-1">
                  {room.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${whatsapp.replace("+", "")}`}
                  target="_blank"
                  className="inline-block mt-5 w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-[#152b15] transition"
                >
                  Book this room
                </a>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* FACILITIES */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t">
        <h2 className="text-3xl font-semibold text-primary">Room Facilities</h2>

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            "Air Conditioning",
            "Clean Washrooms",
            "Hot Water",
            "Fresh Towels",
            "High-speed WiFi",
            "Charging Points",
            "Wardrobe",
            "Private Sit-Out",
          ].map((item) => (
            <div
              key={item}
              className="p-4 border rounded-lg text-gray-700 shadow-sm hover:shadow-md transition text-center"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-16 px-6">
        <h3 className="text-2xl font-semibold text-primary">
          Ready to Book Your Stay?
        </h3>
        <p className="mt-2 text-gray-600">
          Contact us on WhatsApp for room availability and pricing.
        </p>

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
