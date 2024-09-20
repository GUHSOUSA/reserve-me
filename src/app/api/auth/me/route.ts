import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      }, 
      select: {
        id: true,
        role: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        name: true
      }
    })
    return NextResponse.json({ ...user });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 401 });
  }
}
