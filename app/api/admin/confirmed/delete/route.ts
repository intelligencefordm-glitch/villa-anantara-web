import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // REQUIRED
);

export async function POST(req: Request) {
  try {
    // 🔐 ADMIN AUTH (IMPORTANT)
    const password = req.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking id" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch file paths before deletion
    const { data: booking, error: fetchError } = await supabase
      .from("confirmed_bookings")
      .select("id_proof_path, payment_proof_path")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Delete files from storage
    const filesToDelete = [
      booking.id_proof_path,
      booking.payment_proof_path,
    ].filter(Boolean) as string[];

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("booking-documents")
        .remove(filesToDelete);

      if (storageError) {
        return NextResponse.json(
          { error: "Failed to delete files from storage" },
          { status: 500 }
        );
      }
    }

    // 3️⃣ Delete booking row
    const { error: deleteError } = await supabase
      .from("confirmed_bookings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
