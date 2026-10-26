import { NextRequest, NextResponse } from “next/server”;
import { createClient } from “@supabase/supabase-js”;

const ALLOWED_STATUSES = [
“New Inquiry”,
“Currently Talking”,
“Rejected”,
];

export async function POST(request: NextRequest) {
try {
// Verify admin password.
const adminPassword = request.headers.get(“x-admin-password”);

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
// Initialize Supabase on the server.
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
if (checkOut <= checkIn) {
  return NextResponse.json(
    { error: "Check-out must be after check-in." },
    { status: 400 }
  );
}
// Validate dates and calculate the number of nights.
const startDate = new Date(`${checkIn}T00:00:00Z`);
const endDate = new Date(`${checkOut}T00:00:00Z`);
if (
  Number.isNaN(startDate.getTime()) ||
  Number.isNaN(endDate.getTime())
) {
  return NextResponse.json(
    { error: "Invalid check-in or check-out date." },
    { status: 400 }
  );
}
const calculatedNights = Math.round(
  (endDate.getTime() - startDate.getTime()) / 86400000
);
if (calculatedNights !== nights) {
  return NextResponse.json(
    { error: "The number of nights does not match the selected dates." },
    { status: 400 }
  );
}
const { data: existingInquiry, error: findError } = await supabase
  .from("inquiries")
  .select("id")
  .eq("id", id)
  .maybeSingle();
if (findError) {
  console.error("Inquiry lookup failed:", findError);
  return NextResponse.json(
    { error: "Could not verify the inquiry." },
    { status: 500 }
  );
}
if (!existingInquiry) {
  return NextResponse.json(
    { error: "Inquiry not found." },
    { status: 404 }
  );
}
// Update inquiry details. Do not change the status here.
// The status dropdown will use the update-status endpoint.
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
  .single();
if (error) {
  console.error("Inquiry update failed:", error);
  return NextResponse.json(
    {
      error:
        "Could not update the inquiry. Check that the database columns match the submitted fields.",
    },
    { status: 500 }
  );
}
return NextResponse.json(
  { success: true, inquiry: data },
  { status: 200 }
);

} catch (error) {
console.error(“Update inquiry error:”, error);

return NextResponse.json(
  { error: "An unexpected error occurred while updating the inquiry." },
  { status: 500 }
);

}
}
