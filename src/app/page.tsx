import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <header className="container">
        <h1>Villa Anantara</h1>
        <p>Raipur, Chhattisgarh</p>
      </header>

      <section className="container hero">
        <div style={{flex:1}}>
          <h2>Luxury farmhouse in Raipur</h2>
          <p>Bookings open from 15 January 2026.</p>
          <Link href="/booking"><button>Check Availability / Book</button></Link>
        </div>
        <div style={{width:420}}>
          <img src="/hero.jpg" alt="Villa Anantara" style={{width:'100%', borderRadius:8}} />
        </div>
      </section>

      <section className="container">
        <h3>Gallery</h3>
        <div style={{display:'flex', gap:10}}>
          <img src="/gallery1.jpg" style={{width:180, height:120, objectFit:'cover', borderRadius:6}}/>
          <img src="/gallery2.jpg" style={{width:180, height:120, objectFit:'cover', borderRadius:6}}/>
          <img src="/gallery3.jpg" style={{width:180, height:120, objectFit:'cover', borderRadius:6}}/>
        </div>
      </section>

    </main>
  )
}
