import { cookies } from 'next/headers'

export async function POST() {
  await cookies().delete('token')
  return Response.json({ success: true })
};