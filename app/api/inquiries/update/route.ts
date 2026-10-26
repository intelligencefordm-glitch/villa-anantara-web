import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
try {
const adminPassword = request.headers.get("x-admin-password");

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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  return NextResponse.json(
    { error: "Server database configuration is missing." },
    { status: 500 }
  );
}
const supabase = createClient(supabaseUrl, serviceRoleKey);
const body = await request.json();
const id = body.id;
const name = String(body.name ?? "").trim();
const phone = String(body.phone ?? "").trim();
const email = String(body.email ?? "").trim();
const occasion = String(body.occasion ?? "").trim();
const guests = Number(body.guests);
const checkIn = String(body.check_in ?? "").trim();
const checkOut = String(body.check_out ?? "").trim();
const nights = Number(body.nights);
if (
  (typeof id !== "string" && typeof id !== "number") ||
  String(id).trim() === ""
) {
  return NextResponse.json(
    { error: "A valid inquiry ID is required." },
    { status: 400 }
  );
}
if (
  !name ||
  !phone ||
  !checkIn ||
  !checkOut ||
  !Number.isInteger(guests) ||
  guests < 1 ||
  !Number.isInteger(nights) ||
  nights < 1
) {
  return NextResponse.json(
    { error: "Please provide valid inquiry details." },
    { status: 400 }
  );
}
const startDate = new Date(checkIn + "T00:00:00Z");
const endDate = new Date(checkOut + "T00:00:00Z");
if (
  Number.isNaN(startDate.getTime()) ||
  Number.isNaN(endDate.getTime()) ||
  endDate <= startDate
) {
  return NextResponse.json(
    { error: "Please provide valid check-in and check-out dates." },
    { status: 400 }
  );
}
const calculatedNights = Math.round(
  (endDate.getTime() - startDate.getTime()) / 86400000
);
if (calculatedNights !== nights) {
  return NextResponse.json(
    { error: "The number of nights does not match the dates." },
    { status: 400 }
  );
}
const updateData: Record<string, string | number> = {
  name,
  phone,
  guests,
  occasion,
  check_in: checkIn,
  check_out: checkOut,
  nights,
};
if (email) {
  updateData.email = email;
}
const { data, error } = await supabase
  .from("inquiries")
  .update(updateData)
  .eq("id", id)
  .select()
  .maybeSingle();
if (error) {
  console.error("Inquiry update failed:", error);
  return NextResponse.json(
    { error: "Could not update the inquiry. Check your database columns." },
    { status: 500 }
  );
}
if (!data) {
  return NextResponse.json(
    { error: "Inquiry not found." },
    { status: 404 }
  );
}
return NextResponse.json(
  { success: true, inquiry: data },
  { status: 200 }
);

} catch (error) {
console.error("Update inquiry error:", error);

return NextResponse.json(
  { error: "An unexpected error occurred while updating the inquiry." },
  { status: 500 }
);

}
}
