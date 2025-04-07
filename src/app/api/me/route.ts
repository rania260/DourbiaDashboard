// app/api/auth/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(user);
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}