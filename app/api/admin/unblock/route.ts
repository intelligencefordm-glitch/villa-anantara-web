export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const pass = req.headers.get("x-admin-password") || "";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass || pass !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const dates: string[] = body?.dates || [];

    if (!Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: "No dates provided" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .in("date", dates);

    if (error) {
      console.error("UNBLOCK delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("UNBLOCK route fatal error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
