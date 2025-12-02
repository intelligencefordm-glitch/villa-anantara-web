// app/api/blocks/list/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

export async function GET() {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("date,reason")
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blocked: data ?? [] });
}
