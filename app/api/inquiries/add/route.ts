if (!supabaseUrl || !serviceRoleKey) {
  return NextResponse.json(
    { error: "Database configuration is missing." },
    { status: 500 }
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

const startDate = new Date(checkIn + "T00:00:00Z");
const endDate = new Date(checkOut + "T00:00:00Z");

if (
  Number.isNaN(startDate.getTime()) ||
  Number.isNaN(endDate.getTime()) ||
  endDate <= startDate
) {
  return NextResponse.json(
    { error: "Invalid check-in or check-out dates." },
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

const { data: blockedDates, error: blockedError } = await supabase
  .from("blocked_dates")
  .select("date")
  .gte("date", checkIn)
  .lt("date", checkOut);

if (blockedError) {
  console.error(blockedError);

  return NextResponse.json(
    { error: "Could not verify date availability." },
    { status: 500 }
  );
}

if (blockedDates && blockedDates.length > 0) {
  return NextResponse.json(
    { error: "Some selected dates are unavailable." },
    { status: 409 }
  );
}

const { data: bookings, error: bookingsError } = await supabase
  .from("confirmed_bookings")
  .select("id")
  .lt("check_in", checkOut)
  .gt("check_out", checkIn);

if (bookingsError) {
  console.error(bookingsError);

  return NextResponse.json(
    { error: "Could not verify confirmed bookings." },
    { status: 500 }
  );
}

if (bookings && bookings.length > 0) {
  return NextResponse.json(
    { error: "Some selected dates are already booked." },
    { status: 409 }
  );
}

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
  console.error(error);

  return NextResponse.json(
    { error: "Could not save the inquiry." },
    { status: 500 }
  );
}

return NextResponse.json(
  { success: true, inquiry: data },
  { status: 201 }
);
