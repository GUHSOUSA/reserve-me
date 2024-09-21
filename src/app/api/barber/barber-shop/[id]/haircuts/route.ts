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
    const { name, duration } = await req.json();

    if (!name || !duration) {
      return NextResponse.json({ error: 'Nome e Duração são obrigatórios' }, { status: 400 });
    }

    // Verifica se a barbearia existe e pertence ao usuário
    const barberShop = await db.barberShop.findUnique({
      where: { id: params.id, userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Cria o tipo de corte
    const newHaircut = await db.haircut.create({
      data: {
        name,
        duration,
        barberShopId: params.id
      }
    });

    return NextResponse.json(newHaircut, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
export async function GET(req: Request, { params }: { params: { barberShopId: string } }) {
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
      where: { id: params.barberShopId, userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Busca paginada dos tipos de corte associados à barbearia
    const haircuts = await db.haircut.findMany({
      where: {
        barberShopId: params.barberShopId
      },
      skip: offset,
      take: limit
    });

    const totalCount = await db.haircut.count({
      where: {
        barberShopId: params.barberShopId
      }
    });

    return NextResponse.json({ haircuts, total: totalCount, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
