import { Barber } from "./barber";
import { BarberShop } from "./barberShop";
import { Haircut } from "./haircut";

export type Appointment = {
  id: string,             // Identificador único do agendamento
  appointmentTime: Date,  // Data e hora do agendamento
  duration: number,       // Duração do agendamento em minutos
  clientId: string,       // ID do cliente que fez o agendamento
  barberId: number,       // ID do barbeiro que fará o atendimento
  barberShopId: string,   // ID da barbearia onde o agendamento será realizado
  haircutId?: string,     // ID do corte de cabelo escolhido (opcional)
  barber: Barber,         // Barbeiro responsável pelo agendamento
  barberShop: BarberShop, // Barbearia onde o agendamento será realizado
  haircut?: Haircut,      // Corte de cabelo escolhido (opcional)
}
