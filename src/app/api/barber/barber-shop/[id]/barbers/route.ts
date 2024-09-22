import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e Email são obrigatórios' }, { status: 400 });
    }
    const barberShop = await db.barberShop.findUnique({
      where: { id: params.id, userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }
    const newBarber = await db.barber.create({
      data: {
        name,
        email,
        BarberShop: {
          connect: { id: params.id }
        }
      }
    });
    return NextResponse.json(newBarber, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    // Verifica se a barbearia existe e pertence ao usuário
    const barberShop = await db.barberShop.findUnique({
      where: { id: params.id, userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Busca paginada dos barbeiros associados à barbearia
    const barbers = await db.barber.findMany({
      where: {
        BarberShop: {
          some: {
            id: params.id
          }
        }
      },
      skip: offset,
      take: limit
    });

    const totalCount = await db.barber.count({
      where: {
        BarberShop: {
          some: {
            id: params.id
          }
        }
      }
    });

    return NextResponse.json({ barbers, total: totalCount, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

