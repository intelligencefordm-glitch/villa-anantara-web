import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      guests,
      check_in,
      check_out,
      nights,
      message = null,
    } = body;

    if (!name || !phone || !check_in || !check_out) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("inquiries").insert([{
      name,
      phone,
      email,
      guests: guests ?? null,
      check_in,
      check_out,
      nights: nights ?? null,
      message,
    }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
