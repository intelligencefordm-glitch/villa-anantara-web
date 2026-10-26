import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    // Verify admin password
    const adminPassword = req.headers.get("x-admin-password");
    if (
      !process.env.ADMIN_PASSWORD ||
      !adminPassword ||
      adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }
    // Verify database configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server database configuration is missing." },
        { status: 500 }
      );
    }
    // Validate booking ID
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "A valid booking ID is required." },
        { status: 400 }
      );
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    // Fetch the booking
    const { data: booking, error: fetchError } = await supabase
      .from("confirmed_bookings")
      .select("id, total_amount, amount_paid")
      .eq("id", id)
      .maybeSingle();
    if (fetchError) {
      console.error("Failed to fetch booking:", fetchError);
      return NextResponse.json(
        { error: fetchError.message, code: fetchError.code },
        { status: 500 }
      );
    }
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }
    const totalAmount = Number(booking.total_amount);
    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      return NextResponse.json(
        { error: "The booking has an invalid total amount." },
        { status: 400 }
      );
    }
    // Update the amount paid. Do not write amount_due because
    // your database does not allow direct inserts into that column.
    const { data: updatedBooking, error: updateError } = await supabase
      .from("confirmed_bookings")
      .update({ amount_paid: totalAmount })
      .eq("id", id)
      .select("id, total_amount, amount_paid, amount_due")
      .single();
    if (updateError) {
      console.error("Failed to mark booking as paid:", updateError);
      return NextResponse.json(
        {
          error: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Mark booking as paid error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating payment." },
      { status: 500 }
    );
  }
}
