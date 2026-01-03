import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // -----------------------------
    // READ FORM FIELDS
    // -----------------------------
    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const guests = Number(formData.get("guests"));
    const check_in = String(formData.get("check_in") || "");
    const check_out = String(formData.get("check_out") || "");
    const advance_amount = Number(formData.get("advance_amount"));
    const payment_mode = String(formData.get("payment_mode") || "");
    const id_proof_type = String(formData.get("id_proof_type") || "");

    const idFile = formData.get("id_proof") as File | null;
    const paymentFile = formData.get("payment_proof") as File | null;

    // -----------------------------
    // VALIDATION (SERVER SIDE)
    // -----------------------------
    if (!name || !phone || !check_in || !check_out || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!id_proof_type || !idFile) {
      return NextResponse.json(
        { error: "ID proof is required" },
        { status: 400 }
      );
    }

    if (payment_mode === "online" && !paymentFile) {
      return NextResponse.json(
        { error: "Payment screenshot required for online payments" },
        { status: 400 }
      );
    }

    // -----------------------------
    // UPLOAD ID PROOF
    // -----------------------------
    const idPath = `id-proof/${Date.now()}-${idFile.name}`;

    const { error: idUploadError } = await supabase.storage
      .from("documents")
      .upload(idPath, idFile, { upsert: true });

    if (idUploadError) {
      console.error(idUploadError);
      return NextResponse.json(
        { error: "Failed to upload ID proof" },
        { status: 500 }
      );
    }

    const id_proof_url = idPath;

    // -----------------------------
    // UPLOAD PAYMENT PROOF (OPTIONAL)
    // -----------------------------
    let payment_proof_url: string | null = null;

    if (payment_mode === "online" && paymentFile) {
      const payPath = `payment/${Date.now()}-${paymentFile.name}`;

      const { error: payUploadError } = await supabase.storage
        .from("documents")
        .upload(payPath, paymentFile, { upsert: true });

      if (payUploadError) {
        console.error(payUploadError);
        return NextResponse.json(
          { error: "Failed to upload payment proof" },
          { status: 500 }
        );
      }

      payment_proof_url = payPath;
    }

    // -----------------------------
    // INSERT INTO DATABASE
    // -----------------------------
    const { error: insertError } = await supabase
      .from("confirmed_bookings")
      .insert([
        {
          name,
          phone,
          email,
          guests,
          check_in,
          check_out,
          advance_amount,
          payment_mode,
          id_proof_type,
          id_proof_url,
          payment_proof_url,
          payment_status: "advance_received",
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Failed to save booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Confirm booking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}