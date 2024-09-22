import { NextResponse } from "next/server";
import db from "@/lib/db";
import { parseISO, addMinutes, isWithinInterval, set, format, isAfter, isBefore } from "date-fns";
export async function GET(req: Request, { params }: { params: { id: string } }) {
  console.log('=== Start getAvailability ===');

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const haircutId = searchParams.get('haircutId');
  console.log('Request data:', { date, haircutId });

  if (!date || !haircutId) {
    console.log('Missing required fields');
    return NextResponse.json({ error: 'A data e o tipo de corte são obrigatórios' }, { status: 400 });
  }

  try {
    // Verifica se o barbeiro existe
    const barber = await db.barber.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!barber) {
      console.log('Barber not found:', params.id);
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
    const startHour = 9;
    const endHour = 17;
    const intervalMinutes = 30;
    const selectedDate = parseISO(date);
    console.log('Selected date:', selectedDate);

    // Gera a lista de horários possíveis dentro do expediente
    let availableTimes: Date[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = set(selectedDate, { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
        availableTimes.push(time);
      }
    }
    console.log('Generated available times:', availableTimes);

    // Busca agendamentos existentes
    const appointments = await db.appointment.findMany({
      where: {
        barberId: parseInt(params.id),
        appointmentTime: {
          gte: set(selectedDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
          lt: set(selectedDate, { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 })
        }
      },
      select: {
        appointmentTime: true,
        duration: true,
      }
    });
    console.log('Existing appointments:', appointments);

    // Verifica conflitos de horário
    const continuousAvailableTimes: Date[] = [];
    for (let i = 0; i < availableTimes.length; i++) {
      const startTime = availableTimes[i];
      const endTime = addMinutes(startTime, haircutDuration);

      const hasConflict = appointments.some(appointment => {
        const appointmentStart = new Date(appointment.appointmentTime);
        const appointmentEnd = addMinutes(appointmentStart, appointment.duration);

        // Verifica conflitos apenas se o horário do corte de cabelo entrar em conflito diretamente
        return (
          (startTime >= appointmentStart && startTime < appointmentEnd) ||
          (endTime > appointmentStart && endTime <= appointmentEnd)
        );
      });

      if (!hasConflict && endTime.getHours() <= endHour) {
        continuousAvailableTimes.push(startTime);
      }
    }

    console.log('Available times:', continuousAvailableTimes);
    const formattedTimes = continuousAvailableTimes.map(time => format(time, 'HH:mm'));

    return NextResponse.json({ availableTimes: formattedTimes }, { status: 200 });

  } catch (error) {
    console.error('Error in getAvailability:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}