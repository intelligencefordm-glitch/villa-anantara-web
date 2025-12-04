import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { date } = await req.json();
    if (!date) {
      return NextResponse.json({ error: "Missing date." }, { status: 400 });
    }

    const { error } = await supabase
      .from("blocked_dates")
      .insert([{ date }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true }); // already exists
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error blocking date." },
      { status: 500 }
    );
  }
}
