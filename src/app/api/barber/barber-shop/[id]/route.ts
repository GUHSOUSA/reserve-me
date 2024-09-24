import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Endpoint para pegar todos os clientes de uma barbearia
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Extraindo o userId do dono da barbearia (pode ser passado como parâmetro ou extraído de um token de autenticação)
    
    // Buscando a barbearia do dono
    const barberShop = await db.barberShop.findUnique({
      where: { id: params.id },
      include: {
        clients: true, // Inclui os clientes que pertencem à barbearia
      },
    });
    

    if (!barberShop) {
      return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Retorna os clientes da barbearia
    return NextResponse.json({ clients: barberShop.clients }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar os clientes', details: error.message || error }, { status: 500 });
  }
}
