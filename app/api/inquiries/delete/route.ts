// app/api/inquiries/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const pass = req.headers.get("x-admin-password") || "";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass || pass !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing inquiry id" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("inquiries/delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("inquiries/delete fatal:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
