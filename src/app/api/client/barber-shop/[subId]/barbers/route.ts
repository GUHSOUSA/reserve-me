import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request, { params }: { params: { subId: string } }) {
  try {
    const barberShop = await db.barberShop.findUnique({
      where: { subId: parseInt(params.subId, 10) }, // Busca pelo subId
      select: { id: true } // Retorna apenas o id da barbearia
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    const barbers = await db.barber.findMany({
      where: {
        BarberShop: {
          some: { id: barberShop.id } // Usa o barberShopId obtido pela consulta
        }
      }
    });

    return NextResponse.json( barbers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
