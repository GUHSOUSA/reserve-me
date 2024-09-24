import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from 'jsonwebtoken';

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

    // Verifica se a barbearia existe e pertence ao usuário
    const barberShop = await db.barberShop.findUnique({
      where: { userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Busca paginada dos clientes associados à barbearia
    const clients = await db.client.findMany({
      where: {
        BarberShop: {
          some: {
            id: barberShop.id
          }
        }
      },
      skip: offset,
      take: limit
    });

    const totalCount = await db.client.count({
      where: {
        BarberShop: {
          some: {
            id: barberShop.id
          }
        }
      }
    });

    return NextResponse.json({ clients, total: totalCount, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
