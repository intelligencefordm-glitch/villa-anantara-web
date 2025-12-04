import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

export async function POST(req: Request) {
  try {
    const { id, payment_status } = await req.json();
    if (!id || !payment_status) {
      return NextResponse.json({ error: "Missing id or payment_status" }, { status: 400 });
    }

    const { error } = await supabase
      .from("inquiries")
      .update({ payment_status })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
