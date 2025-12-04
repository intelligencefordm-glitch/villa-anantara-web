import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { date } = await req.json();
    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert unless exists
    const { error } = await supabase
      .from("blocked_dates")
      .insert([{ date }], { returning: "minimal" });

    if (error) {
      // If unique constraint fails, still treat as success
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}
