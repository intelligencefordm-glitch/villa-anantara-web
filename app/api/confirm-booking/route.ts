import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Server-side Supabase client (SERVICE ROLE)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // -----------------------------
    // 1. Read form fields
    // -----------------------------
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const guests = Number(formData.get("guests"));
    const occasion = formData.get("occasion") as string;
    const checkIn = formData.get("check_in") as string;
    const checkOut = formData.get("check_out") as string;
    const totalAmount = Number(formData.get("total_amount"));
    const amountPaid = Number(formData.get("amount_paid"));
    const paymentMode = formData.get("payment_mode") as string;
    const idProofType = formData.get("id_proof_type") as string;

    const idFile = formData.get("id_proof") as File | null;
    const paymentFile = formData.get("payment_screenshot") as File | null;

    if (!name || !phone || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // -----------------------------
    // 2. Upload documents (PRIVATE BUCKET)
    // -----------------------------
    let idProofPath: string | null = null;
    let paymentProofPath: string | null = null;

    // Helper to sanitize filenames
    const sanitizeFileName = (file: File) =>
      `${Date.now()}-${file.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.\-_]/g, "")}`;

    if (idFile) {
      const buffer = Buffer.from(await idFile.arrayBuffer());
      const filePath = `ids/${sanitizeFileName(idFile)}`;

      const { error } = await supabase.storage
        .from("booking-documents")
        .upload(filePath, buffer, {
          contentType: idFile.type,
        });

      if (error) {
        console.error("ID upload failed:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      idProofPath = filePath;
    }

    if (paymentMode !== "Cash" && paymentFile) {
      const buffer = Buffer.from(await paymentFile.arrayBuffer());
      const filePath = `payments/${sanitizeFileName(paymentFile)}`;

      const { error } = await supabase.storage
        .from("booking-documents")
        .upload(filePath, buffer, {
          contentType: paymentFile.type,
        });

      if (error) {
        console.error("Payment upload failed:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      paymentProofPath = filePath;
    }

    // -----------------------------
    // 3. Insert booking in DB
    // -----------------------------
    const { error: insertError } = await supabase
      .from("confirmed_bookings")
      .insert({
        name,
        phone,
        guests,
        occasion,
        check_in: checkIn,
        check_out: checkOut,
        total_amount: totalAmount,
        amount_paid: amountPaid,
        payment_mode: paymentMode,
        id_proof_type: idProofType,
        id_proof_path: idProofPath,
        payment_proof_path: paymentProofPath,
      });

    if (insertError) {
      console.error("DB insert failed:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // -----------------------------
    // 4. Success
    // -----------------------------
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Confirm booking error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}