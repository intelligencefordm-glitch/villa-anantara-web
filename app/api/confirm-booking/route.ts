import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const guests = Number(formData.get("guests"));
    const purpose = formData.get("purpose") as string;
    const checkIn = formData.get("check_in") as string;
    const checkOut = formData.get("check_out") as string;
    const totalAmount = Number(formData.get("total_amount"));
    const advanceAmount = Number(formData.get("advance_amount") || 0);
    const paymentMode = formData.get("payment_mode") as string;
    const idProofType = formData.get("id_proof_type") as string;

    const idFile = formData.get("id_proof") as File | null;
    const paymentFile = formData.get("payment_proof") as File | null;

    if (
      !name ||
      !phone ||
      !guests ||
      !checkIn ||
      !checkOut ||
      !totalAmount ||
      !paymentMode ||
      !idProofType ||
      !idFile
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }

    /* -------------------------
       Upload ID Proof
    ------------------------- */
    const idPath = `ids/${Date.now()}-${safeFileName(idFile.name)}`;

    const { error: idUploadError } = await supabase.storage
      .from("booking-documents")
      .upload(idPath, idFile, {
        contentType: idFile.type,
        upsert: false,
      });

    if (idUploadError) {
      return NextResponse.json(
        { error: idUploadError.message },
        { status: 500 }
      );
    }

    /* -------------------------
       Upload Payment Proof (UPI only)
    ------------------------- */
    let paymentPath: string | null = null;

    if (paymentMode === "UPI" && paymentFile) {
      paymentPath = `payments/${Date.now()}-${safeFileName(paymentFile.name)}`;

      const { error: payUploadError } = await supabase.storage
        .from("booking-documents")
        .upload(paymentPath, paymentFile, {
          contentType: paymentFile.type,
          upsert: false,
        });

      if (payUploadError) {
        return NextResponse.json(
          { error: payUploadError.message },
          { status: 500 }
        );
      }
    }

    /* -------------------------
       Insert Booking
    ------------------------- */
    const { error: insertError } = await supabase
      .from("confirmed_bookings")
      .insert({
        name,
        phone,
        guests,
        occasion: purpose,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        total_amount: totalAmount,
        amount_paid: advanceAmount,
        payment_mode: paymentMode,
        id_proof_type: idProofType,
        id_proof_path: idPath,
        payment_proof_path: paymentPath,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}