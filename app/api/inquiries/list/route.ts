import { NextRequest, NextResponse } from “next/server”;
import { createClient } from “@supabase/supabase-js”;

export async function GET(request: NextRequest) {
try {
// Require the admin password to retrieve inquiries.
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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  return NextResponse.json(
    { error: "Server database configuration is missing." },
    { status: 500 }
  );
}
const supabase = createClient(supabaseUrl, serviceRoleKey);
const { data, error } = await supabase
  .from("inquiries")
  .select("*")
  .order("created_at", { ascending: false });
if (error) {
  console.error("Failed to fetch inquiries:", error);
  return NextResponse.json(
    { error: "Could not load inquiries." },
    { status: 500 }
  );
}
return NextResponse.json(
  { inquiries: data ?? [] },
  { status: 200 }
);

} catch (error) {
console.error(“Inquiry list error:”, error);

return NextResponse.json(
  { error: "An unexpected error occurred while loading inquiries." },
  { status: 500 }
);

}
}
