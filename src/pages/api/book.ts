import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, phone, email, startDate, endDate, message, totalAmount, depositAmount, depositPaid } = req.body;
  const bookingsStart = new Date(process.env.BOOKINGS_START_DATE || '2026-01-15');
  if (new Date(startDate) < bookingsStart) {
    return res.status(400).json({ error: 'Bookings not open for selected dates' });
  }

  // Basic overlap check
  const overlap = await prisma.booking.findFirst({
    where: {
      AND: [
        { status: { in: ['CONFIRMED','PENDING'] } },
        { startDate: { lte: new Date(endDate) } },
        { endDate: { gte: new Date(startDate) } }
      ]
    }
  });
  if (overlap) return res.status(409).json({ error: 'Selected dates are not available' });

  const b = await prisma.booking.create({
    data: {
      name, phone, email, startDate: new Date(startDate), endDate: new Date(endDate),
      message, totalAmount: totalAmount || 0, depositAmount: depositAmount || 0, depositPaid: !!depositPaid, status: 'PENDING', source: 'website',bookingType: 'default'
    }
  });

  // Return wa.me link for manual WhatsApp notification (owner)
  const wa = `https://wa.me/${process.env.WHATSAPP_NUMBER!.replace('+','') }?text=New%20booking%20request%20for%20Villa%20Anantara%20from%20${encodeURIComponent(name)}%20(${startDate}%20to%20${endDate})`;
  res.status(201).json({ booking: b, whatsapp: wa });
}
