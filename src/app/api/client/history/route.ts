import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    // Busca o cliente pelo e-mail
    const client = await db.client.findUnique({
      where: {
        phoneNumber: email,  // Usando phoneNumber como e-mail
      },
      include: {
        appointments: {
          skip: offset,
          take: limit,
          include: {
            barber: true, // Inclui os detalhes do barbeiro
            barberShop: true, // Inclui os detalhes da barbearia
            haircut: true, // Inclui os detalhes do corte de cabelo
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Contagem total de agendamentos
    const totalCount = await db.appointment.count({
      where: {
        clientId: client.id,
      },
    });

    return NextResponse.json({ appointments: client.appointments, total: totalCount, page, limit }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar histórico de agendamentos', details: error.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const appointmentId = searchParams.get('appointmentId'); // Exige o ID do agendamento

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    if (!appointmentId) {
      return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 });
    }

    // Busca o cliente pelo e-mail
    const client = await db.client.findUnique({
      where: {
        phoneNumber: email,  // Usando phoneNumber como e-mail
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Verifica se o agendamento pertence ao cliente
    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        clientId: client.id,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado ou não pertence ao cliente' }, { status: 404 });
    }

    // Exclui o agendamento
    await db.appointment.delete({
      where: {
        id: appointment.id,
      },
    });

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao excluir agendamento', details: error.message }, { status: 500 });
  }
}