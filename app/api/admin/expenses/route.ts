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
function validDate(date: unknown) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}
function validateExpense(body: any) {
  const expenseName = String(body.expense_name || "").trim();
  const category = String(body.category || "").trim();
  const amount = Number(body.amount);
  const paymentMode = body.payment_mode;
  if (!expenseName || !category) {
    return "Expense name and category are required.";
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Enter a valid expense amount greater than zero.";
  }
  if (!["Online", "Cash"].includes(paymentMode)) {
    return "Payment mode must be Online or Cash.";
  }
  if (!validDate(body.expense_date)) {
    return "Enter a valid expense date.";
  }
  return null;
}
// GET: Retrieve expenses
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
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ expenses: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error.",
      },
      { status: 500 }
    );
  }
}
// POST: Add expense
export async function POST(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const validationError = validateExpense(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        expense_name: String(body.expense_name).trim(),
        category: String(body.category).trim(),
        amount: Number(body.amount),
        payment_mode: body.payment_mode,
        expense_date: body.expense_date,
        description: String(body.description || "").trim() || null,
      })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json(
        { error: error.message },
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
        error: error instanceof Error ? error.message : "Unexpected error.",
      },
      { status: 500 }
    );
  }
}
// PATCH: Edit expense
export async function PATCH(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "A valid expense ID is required." },
        { status: 400 }
      );
    }
    const validationError = validateExpense(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("expenses")
      .update({
        expense_name: String(body.expense_name).trim(),
        category: String(body.category).trim(),
        amount: Number(body.amount),
        payment_mode: body.payment_mode,
        expense_date: body.expense_date,
        description: String(body.description || "").trim() || null,
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, expense: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error.",
      },
      { status: 500 }
    );
  }
}
// DELETE: Delete expense
export async function DELETE(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "A valid expense ID is required." },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    if (!data) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error.",
      },
      { status: 500 }
    );
  }
}
