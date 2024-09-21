import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action"; // Ações comuns
import { Barber } from "@/@types";

export const columns: ColumnDef<Barber>[] = [
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
    cell: ({ row }) => <CellAction data={row.original} />, // Reutilizando o componente de ações
  },
];
