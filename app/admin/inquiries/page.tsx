"use client";

import React, { useEffect, useState } from "react";

type Inquiry = {
  id: number | string;
  name?: string;
  phone?: string;
  email?: string | null;
  guests?: number;
  occasion?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  nights?: number;
  created_at?: string | null;
};

export default function AdminInquiriesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authed, setAuthed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  // Modal + toast
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch inquiries
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries/list");
      const json = await res.json();
      const arr = json.inquiries || [];
      setInquiries(arr);
      // clear selection
      setSelectedIds(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load inquiries.");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
      setPasswordInput("");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  // Toggle single selection
  const toggleSelect = (id: number | string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      // update selectAll state
      setSelectAll(next.size === inquiries.length && inquiries.length > 0);
      return next;
    });
  };

  // Select all / deselect all
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(new Set(inquiries.map((i) => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Open confirmation modal for bulk delete
  const handleDeleteClick = () => {
    if (selectedIds.size === 0) {
      setToast("No inquiries selected.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    setShowConfirm(true);
  };

  // Perform delete
  const confirmDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");
    try {
      const ids = Array.from(selectedIds);
      const res = await fetch("/api/inquiries/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("Delete error:", json);
        setError(json.error || "Failed to delete inquiries.");
        setToast(null);
      } else {
        // success message
        const count = json.deletedCount ?? ids.length;
        const msg = `Deleted ${count} inquiry${count > 1 ? "ies" : ""} successfully.`;
        setToast(msg);
        // reload list
        await load();
        setTimeout(() => setToast(null), 3500);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete inquiries.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: format date/time safely
  const formatDate = (s?: string | null) =>
    s ? new Date(s).toLocaleString() : "-";

  // UI
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EFE5D5] p-6">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#0F1F0F] text-white py-2 rounded font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE5D5] p-6">
      <header
        className="mb-6 p-4 rounded"
        style={{ backgroundColor: "#C29F80", color: "white" }}
      >
        <h1 className="text-2xl font-bold">All Inquiries</h1>
        <p className="opacity-90">Select multiple entries and delete in bulk.</p>
      </header>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-sm">Select All</span>
          </label>

          <button
            onClick={handleDeleteClick}
            className="bg-red-600 text-white px-3 py-2 rounded font-semibold"
            disabled={selectedIds.size === 0 || loading}
          >
            Delete Selected
          </button>

          <button
            onClick={load}
            className="px-3 py-2 rounded border bg-white"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        <div className="text-sm text-gray-700">
          {selectedIds.size} selected • {inquiries.length} total
        </div>
      </div>

      {loading && <p className="mb-4">Loading...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-[#C29F80] text-white">
            <tr>
              <th className="p-3 text-left"> </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Occasion</th>
              <th className="p-3 text-left">Check-in</th>
              <th className="p-3 text-left">Check-out</th>
              <th className="p-3 text-left">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.length === 0 && !loading && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-600">
                  No inquiries found.
                </td>
              </tr>
            )}

            {inquiries.map((i) => (
              <tr
                key={i.id}
                className="border-b hover:bg-gray-50 last:border-b-0"
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(i.id)}
                    onChange={() => toggleSelect(i.id)}
                  />
                </td>

                <td className="p-3">{i.name || "-"}</td>
                <td className="p-3">{i.phone || "-"}</td>
                <td className="p-3">{i.email || "-"}</td>
                <td className="p-3">{i.guests ?? "-"}</td>
                <td className="p-3">{i.occasion || "-"}</td>
                <td className="p-3">{i.check_in || "-"}</td>
                <td className="p-3">{i.check_out || "-"}</td>
                <td className="p-3">
                  {i.created_at ? new Date(i.created_at).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Confirm deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedIds.size}</strong> selected inquiry
              {selectedIds.size > 1 ? "ies" : "?"}?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 bg-[#0F1F0F] text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </main>
  );
}
