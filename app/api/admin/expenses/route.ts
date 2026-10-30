import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Server database configuration is missing.");
  }
  return createClient(url, key);
}
function authorized(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  return Boolean(
    process.env.ADMIN_PASSWORD &&
    password &&
    password === process.env.ADMIN_PASSWORD
  );
}
// GET: Retrieve all expenses
export async function GET(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json(
        { error: "Could not retrieve expenses.", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ expenses: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
// POST: Add a new expense
export async function POST(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const expenseName = String(body.expense_name || "").trim();
    const category = String(body.category || "").trim();
    const amount = Number(body.amount);
    const paymentMode = body.payment_mode;
    const expenseDate = body.expense_date;
    const description = String(body.description || "").trim();
    if (!expenseName || !category) {
      return NextResponse.json(
        { error: "Expense name and category are required." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid expense amount greater than zero." },
        { status: 400 }
      );
    }
    if (!["Online", "Cash"].includes(paymentMode)) {
      return NextResponse.json(
        { error: "Payment mode must be Online or Cash." },
        { status: 400 }
      );
    }
    if (
      expenseDate &&
      (typeof expenseDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(expenseDate) ||
        !Number.isFinite(Date.parse(`${expenseDate}T00:00:00Z`)) ||
        new Date(`${expenseDate}T00:00:00Z`).toISOString().slice(0, 10) !== expenseDate)
    ) {
      return NextResponse.json(
        { error: "Enter a valid expense date." },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        expense_name: expenseName,
        category,
        amount,
        payment_mode: paymentMode,
        expense_date: expenseDate || new Date().toISOString().slice(0, 10),
        description: description || null,
      })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json(
        { error: "Could not save expense.", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: true, expense: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
