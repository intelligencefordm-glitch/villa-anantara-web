'use client';
import { useState } from 'react';
import axios from 'axios';

export default function BookingPage() {
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [start,setStart]=useState('');
  const [end,setEnd]=useState('');
  const [message,setMessage]=useState('');
  const [status,setStatus]=useState('');

  async function submit(e:any) {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await axios.post('/api/book', { name, phone, startDate: start, endDate: end, message, totalAmount: 0, depositAmount: 0, depositPaid: false });
      setStatus('Request submitted. We will confirm you manually.');
    } catch(err) {
      setStatus('Error submitting booking');
    }
  }

  return (
    <div className="container">
      <h2>Book Villa Anantara</h2>
      <p>Bookings open from 15 Jan 2026. Dates before that are unavailable.</p>
      <form onSubmit={submit}>
        <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/></div>
        <div><input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} required/></div>
        <div><label>Start</label><input type="date" value={start} onChange={e=>setStart(e.target.value)} required/></div>
        <div><label>End</label><input type="date" value={end} onChange={e=>setEnd(e.target.value)} required/></div>
        <div><textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} /></div>
        <div><button type="submit">Request Booking (Pay Later)</button></div>
      </form>
      <p>{status}</p>
    </div>
  )
}
