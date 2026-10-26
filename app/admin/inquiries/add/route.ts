// If this request includes an admin password, validate it.
// Requests without this header are treated as public inquiries.
const adminPassword = request.headers.get("x-admin-password");

if (
  adminPassword &&
  (!process.env.ADMIN_PASSWORD ||
    adminPassword !== process.env.ADMIN_PASSWORD)
) {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401 }
  );
}

const body = await request.json();

const name = String(body.name ?? "").trim();
const phone = String(body.phone ?? "").trim();
const email = String(body.email ?? "").trim();
const occasion = String(body.occasion ?? "").trim();
const guests = Number(body.guests);
const checkIn = String(body.check_in ?? "").trim();
const checkOut = String(body.check_out ?? "").trim();
const nights = Number(body.nights);

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

// Check manually blocked dates.
const { data: blockedDates, error: blockedError } = await supabase
  .from("blocked_dates")
  .select("date")
  .gte("date", checkIn)
  .lt("date", checkOut);

if (blockedError) {
  console.error("Blocked-date check failed:", blockedError);

  return NextResponse.json(
    { error: "Could not verify date availability." },
    { status: 500 }
  );
}

if (blockedDates && blockedDates.length > 0) {
  return NextResponse.json(
    { error: "Some selected dates are unavailable. Please choose other dates." },
    { status: 409 }
  );
}

// Check for overlapping confirmed bookings.
const { data: bookings, error: bookingsError } = await supabase
  .from("confirmed_bookings")
  .select("id")
  .lt("check_in", checkOut)
  .gt("check_out", checkIn);

if (bookingsError) {
  console.error("Confirmed-booking check failed:", bookingsError);

  return NextResponse.json(
    { error: "Could not verify booking availability." },
    { status: 500 }
  );
}

if (bookings && bookings.length > 0) {
  return NextResponse.json(
    { error: "Some selected dates are already booked. Please choose other dates." },
    { status: 409 }
  );
}

// Build the inquiry record.
// Email is included only when provided; your inquiries table must have an email column.
const inquiry: Record<string, string | number> = {
  name,
  phone,
  guests,
  occasion,
  check_in: checkIn,
  check_out: checkOut,
  nights,
};

if (email) {
  inquiry.email = email;
}

const { data, error } = await supabase
  .from("inquiries")
  .insert(inquiry)
  .select()
  .single();

if (error) {
  console.error("Inquiry insert failed:", error);

  return NextResponse.json(
    { error: "Could not save the inquiry. Please check the inquiries table columns." },
    { status: 500 }
  );
}

return NextResponse.json(
  { success: true, inquiry: data },
  { status: 201 }
);
