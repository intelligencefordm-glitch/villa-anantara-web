import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const guests = Number(formData.get("guests"));
    const occasion = formData.get("occasion") as string;
    const check_in = formData.get("check_in") as string;
    const check_out = formData.get("check_out") as string;
    const nights = Number(formData.get("nights"));
    const total_amount = Number(formData.get("total_amount"));
    const amount_paid = Number(formData.get("amount_paid") || 0);
    const payment_mode = formData.get("payment_mode") as string;
    const id_proof_type = formData.get("id_proof_type") as string;
    const idFile = formData.get("id_file") as File | null;

    if (
      !name ||
      !phone ||
      !guests ||
      !check_in ||
      !check_out ||
      !nights ||
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

    /* -----------------------------
       Upload ID proof to storage
    ----------------------------- */
    const fileExt = idFile.name.split(".").pop();
    const filePath = `ids/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("booking-documents")
      .upload(filePath, idFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Failed to upload ID proof" },
        { status: 500 }
      );
    }

    /* -----------------------------
       Insert booking
    ----------------------------- */
    const { error: insertError } = await supabase
      .from("confirmed_bookings")
      .insert([
        {
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
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}