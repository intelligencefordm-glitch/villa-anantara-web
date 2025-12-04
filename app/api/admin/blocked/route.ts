// app/api/admin/blocked/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const pass = req.headers.get("x-admin-password") || "";
    const adminPass = process.env.ADMIN_PASSWORD;

    // ------------------------------
    // 1) Admin password validation
    // ------------------------------
    if (!adminPass) {
      console.error("❌ ADMIN_PASSWORD is missing in environment");
      return NextResponse.json(
        { error: "Server misconfiguration: ADMIN_PASSWORD missing." },
        { status: 500 }
      );
    }

    if (pass !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ------------------------------
    // 2) Supabase env validation
    // ------------------------------
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRole) {
      console.error("❌ Missing Supabase env config", { url, serviceRole });
      return NextResponse.json(
        { error: "Supabase configuration missing." },
        { status: 500 }
      );
    }

    // ------------------------------
    // 3) Create server supabase client
    // ------------------------------
    const supabase = createClient(url, serviceRole);

    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { error: "Database error: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ blocked: data || [] });
  } catch (err: any) {
    console.error("❌ Route crashed:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
