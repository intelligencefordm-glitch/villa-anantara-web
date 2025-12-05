import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("date");

    if (error) {
      console.error("BLOCKED GET error:", error);
      return NextResponse.json(
        { error: error.message, blocked: [] },
        { status: 500 }
      );
    }

    const blocked: string[] =
      (data || [])
        .map((row: any) => {
          if (!row.date) return null;
          // accept date or string
          const d = new Date(row.date);
          if (Number.isNaN(d.getTime())) return null;
          return d.toISOString().slice(0, 10); // "yyyy-MM-dd"
        })
        .filter(Boolean) as string[];

    return NextResponse.json({ blocked }, { status: 200 });
  } catch (err: any) {
    console.error("BLOCKED route fatal error:", err);
    return NextResponse.json(
      { error: "Failed to load blocked dates", blocked: [] },
      { status: 500 }
    );
  }
}
