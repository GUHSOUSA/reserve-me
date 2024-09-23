import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request, { params }: { params: { barberId: string } }) {
  
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    
    const barber = await db.barber.findUnique({
      where: {
        id: parseInt(params.barberId),
      }, 
    });
    return NextResponse.json(barber, {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { barberId: string } }) {
  const { name, email } = await req.json();
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    await db.barber.update({
      where: { id: parseInt(params.barberId) },
      data: { name, email },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: { barberId: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    
    await db.barber.delete({ where: { id: parseInt(params.barberId) } });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}