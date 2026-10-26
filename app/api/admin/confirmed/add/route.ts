import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin password
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

    // 2. Check Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server database configuration is missing." },
        { status: 500 }
      );
    }

    // 3. Read booking details
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const checkIn = String(body.check_in ?? "").trim();
    const checkOut = String(body.check_out ?? "").trim();
    const guests = Number(body.guests);
    const totalAmount = Number(body.total_amount);
    const occasion = String(body.occasion ?? "").trim();

    const paymentMode = String(body.payment_mode ?? "Online");
    let onlineAmount = Number(body.online_amount ?? 0);
    let cashAmount = Number(body.cash_amount ?? 0);

    // Support existing form submissions that only send amount_paid.
    if (
      body.online_amount === undefined &&
      body.cash_amount === undefined
    ) {
      const legacyPaid = Number(body.amount_paid ?? 0);

      if (paymentMode === "Cash") {
        cashAmount = legacyPaid;
        onlineAmount = 0;
      } else {
        onlineAmount = legacyPaid;
        cashAmount = 0;
      }
    }

    const amountPaid = onlineAmount + cashAmount;

    // 4. Validate payment mode and amounts
    if (!["Online", "Cash", "Mixed"].includes(paymentMode)) {
      return NextResponse.json(
        { error: "Select Online, Cash, or Mixed as the payment mode." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(onlineAmount) ||
      !Number.isFinite(cashAmount) ||
      onlineAmount < 0 ||
      cashAmount < 0 ||
      amountPaid > totalAmount
    ) {
      return NextResponse.json(
        { error: "Please enter valid online and cash payment amounts." },
        { status: 400 }
      );
    }

    if (
      (paymentMode === "Online" && cashAmount !== 0) ||
      (paymentMode === "Cash" && onlineAmount !== 0) ||
      (paymentMode === "Mixed" &&
        (onlineAmount <= 0 || cashAmount <= 0))
    ) {
      return NextResponse.json(
        {
          error:
            "Online mode requires online payment only, Cash mode requires cash only, and Mixed requires both amounts.",
        },
        { status: 400 }
      );
    }

    // 5. Validate booking fields and dates
    if (
      !name ||
      !phone ||
      !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) ||
      !Number.isInteger(guests) ||
      guests < 1 ||
      !Number.isFinite(totalAmount) ||
      totalAmount < 0
    ) {
      return NextResponse.json(
        { error: "Please provide valid booking details." },
        { status: 400 }
      );
    }

    const startDate = new Date(`${checkIn}T00:00:00Z`);
    const endDate = new Date(`${checkOut}T00:00:00Z`);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate.toISOString().slice(0, 10) !== checkIn ||
      endDate.toISOString().slice(0, 10) !== checkOut ||
      endDate <= startDate
    ) {
      return NextResponse.json(
        { error: "Check-out must be after check-in." },
        { status: 400 }
      );
    }

    const nights = Math.round(
      (endDate.getTime() - startDate.getTime()) / 86400000
    );

    // 6. Connect to Supabase
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 7. Check blocked dates
    const { data: blockedDates, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("date")
      .gte("date", checkIn)
      .lt("date", checkOut);

    if (blockedError) {
      console.error("Blocked date lookup failed:", blockedError);

      return NextResponse.json(
        { error: blockedError.message, code: blockedError.code },
        { status: 500 }
      );
    }

    if (blockedDates && blockedDates.length > 0) {
      return NextResponse.json(
        { error: "These dates include dates blocked for booking." },
        { status: 409 }
      );
    }

    // 8. Check overlapping bookings
    const { data: overlaps, error: overlapError } = await supabase
      .from("confirmed_bookings")
      .select("id")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (overlapError) {
      console.error("Booking overlap check failed:", overlapError);

      return NextResponse.json(
        { error: overlapError.message, code: overlapError.code },
        { status: 500 }
      );
    }

    if (overlaps && overlaps.length > 0) {
      return NextResponse.json(
        {
          error: "These dates overlap with an existing confirmed booking.",
        },
        { status: 409 }
      );
    }

    // 9. Prepare booking data.
    // amount_due is omitted because Supabase calculates it.
    const booking = {
      name,
      phone,
      guests,
      occasion,
      check_in: checkIn,
      check_out: checkOut,
      total_amount: totalAmount,
      amount_paid: amountPaid,
      payment_mode: paymentMode,
      online_amount: onlineAmount,
      cash_amount: cashAmount,
      nights,
    };

    // 10. Save booking
    const { data, error } = await supabase
      .from("confirmed_bookings")
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error("Confirmed booking creation failed:", error);

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, booking: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add confirmed booking error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while adding the booking." },
      { status: 500 }
    );
  }
}
