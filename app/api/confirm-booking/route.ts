import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    const idType = formData.get("id_type") as string;

    const idFile = formData.get("id_file") as File;
    const paymentFile = formData.get("payment_file") as File | null;

    if (!idFile) {
      return NextResponse.json({ error: "ID proof required" }, { status: 400 });
    }

    const idPath = `ids/${Date.now()}-${idFile.name}`;
    const { error: idError } = await supabase.storage
      .from("booking-documents")
      .upload(idPath, idFile);

    if (idError) throw idError;

    let paymentPath = null;

    if (paymentFile) {
      paymentPath = `payments/${Date.now()}-${paymentFile.name}`;
      const { error } = await supabase.storage
        .from("booking-documents")
        .upload(paymentPath, paymentFile);
      if (error) throw error;
    }

    const { error: dbError } = await supabase
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
        id_type: idType,
        id_file_path: idPath,
        payment_file_path: paymentPath,
      });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 400 }
    );
  }
}