"use client";

import { useEffect, useState } from "react";

export default function AdminInquiries() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const login = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (json.success) {
      setAuthed(true);
      load();
    } else {
      alert("Wrong password");
    }
  };

  const load = async () => {
    const res = await fetch("/api/inquiries/list");
    const json = await res.json();
    setData(json);
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#EFE5D5]">
        <div className="p-8 rounded shadow-lg bg-white">
          <h1 className="font-bold text-xl mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-64"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={login}
            className="mt-4 px-4 py-2 bg-[#C29F80] text-white rounded w-full font-bold"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <h1 className="text-3xl font-bold mb-4">All Inquiries</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-[#C29F80] text-white">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Occasion</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
              <th className="p-3">Nights</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {data.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.phone}</td>
                <td className="p-3">{i.email || "-"}</td>
                <td className="p-3">{i.guests}</td>
                <td className="p-3">{i.occasion}</td>
                <td className="p-3">{i.check_in}</td>
                <td className="p-3">{i.check_out}</td>
                <td className="p-3">{i.nights}</td>
                <td className="p-3">{new Date(i.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
