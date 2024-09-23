import { ColumnDef } from "@tanstack/react-table";
import { Barber } from "@/@types";
import { BarberActions } from "./cell-action"; // Nome mais descritivo para o componente de ações

export const barberColumns: ColumnDef<Barber>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "imageUrl",
    header: "Imagem",
  },
  {
    id: "actions",
    cell: ({ row }) => <BarberActions data={row.original} />, // Nome mais descritivo
  },
];
