import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const searchQuery = searchParams.get('search') || ''; // Adicionando busca por nome do barbeiro ou corte
  const offset = (page - 1) * limit;

  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    const barberShop = await db.barberShop.findUnique({
      where: { userId: decoded.id }
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }
    const now = new Date();
    const futureAppointments = await db.appointment.findMany({
      where: {
        barberShopId: barberShop.id,
        appointmentTime: {
          gte: now,
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      },
      include: {
        client: {
          select: {
            name: true, // Selecionando apenas o nome do cliente
          }
        },
        haircut: {
          select: {
            name: true, // Selecionando apenas o nome do corte
          }
        },
        barber: {
          select: {
            name: true, // Selecionando apenas o nome do barbeiro
          }
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        appointmentTime: 'asc',
      },
    });
    const totalCountFuture = await db.appointment.count({
      where: {
        barberShopId: barberShop.id,
        appointmentTime: {
          gte: now,
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      }
    });
    return NextResponse.json({ 
      futureAppointments, 
      totalFuture: totalCountFuture, 
      page, 
      limit 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
