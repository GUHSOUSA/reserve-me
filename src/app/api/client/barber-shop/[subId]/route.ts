import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request, { params }: { params: { subId: string } }) {
  try {
    // Buscar a barbearia pelo subId
    const barberShop = await db.barberShop.findUnique({
      where: { subId: parseInt(params.subId, 10) },
    });

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Buscar os barbeiros associados à barbearia
    const barbers = await db.barber.findMany({
      where: {
        BarberShop: {
          some: { id: barberShop.id }
        }
      }
    });

    // Buscar os tipos de corte associados à barbearia
    const haircuts = await db.haircut.findMany({
      where: { barberShopId: barberShop.id }
    });

    // Retornar os dados da barbearia, barbeiros e cortes de cabelo
    return NextResponse.json({ barberShop, barbers, haircuts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
