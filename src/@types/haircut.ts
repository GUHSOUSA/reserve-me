import { Appointment } from "./appointment";

export type Haircut = {
  id: string,             // Identificador único do corte de cabelo
  name: string,           // Nome do corte de cabelo
  duration: number,       // Duração do corte em minutos
  barberShopId: string,   // ID da barbearia que oferece o corte
  appointments: Appointment[], // Lista de agendamentos que envolvem esse corte de cabelo
}
