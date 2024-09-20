import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    const activateBarberShop = await db.barberShop.update({
      where: {
        userId: params.id,
      },
      data: {
        active: false,
      }
    });
    return NextResponse.json(activateBarberShop, {status: 201});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}