"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
const BG = "#EFE5D5";
const MOCHA = "#C29F80";
type Expense = {
  id: number;
  expense_name: string;
  category: string;
  amount: number;
  payment_mode: "Online" | "Cash";
  expense_date: string;
  description?: string | null;
};
type Booking = {
  id: number;
  check_in: string;
  amount_paid: number;
  amount_due: number;
  online_amount?: number | null;
  cash_amount?: number | null;
  payment_mode?: string | null;
};
type ExpenseForm = {
  expense_name: string;
  category: string;
  amount: string;
  payment_mode: "Online" | "Cash";
  expense_date: string;
  description: string;
};
const emptyForm: ExpenseForm = {
  expense_name: "",
  category: "Maintenance",
  amount: "",
  payment_mode: "Cash",
  expense_date: new Date().toLocaleDateString("en-CA"),
  description: "",
};
const categories = [
  "Electricity",
  "Water",
  "Staff Salary",
  "Maintenance",
  "Cleaning",
  "Groceries",
  "Repairs",
  "Marketing",
  "Internet",
  "Supplies",
  "Other",
];
function number(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
function getBreakdown(booking: Booking) {
  let online = number(booking.online_amount);
  let cash = number(booking.cash_amount);
  // Compatibility with older bookings that have paid amounts
  // but no recorded payment breakdown.
  if (online + cash === 0 && number(booking.amount_paid) > 0) {
    if (booking.payment_mode === "Cash") {
      cash = number(booking.amount_paid);
    } else {
      online = number(booking.amount_paid);
    }
  }
  return { online, cash };
}
export default function ExpensesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpenseForm>(emptyForm);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  function login(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setError("Please enter your admin password.");
      return;
    }
    setPassword(passwordInput);
    setAuthed(true);
    setPasswordInput("");
    setError("");
  }
  function logout(message: string) {
    setAuthed(false);
    setPassword("");
    setExpenses([]);
    setBookings([]);
    setError(message);
  }
  async function loadDashboard() {
    if (!password) return;
    try {
      setLoading(true);
      setError("");
      const headers = {
        "x-admin-password": password,
      };
      const [expenseRes, bookingRes] = await Promise.all([
        fetch("/api/admin/expenses", {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        fetch("/api/admin/confirmed/list", {
          method: "GET",
          headers,
          cache: "no-store",
        }),
      ]);
      const expenseJson = await expenseRes.json();
      const bookingJson = await bookingRes.json();
      if (expenseRes.status === 401 || bookingRes.status === 401) {
        logout("Unauthorized. Please log in again.");
        return;
      }
      if (!expenseRes.ok) {
        throw new Error(
          expenseJson.error || "Could not load expenses."
        );
      }
      if (!bookingRes.ok) {
        throw new Error(
          bookingJson.error || "Could not load confirmed bookings."
        );
      }
      setExpenses(
        Array.isArray(expenseJson.expenses)
          ? expenseJson.expenses
          : []
      );
      setBookings(
        Array.isArray(bookingJson.bookings)
          ? bookingJson.bookings
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load financial data."
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (authed && password) {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password]);
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) => expense.expense_date?.slice(0, 7) === selectedMonth
      ),
    [expenses, selectedMonth]
  );
  const monthlyBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.check_in?.slice(0, 7) === selectedMonth
      ),
    [bookings, selectedMonth]
  );
  const totalIncome = monthlyBookings.reduce(
    (sum, booking) => sum + number(booking.amount_paid),
    0
  );
  const onlineIncome = monthlyBookings.reduce(
    (sum, booking) => sum + getBreakdown(booking).online,
    0
  );
  const cashIncome = monthlyBookings.reduce(
    (sum, booking) => sum + getBreakdown(booking).cash,
    0
  );
  const totalExpenses = monthlyExpenses.reduce(
    (sum, expense) => sum + number(expense.amount),
    0
  );
  const onlineExpenses = monthlyExpenses
    .filter((expense) => expense.payment_mode === "Online")
    .reduce((sum, expense) => sum + number(expense.amount), 0);
  const cashExpenses = monthlyExpenses
    .filter((expense) => expense.payment_mode === "Cash")
    .reduce((sum, expense) => sum + number(expense.amount), 0);
  const availableBalance = totalIncome - totalExpenses;
  function startAddExpense() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setNotice("");
  }
  function startEditExpense(expense: Expense) {
    setEditingId(expense.id);
    setForm({
      expense_name: expense.expense_name,
      category: expense.category,
      amount: String(expense.amount),
      payment_mode: expense.payment_mode,
      expense_date: expense.expense_date,
      description: expense.description || "",
    });
    setShowForm(true);
    setError("");
    setNotice("");
  }
  async function saveExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      logout("Please log in again.");
      return;
    }
    const amount = Number(form.amount);
    if (
      !form.expense_name.trim() ||
      !form.category ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !form.expense_date
    ) {
      setError("Please enter valid expense details.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const editing = editingId !== null;
      const res = await fetch("/api/admin/expenses", {
        method: editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          ...(editing ? { id: editingId } : {}),
          expense_name: form.expense_name.trim(),
          category: form.category,
          amount,
          payment_mode: form.payment_mode,
          expense_date: form.expense_date,
          description: form.description.trim(),
        }),
      });
      const json = await res.json();
      if (res.status === 401) {
        logout("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(json.error || "Could not save expense.");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setNotice(
        editing
          ? "Expense updated successfully."
          : "Expense added successfully."
      );
      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save expense."
      );
    } finally {
      setSaving(false);
    }
  }
  async function deleteExpense(id: number) {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (res.status === 401) {
        logout("Unauthorized. Please log in again.");
        return;
      }
      if (!res.ok) {
        throw new Error(json.error || "Could not delete expense.");
      }
      setNotice("Expense deleted successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete expense."
      );
    }
  }
  if (!authed) {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: BG }}
      >
        <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-5">
            Villa Anant
          </h1>
          <h2 className="text-lg font-semibold text-center mb-4">
            Expenses Admin Login
          </h2>
          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border p-3 rounded"
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }
  return (
    <main
      className="min-h-screen p-4 md:p-6"
      style={{ background: BG }}
    >
      <header
        className="mb-6 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{ background: MOCHA, color: "white" }}
      >
        <div>
          <h1 className="text-2xl font-bold">
            Villa Anant — Expenses
          </h1>
          <p className="text-sm opacity-90">
            Income and expense management
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/confirmed"
            className="bg-white text-black px-4 py-2 rounded font-semibold"
          >
            Confirmed Bookings
          </Link>
          <button
            onClick={loadDashboard}
            disabled={loading}
            className="bg-white/20 border border-white/60 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => logout("You have logged out.")}
            className="bg-black/20 border border-white/50 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 whitespace-pre-wrap">
          {error}
        </div>
      )}
      {notice && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {notice}
        </div>
      )}
      <section className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div>
            <h2 className="text-xl font-bold">Financial Overview</h2>
            <p className="text-sm text-gray-600">
              Based on actual payments received from confirmed bookings.
            </p>
          </div>
          <label className="text-sm font-medium">
            Select Month
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block mt-1 border p-2 rounded"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-800">
              {money(totalIncome)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Actual payments received
            </p>
          </div>
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Online Income</p>
            <p className="text-2xl font-bold">
              {money(onlineIncome)}
            </p>
          </div>
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Cash Income</p>
            <p className="text-2xl font-bold">
              {money(cashIncome)}
            </p>
          </div>
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-700">
              {money(totalExpenses)}
            </p>
          </div>
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p
              className={`text-2xl font-bold ${
                availableBalance < 0 ? "text-red-700" : "text-green-800"
              }`}
            >
              {money(availableBalance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Income minus expenses
            </p>
          </div>
          <div className="rounded-lg p-4 bg-[#EFE5D5]">
            <p className="text-sm text-gray-600">Expense Entries</p>
            <p className="text-2xl font-bold">
              {monthlyExpenses.length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-600">Online Expenses</p>
            <p className="font-bold">{money(onlineExpenses)}</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-600">Cash Expenses</p>
            <p className="font-bold">{money(cashExpenses)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Income is calculated using bookings whose check-in date falls
          within the selected month. Expenses are grouped by expense date.
        </p>
      </section>
      <section className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Expense Management</h2>
            <p className="text-sm text-gray-600">
              Record and manage Villa Anant expenses.
            </p>
          </div>
          <button
            onClick={startAddExpense}
            className="bg-black text-white px-5 py-2 rounded font-semibold"
          >
            + Add Expense
          </button>
        </div>
        {showForm && (
          <form
            onSubmit={saveExpense}
            className="mt-5 p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <h3 className="font-bold md:col-span-2">
              {editingId ? "Edit Expense" : "New Expense"}
            </h3>
            <label className="text-sm font-medium">
              Expense Name *
              <input
                required
                value={form.expense_name}
                onChange={(e) =>
                  setForm({ ...form, expense_name: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="Electricity bill"
              />
            </label>
            <label className="text-sm font-medium">
              Category *
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Amount (₹) *
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="5000"
              />
            </label>
            <label className="text-sm font-medium">
              Payment Mode *
              <select
                value={form.payment_mode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_mode: e.target.value as "Online" | "Cash",
                  })
                }
                className="mt-1 w-full border p-2 rounded bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Expense Date *
              <input
                required
                type="date"
                value={form.expense_date}
                onChange={(e) =>
                  setForm({ ...form, expense_date: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>
            <label className="text-sm font-medium">
              Description / Notes
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
                placeholder="Optional details"
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-700 text-white px-5 py-2 rounded disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Expense"
                    : "Save Expense"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="border px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-4">Expense History</h2>
        {loading && (
          <p className="text-sm text-gray-600">Loading financial data...</p>
        )}
        {!loading && monthlyExpenses.length === 0 && (
          <p className="text-gray-600 text-sm">
            No expenses recorded for this month.
          </p>
        )}
        {monthlyExpenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Date</th>
                  <th className="p-3">Expense</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monthlyExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b">
                    <td className="p-3 whitespace-nowrap">
                      {new Date(
                        `${expense.expense_date}T00:00:00`
                      ).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3 font-medium">
                      {expense.expense_name}
                      {expense.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {expense.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3">{expense.category}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          expense.payment_mode === "Cash"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {expense.payment_mode}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-red-700 whitespace-nowrap">
                      {money(number(expense.amount))}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditExpense(expense)}
                          className="text-blue-700 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={4} className="p-3 text-right">
                    Monthly Expenses:
                  </td>
                  <td className="p-3 text-red-700">
                    {money(totalExpenses)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
      <footer className="text-center text-xs text-gray-500 mt-6">
        Villa Anant Financial Management
      </footer>
    </main>
  );
}
