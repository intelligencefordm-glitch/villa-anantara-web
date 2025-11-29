import { NextApiRequest, NextApiResponse } from 'next';
// This endpoint is a stub. In production run a scheduled job to fetch external iCals (Airbnb/Booking.com)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true, note: 'Import scheduled job should run server-side to fetch iCal URLs stored in settings.' });
}
