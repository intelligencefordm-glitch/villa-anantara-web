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
if (
  (typeof id !== "string" && typeof id !== "number") ||
  String(id).trim() === ""
) {
  return NextResponse.json(
    { error: "A valid inquiry ID is required." },
    { status: 400 }
  );
}
const { data, error } = await supabase
  .from("inquiries")
  .delete()
  .eq("id", id)
  .select("id");
if (error) {
  console.error("Inquiry deletion failed:", error);
  return NextResponse.json(
    { error: "Could not delete the inquiry." },
    { status: 500 }
  );
}
if (!data || data.length === 0) {
  return NextResponse.json(
    { error: "Inquiry not found." },
    { status: 404 }
  );
}
return NextResponse.json(
  {
    success: true,
    message: "Inquiry deleted successfully.",
    id: data[0].id,
  },
  { status: 200 }
);

} catch (error) {
console.error("Delete inquiry error:", error);

return NextResponse.json(
  { error: "An unexpected error occurred while deleting the inquiry." },
  { status: 500 }
);

}
}
