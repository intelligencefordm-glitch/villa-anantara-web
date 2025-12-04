import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // MUST be service role inside server
    );

    // Fetch all inquiries
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ inquiries: [] });
    }

    // If data is null → return empty array
    return NextResponse.json({ inquiries: data ?? [] });
  } catch (err) {
    console.error("API crash:", err);
    return NextResponse.json({ inquiries: [] });
  }
}
