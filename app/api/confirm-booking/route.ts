import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // -------------------------
    // Extract fields
    // -------------------------
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const guests = Number(formData.get("guests"));
    const occasion = (formData.get("occasion") as string) || "Stay";
    const check_in = formData.get("check_in") as string;
    const check_out = formData.get("check_out") as string;
    const total_amount = Number(formData.get("total_amount"));
    const amount_paid = Number(formData.get("amount_paid"));
    const payment_mode = formData.get("payment_mode") as string;
    const id_proof_type = formData.get("id_proof_type") as string;
    const idFile = formData.get("id_proof") as File;

    // -------------------------
    // Basic validation
    // -------------------------
    if (
      !name ||
      !phone ||
      !guests ||
      !check_in ||
      !check_out ||
      !total_amount ||
      !payment_mode ||
      !id_proof_type ||
      !idFile
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // -------------------------
    // Calculate nights (FIX)
    // -------------------------
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const nights = Math.max(
      1,
      Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    // -------------------------
    // Upload ID proof (PRIVATE BUCKET)
    // -------------------------
    const fileExt = idFile.name.split(".").pop();
    const filePath = `ids/${Date.now()}-${phone}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("booking-documents")
      .upload(filePath, idFile, {
        upsert: false,
        contentType: idFile.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload ID proof" },
        { status: 500 }
      );
    }

    // -------------------------
    // Insert booking
    // -------------------------
    const { error: insertError } = await supabase
      .from("confirmed_bookings")
      .insert({
        name,
        phone,
        guests,
        occasion,
        check_in,
        check_out,
        nights,
        total_amount,
        amount_paid,
        payment_mode,
        id_proof_type,
        id_proof_path: filePath,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}