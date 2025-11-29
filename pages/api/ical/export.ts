import { NextApiRequest, NextApiResponse } from 'next';
import ical from 'ical-generator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cal = ical({ name: 'Villa Anantara Bookings' });
  const bookings = await prisma.booking.findMany({ where: { status: 'CONFIRMED' }});

  bookings.forEach(b => {
    cal.createEvent({
      start: b.startDate,
      end: b.endDate,
      summary: `Booked: ${b.name}`,
      uid: b.id as any
    });
  });

  res.setHeader('Content-Type', 'text/calendar');
  res.send(cal.toString());
}
