import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("blocked_dates")
      .select("date")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ blocked: [] });
    }

    return NextResponse.json({ blocked: data ?? [] });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ blocked: [] });
  }
}
