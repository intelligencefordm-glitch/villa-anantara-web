import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = “force-dynamic”;

export async function POST(req: NextRequest) {
try {
const adminPassword = req.headers.get("x-admin-password");

if (
  !process.env.ADMIN_PASSWORD ||
  !adminPassword ||
  adminPassword !== process.env.ADMIN_PASSWORD
) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  return NextResponse.json(
    { error: "Server database configuration is missing." },
    { status: 500 }
  );
}
const body = await req.json();
const name = String(body.name ?? "").trim();
const phone = String(body.phone ?? "").trim();
const checkIn = String(body.check_in ?? "").trim();
const checkOut = String(body.check_out ?? "").trim();
const guests = Number(body.guests);
const totalAmount = Number(body.total_amount);
const amountPaid = Number(body.amount_paid);
const occasion = String(body.occasion ?? "").trim();
if (
  !name ||
  !phone ||
  !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) ||
  !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) ||
  !Number.isInteger(guests) ||
  guests < 1 ||
  !Number.isFinite(totalAmount) ||
  totalAmount < 0 ||
  !Number.isFinite(amountPaid) ||
  amountPaid < 0 ||
  amountPaid > totalAmount
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
    { error: "Check-out must be after check-in. Check your dates." },
    { status: 400 }
  );
}
const nights = Math.round(
  (endDate.getTime() - startDate.getTime()) / 86400000
);
const supabase = createClient(supabaseUrl, serviceRoleKey);
const { data: blockedDates, error: blockedError } = await supabase
  .from("blocked_dates")
  .select("date")
  .gte("date", checkIn)
  .lt("date", checkOut);
if (blockedError) {
  console.error("Blocked date lookup failed:", blockedError);
  return NextResponse.json(
    { error: "Could not verify date availability." },
    { status: 500 }
  );
}
if (blockedDates && blockedDates.length > 0) {
  return NextResponse.json(
    { error: "These dates include dates blocked for booking." },
    { status: 409 }
  );
}
const { data: overlaps, error: overlapError } = await supabase
  .from("confirmed_bookings")
  .select("id")
  .lt("check_in", checkOut)
  .gt("check_out", checkIn);
if (overlapError) {
  console.error("Booking overlap check failed:", overlapError);
  return NextResponse.json(
    { error: "Could not verify existing bookings." },
    { status: 500 }
  );
}
if (overlaps && overlaps.length > 0) {
  return NextResponse.json(
    { error: "These dates overlap with an existing confirmed booking." },
    { status: 409 }
  );
}
const booking = {
  name,
  phone,
  guests,
  occasion,
  check_in: checkIn,
  check_out: checkOut,
  total_amount: totalAmount,
  amount_paid: amountPaid,
  amount_due: totalAmount - amountPaid,
  nights,
};
const { data, error } = await supabase
  .from("confirmed_bookings")
  .insert([booking])
  .select()
  .single();
if (error) {
  console.error("Confirmed booking creation failed:", error);
  return NextResponse.json(
    { error: "Could not save the booking. Check the database columns." },
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
