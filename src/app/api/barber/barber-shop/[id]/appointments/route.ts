import { NextResponse } from "next/server";
import db from "@/lib/db";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    // Verifica se a barbearia existe e pertence ao usuário
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
          gte: now, // Agendamentos futuros
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      },
      include: {
        haircut: true,
        barber: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        appointmentTime: 'asc',
      },
    });

    // Busca paginada dos agendamentos concluídos (histórico)
    const pastAppointments = await db.appointment.findMany({
      where: {
        barberShopId: params.id,
        appointmentTime: {
          lt: now, // Agendamentos passados
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      },
      include: {
        haircut: true,
        barber: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        appointmentTime: 'desc',
      },
    });

    const totalCountFuture = await db.appointment.count({
      where: {
        barberShopId: params.id,
        appointmentTime: {
          gte: now,
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      }
    });

    const totalCountPast = await db.appointment.count({
      where: {
        barberShopId: params.id,
        appointmentTime: {
          lt: now,
        },
        OR: [
          { barber: { name: { contains: searchQuery, mode: 'insensitive' } } },
          { haircut: { name: { contains: searchQuery, mode: 'insensitive' } } },
        ]
      }
    });

    return NextResponse.json({ 
      futureAppointments, 
      pastAppointments,
      totalFuture: totalCountFuture, 
      totalPast: totalCountPast, 
      page, 
      limit 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
