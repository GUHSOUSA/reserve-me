"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/@types";
import { format, isToday, isTomorrow } from "date-fns"; // Importa as funções necessárias
import { ptBR } from "date-fns/locale"; // Para formatar em português

// Função para formatar a data e hora
const formatAppointmentTime = (date: Date) => {
  if (isToday(date)) {
    return `Hoje às ${format(date, "HH:mm", { locale: ptBR })}`;
  } else if (isTomorrow(date)) {
    return `Amanhã às ${format(date, "HH:mm", { locale: ptBR })}`;
  } else {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorFn: (row) => row.barber.name, // Acessando o nome do barbeiro
    id: "barber", // Definindo um id
    header: "Barbeiro",
  },
  {
    accessorFn: (row) => row.haircut?.name,
    id: "haircut", // Definindo um id
    header: "Corte",
  },
  {
    accessorFn: (row: Appointment) => {
      const appointmentDate = new Date(row.appointmentTime);
      return formatAppointmentTime(appointmentDate); // Chama a função para formatar a data
    },
    id: "appointmentTime", // Definindo um id
    header: "Horário",
    cell: (info) => info.getValue(), // Exibe o valor já formatado
  }
];
