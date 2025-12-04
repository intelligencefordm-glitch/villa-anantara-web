// app/api/blocked/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }
    // Use service role key on the server to read the table reliably
    const supabase = createClient(url, serviceRole || "");

    const { data, error } = await supabase
      .from("blocked_dates")
      .select("date")
      .order("date", { ascending: true });

    if (error) {
      console.error("supabase blocked_dates error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // normalize to ISO date strings (YYYY-MM-DD)
    const blocked = (data || []).map((r: any) => {
      const d = r.date;
      if (!d) return null;
      const iso = typeof d === "string" ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10);
      return iso;
    }).filter(Boolean);

    return NextResponse.json({ blocked });
  } catch (err: any) {
    console.error("blocked route crashed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
