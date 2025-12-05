// app/api/inquiries/list/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("inquiries/list error:", error);
      return NextResponse.json({ error: error.message, inquiries: [] }, { status: 500 });
    }

    return NextResponse.json(
      { inquiries: data || [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("inquiries/list fatal:", err);
    return NextResponse.json({ error: "Internal error", inquiries: [] }, { status: 500 });
  }
}
