import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const pass = req.headers.get("x-admin-password") || "";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!pass || pass !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const dates: string[] = body.dates;

    if (!Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json({ error: "No dates provided" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Insert dates one-by-one (avoid constraints issues)
    for (const date of dates) {
      await supabase
        .from("blocked_dates")
        .upsert({ date }, { onConflict: "date" });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("BLOCK ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
