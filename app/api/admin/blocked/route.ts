import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*");

  return error
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ blocked: data });
}
