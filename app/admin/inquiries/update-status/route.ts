import { NextRequest, NextResponse } from “next/server”;
import { createClient } from “@supabase/supabase-js”;

const ALLOWED_STATUSES = [
“New Inquiry”,
“Currently Talking”,
“Rejected”,
] as const;

type InquiryStatus = (typeof ALLOWED_STATUSES)[number];

export async function POST(request: NextRequest) {
try {
// 1. Verify admin authentication.
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
// 2. Initialize Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  return NextResponse.json(
    { error: "Server database configuration is missing." },
    { status: 500 }
  );
}
const supabase = createClient(supabaseUrl, serviceRoleKey);
// 3. Read and validate the request.
const body = await request.json();
const id = body.id;
const status = body.status;
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
  typeof status !== "string" ||
  !ALLOWED_STATUSES.includes(status as InquiryStatus)
) {
  return NextResponse.json(
    { error: "Invalid status selected." },
    { status: 400 }
  );
}
// 4. Update the inquiry status.
const { data, error } = await supabase
  .from("inquiries")
  .update({ status })
  .eq("id", id)
  .select("id, status")
  .maybeSingle();
if (error) {
  console.error("Inquiry status update failed:", error);
  return NextResponse.json(
    { error: "Could not update the inquiry status." },
    { status: 500 }
  );
}
if (!data) {
  return NextResponse.json(
    { error: "Inquiry not found." },
    { status: 404 }
  );
}
// 5. Return the updated status.
return NextResponse.json(
  {
    success: true,
    message: "Inquiry status updated successfully.",
    inquiry: data,
  },
  { status: 200 }
);

} catch (error) {
console.error(“Update inquiry status error:”, error);

return NextResponse.json(
  { error: "An unexpected error occurred while updating the status." },
  { status: 500 }
);

}
}
