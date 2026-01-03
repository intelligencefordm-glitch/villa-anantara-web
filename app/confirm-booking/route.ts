import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // REQUIRED
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

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

    const idProof = formData.get("id_proof") as File;
    const paymentProof = formData.get("payment_screenshot") as File;

    if (!idProof || !paymentProof) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    const bookingId = crypto.randomUUID();

    // Upload ID Proof
    const idProofPath = `id-proofs/${bookingId}-${idProof.name}`;
    const { error: idErr } = await supabase.storage
      .from("documents")
      .upload(idProofPath, idProof, { upsert: true });

    if (idErr) throw idErr;

    // Upload Payment Screenshot
    const payPath = `payments/${bookingId}-${paymentProof.name}`;
    const { error: payErr } = await supabase.storage
      .from("documents")
      .upload(payPath, paymentProof, { upsert: true });

    if (payErr) throw payErr;

    // Insert booking
    const { error: dbErr } = await supabase
      .from("confirmed_bookings")
      .insert({
        name,
        phone,
        guests,
        occasion,
        check_in: checkIn,
        check_out: checkOut,
        id_proof_type: idProofType,
        id_proof_path: idProofPath,
        payment_mode: paymentMode,
        payment_screenshot_path: payPath,
        total_amount: totalAmount,
        amount_paid: amountPaid,
      });

    if (dbErr) throw dbErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to submit booking" },
      { status: 500 }
    );
  }
}