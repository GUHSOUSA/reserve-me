import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request, { params }: { params: { barberId: string } }) {
  try {
    const availability = await db.barberAvailability.findMany({
      where: { barberId: parseInt(params.barberId, 10) },
      orderBy: { date: 'asc' }
    });

    if (!availability || availability.length === 0) {
      return NextResponse.json({ error: 'Nenhum horário disponível' }, { status: 404 });
    }

    return NextResponse.json({ availability }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
