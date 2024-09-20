import { Appointment } from "./appointment"
import { Barber } from "./barber"
import { Haircut } from "./haircut"

export type BarberShop = {
  id: string,             // Identificador único da barbearia
  name: string,           // Nome da barbearia
  subId: number,          // SubID de 4 dígitos
  active: boolean,        // Status de ativação da barbearia (ativa ou inativa)
  userId: string,         // ID do usuário que é dono da barbearia
  paymentType?: string,   // Tipo de pagamento aceito (PIX, Dinheiro, etc.)
  createdAt: Date,        // Data de criação da barbearia
  updatedAt: Date,        // Data de última atualização da barbearia
  openingTime?: string,   // Horário de abertura da barbearia (opcional)
  closingTime?: string,   // Horário de fechamento da barbearia (opcional)
  barbers: Barber[],      // Lista de barbeiros associados à barbearia
  haircut: Haircut[],     // Lista de cortes de cabelo oferecidos
  appointments: Appointment[] // Lista de agendamentos da barbearia
}
