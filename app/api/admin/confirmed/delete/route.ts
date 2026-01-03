import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
    }

    // 1️⃣ Get file paths before deleting booking
    const { data: booking, error: fetchError } = await supabase
      .from("confirmed_bookings")
      .select("id_proof_path, payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 2️⃣ Delete files from storage
    const filesToDelete = [
      booking?.id_proof_path,
      booking?.payment_proof_path,
    ].filter(Boolean);

    if (filesToDelete.length > 0) {
      await supabase.storage
        .from("booking-documents")
        .remove(filesToDelete);
    }

    // 3️⃣ Delete booking row
    const { error: deleteError } = await supabase
      .from("confirmed_bookings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}