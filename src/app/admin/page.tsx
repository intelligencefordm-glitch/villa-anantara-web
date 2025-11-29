'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [pw,setPw] = useState('');
  const [authed,setAuthed] = useState(false);

  function login(e:any) {
    e.preventDefault();
    // client-side gate only; real protection on server via API route
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert('Wrong password');
    }
  }

  if (!authed) {
    return (
      <div className="container">
        <h2>Admin — Login</h2>
        <form onSubmit={login}>
          <input placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} />
          <button>Enter</button>
        </form>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Admin Panel (Stub)</h2>
      <p>Use server admin APIs to manage bookings. This is a UI placeholder.</p>
    </div>
  )
}
