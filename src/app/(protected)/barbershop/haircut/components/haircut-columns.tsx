import { ColumnDef } from "@tanstack/react-table";
import { Haircut } from "@/@types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Haircut>[] = [
  {
    accessorKey: "name",
    header: "Nome do Corte",
  },
  {
    accessorKey: "duration",
    header: "Duração (min)",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />, // Reutilizando o componente de ações
  },
];
