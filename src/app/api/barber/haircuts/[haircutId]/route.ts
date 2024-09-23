import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request, { params }: { params: { haircutId: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    
    const barber = await db.haircut.findUnique({
      where: {
        id: params.haircutId,
      }, 
    });
    return NextResponse.json(barber, {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { haircutId: string } }) {
  const { name, duration } = await req.json();
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    await db.haircut.update({
      where: { id: params.haircutId },
      data: { name, duration },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: { haircutId: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    
    await db.haircut.delete({ where: { id: params.haircutId } });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}