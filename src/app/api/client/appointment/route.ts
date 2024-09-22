import { NextResponse } from "next/server";
import db from "@/lib/db";
import { parseISO, addMinutes, isBefore, isAfter, set, isEqual } from 'date-fns';

export async function POST(req: Request) {
  console.log('=== Start createAppointment ===');
  
  const { barberId, haircutId, appointmentTime, clientId, clientName } = await req.json();
  console.log('Request data:', { barberId, haircutId, appointmentTime, clientId, clientName });

  if (!barberId || !haircutId || !appointmentTime || !clientId) {
    console.log('Missing required fields');
    return NextResponse.json({ error: 'Barbeiro, tipo de corte, horário e cliente são obrigatórios' }, { status: 400 });
  }

  try {
    // Verifica se o barbeiro existe
    const barber = await db.barber.findUnique({
      where: { id: parseInt(barberId) },
      include: { BarberShop: true }
    });

    if (!barber) {
      console.log('Barber not found:', barberId);
      return NextResponse.json({ error: 'Barbeiro não encontrado' }, { status: 404 });
    }
    console.log('Barber found:', barber);

    // Verifica o tipo de corte e sua duração
    const haircut = await db.haircut.findUnique({
      where: { id: haircutId }
    });

    if (!haircut) {
      console.log('Haircut not found:', haircutId);
      return NextResponse.json({ error: 'Tipo de corte não encontrado' }, { status: 404 });
    }
    console.log('Haircut found:', haircut);

    const haircutDuration = haircut.duration;
    const appointmentStart = parseISO(appointmentTime);
    const appointmentEnd = addMinutes(appointmentStart, haircutDuration);

    // Verifica se o horário está dentro do expediente
    const startHour = 9;
    const endHour = 17;
    const openTime = set(appointmentStart, { hours: startHour, minutes: 0 });
    const closeTime = set(appointmentStart, { hours: endHour, minutes: 0 });

    if (isBefore(appointmentStart, openTime) || isAfter(appointmentEnd, closeTime)) {
      console.log('Appointment time is outside business hours');
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
      console.log('Conflict detected with existing appointment');
      return NextResponse.json({ error: 'Horário indisponível' }, { status: 409 });
    }

    // Verifica se o cliente já existe
    let client = await db.client.findUnique({
      where: { phoneNumber: clientId }
    });

    if (!client) {
      console.log('Client not found, creating new client:', clientId);
      client = await db.client.create({
        data: {
          phoneNumber: clientId,
          name: clientName || null
        }
      });
      console.log('New client created:', client);
    }

    // Criação do agendamento
    console.log('Attempting to create appointment...');
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

    console.log('Appointment created:', appointment);
    return NextResponse.json({ message: 'Agendamento criado com sucesso', appointment }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating appointment:', error.message || error);
    return NextResponse.json({ error: 'Erro interno ao criar o agendamento', details: error.message || error }, { status: 500 });
  }
}
