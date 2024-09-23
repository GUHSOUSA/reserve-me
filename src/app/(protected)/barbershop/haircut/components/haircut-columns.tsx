import { ColumnDef } from "@tanstack/react-table";
import { Haircut } from "@/@types";
import { HaircutActions } from "./cell-action"; // Nome mais descritivo para o componente de ações

export const haircutColumns: ColumnDef<Haircut>[] = [
  {
    accessorKey: "name",
    header: "Nome do Corte",
  },
  {
    accessorKey: "duration",
    header: "Duração (min)",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    id: "actions",
    cell: ({ row }) => <HaircutActions data={row.original} />, // Nome mais descritivo
  },
];
