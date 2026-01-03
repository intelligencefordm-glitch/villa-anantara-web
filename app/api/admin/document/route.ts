import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json(
        { error: "Missing file path" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("booking-documents")
      .createSignedUrl(path, 60 * 10); // 10 minutes

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate document link" },
      { status: 500 }
    );
  }
}