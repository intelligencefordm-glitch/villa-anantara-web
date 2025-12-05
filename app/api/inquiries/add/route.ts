// app/api/inquiries/add/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      guests,
      occasion,
      check_in,
      check_out,
      nights,
    } = body || {};

    if (!name || !phone || !check_in || !check_out) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name,
          phone,
          email,
          guests,
          occasion,
          check_in,
          check_out,
          nights,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("inquiries/add error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiry: data }, { status: 200 });
  } catch (err) {
    console.error("inquiries/add fatal:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
