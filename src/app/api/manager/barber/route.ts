import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    const barbers = await db.user.findMany({
      where: {
        role: 'BARBER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      skip: offset,
      take: limit
    });
    const totalCount = await db.user.count({ where: { role: "BARBER" } });

    return NextResponse.json({ barberShop: barbers, total: totalCount, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 401 });
  }
}
export async function POST(req: Request) {
  const { email, password, name, role } = await req.json();
  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: "Por favor, Preencha todos os campos" }, { status: 400 });
  }
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email ja esta em uso" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newBarber = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return NextResponse.json(newBarber, {status: 201});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
