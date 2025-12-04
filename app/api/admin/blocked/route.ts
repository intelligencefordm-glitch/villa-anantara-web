// app/api/admin/blocked/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    // read password from header
    const pass = req.headers.get("x-admin-password") || "";
    // server env: prefer ADMIN_PASSWORD (server-only) but fall back to NEXT_PUBLIC_ADMIN_PASSWORD if you used that earlier
    const adminPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!pass || pass !== adminPass) {
      // unauthorized
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // create server-side supabase client with service-role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // fetch blocked dates
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("supabase blocked_dates error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blocked: data || [] });
  } catch (err: any) {
    console.error("blocked route error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
