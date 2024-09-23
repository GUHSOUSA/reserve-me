import { NextResponse } from "next/server";
import db from "@/lib/db";
import { parseISO, addMinutes, isBefore, isAfter, set, isEqual } from 'date-fns';

export async function POST(req: Request) {
  
  const { barberId, haircutId, appointmentTime, clientId, clientName } = await req.json();

  if (!barberId || !haircutId || !appointmentTime || !clientId) {
    return NextResponse.json({ error: 'Barbeiro, tipo de corte, horário e cliente são obrigatórios' }, { status: 400 });
  }

  try {
    // Verifica se o barbeiro existe
    const barber = await db.barber.findUnique({
      where: { id: parseInt(barberId) },
      include: { BarberShop: true }
    });

    if (!barber) {
      return NextResponse.json({ error: 'Barbeiro não encontrado' }, { status: 404 });
    }

    // Verifica o tipo de corte e sua duração
    const haircut = await db.haircut.findUnique({
      where: { id: haircutId }
    });

    if (!haircut) {
      return NextResponse.json({ error: 'Tipo de corte não encontrado' }, { status: 404 });
    }

    const haircutDuration = haircut.duration;
    const appointmentStart = parseISO(appointmentTime);
    const appointmentEnd = addMinutes(appointmentStart, haircutDuration);

    // Verifica se o horário está dentro do expediente
    const startHour = 9;
    const endHour = 17;
    const openTime = set(appointmentStart, { hours: startHour, minutes: 0 });
    const closeTime = set(appointmentStart, { hours: endHour, minutes: 0 });

    if (isBefore(appointmentStart, openTime) || isAfter(appointmentEnd, closeTime)) {
      return NextResponse.json({ error: 'Horário fora do expediente da barbearia' }, { status: 400 });
    }

    // Verifica conflitos de horários
    const existingAppointments = await db.appointment.findMany({
      where: {
        barberId: parseInt(barberId),
        appointmentTime: { gte: appointmentStart }
      }
    });

    const hasConflict = existingAppointments.some(appointment => {
      const existingStart = new Date(appointment.appointmentTime);
      const existingEnd = addMinutes(existingStart, appointment.duration);
      return (
        (isBefore(appointmentStart, existingEnd) && isAfter(appointmentEnd, existingStart)) || 
        isEqual(appointmentStart, existingStart)
      );
    });

    if (hasConflict) {
      return NextResponse.json({ error: 'Horário indisponível' }, { status: 409 });
    }

    // Verifica se o cliente já existe
    let client = await db.client.findUnique({
      where: { phoneNumber: clientId }
    });

    if (!client) {
      client = await db.client.create({
        data: {
          phoneNumber: clientId,
          name: clientName || null
        }
      });
    }

    // Criação do agendamento
    const appointment = await db.appointment.create({
      data: {
        appointmentTime: appointmentStart,
        duration: haircutDuration,
        clientId: client.id,
        barberId: parseInt(barberId),
        haircutId,
        barberShopId: barber.BarberShop[0].id
      }
    });

    return NextResponse.json({ message: 'Agendamento criado com sucesso', appointment }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Erro interno ao criar o agendamento', details: error.message || error }, { status: 500 });
  }
}
