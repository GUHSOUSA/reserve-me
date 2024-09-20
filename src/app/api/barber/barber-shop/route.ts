import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    const barberShop = await db.barberShop.findUnique({
      where: {
        userId: decoded.id
      },
      include: {
        barbers: true,
        haircut: true  
      }
    });
    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }
    return NextResponse.json(barberShop, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    const body = await req.json();
    const { name } = body;
    const existingBarberShop = await db.barberShop.findUnique({
      where: {
        userId: decoded.id
      }
    });
    if (existingBarberShop) {
      return NextResponse.json({ error: 'Usuário já possui uma barbearia' }, { status: 400 });
    }
    let subId: number | undefined;
    let isUnique = false;
    while (!isUnique) {
      subId = generateSubId();
      const existingSubId = await db.barberShop.findUnique({
        where: {
          subId: subId
        }
      });
      if (!existingSubId) {
        isUnique = true;
      }
    }
    if (subId === undefined) {
      throw new Error('Falha ao gerar subId');
    }
    const newBarberShop = await db.barberShop.create({
      data: {
        name,
        subId,
        userId: decoded.id,
        active: true,
      }
    });
    return NextResponse.json({ barberShop: newBarberShop }, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
function generateSubId(): number {
  return Math.floor(1000 + Math.random() * 90000); // Gera um número de 4 dígitos entre 1000 e 9999
}
