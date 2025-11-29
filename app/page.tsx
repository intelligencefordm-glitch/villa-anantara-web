import React from 'react';

export default function Home() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+918889777288';
  const mapUrl = process.env.NEXT_PUBLIC_MAP_URL ?? 'https://maps.app.goo.gl/dNiPHToeJaQQFf3e9';

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative h-[60vh] md:h-[70vh] bg-black/70">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
          alt="Villa Anantara"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col justify-center h-full">
          <div className="max-w-3xl bg-black/40 p-8 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Villa Anantara</h1>
            <p className="mt-3 text-lg md:text-xl text-gray-200">Your private getaway in Raipur — <span className="font-medium">tagline placeholder</span></p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <a
                href={`https://wa.me/${whatsapp.replace('+','')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-gold-600 hover:bg-gold-500 text-black font-semibold px-4 py-3 rounded-lg shadow"
                style={{ backgroundColor: '#f2c94c' }}
              >
                Book via WhatsApp
              </a>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/5"
              >
                View on map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">About Villa Anantara</h2>
          <p className="mt-3 text-gray-700">A luxury farmhouse stay near Raipur offering a private pool, lush garden, indoor games and a full kitchen — perfect for birthdays, small weddings, family getaways and weekend stays. Bookings open from <strong>15 January 2026</strong>.</p>
        </div>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Capacity</h3>
            <p className="text-sm text-gray-600">Up to 12 guests • 3 bedrooms</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Deposit</h3>
            <p className="text-sm text-gray-600">20% advance (rest in cash on arrival)</p>
          </div>
        </div>
      </section>

      {/* GALLERY: desktop grid, mobile masonry */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">Gallery</h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          <img src="https://images.unsplash.com/photo-1505691723518-36a9a0a2f6b3?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-64 object-cover rounded-lg" />
          <img src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-64 object-cover rounded-lg" />
          <div className="grid grid-cols-1 gap-4">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-32 object-cover rounded-lg" />
            <img src="https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=60" alt="" className="w-full h-32 object-cover rounded-lg" />
          </div>
        </div>

        {/* Mobile masonry */}
        <div className="md:hidden columns-2 gap-3 space-y-3">
          <img src="https://images.unsplash.com/photo-1505691723518-36a9a0a2f6b3?auto=format&fit=crop&w=800&q=60" alt="" className="mb-3 w-full rounded-lg break-inside" />
          <img src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=800&q=60" alt="" className="mb-3 w-full rounded-lg break-inside" />
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60" alt="" className="mb-3 w-full rounded-lg break-inside" />
          <img src="https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=60" alt="" className="mb-3 w-full rounded-lg break-inside" />
        </div>
      </section>

      {/* AMENITIES */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t">
        <h2 className="text-2xl font-semibold">Amenities</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Private pool',
            'Garden & BBQ',
            'Indoor games',
            'Music system',
          ].map((a) => (
            <div key={a} className="p-4 border rounded-lg">
              <h4 className="font-medium">{a}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h3 className="text-lg font-semibold">Villa Anantara</h3>
            <p className="mt-2 text-sm text-gray-300">Private farmhouse stay near Raipur • Bookings open from Jan 15, 2026</p>
          </div>
          <div className="space-y-2">
            <a href={`https://wa.me/${whatsapp.replace('+','')}`} target="_blank" rel="noreferrer" className="inline-block bg-white text-black px-4 py-2 rounded">Book on WhatsApp</a>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="block text-sm text-gray-300">View on map</a>
          </div>
        </div>
        <div className="text-center py-4 text-xs text-gray-400">© {new Date().getFullYear()} Villa Anantara</div>
      </footer>
    </main>
  );
}
