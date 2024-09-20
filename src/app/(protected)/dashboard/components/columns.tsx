"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ClientColumn } from "@/@types"
export const columns: ColumnDef<ClientColumn>[] = [
  {
    accessorKey: "name", // Nome
    header: "Nome",
  },
  {
    accessorKey: "email", // Nome
    header: "Email",
  },
  {
    accessorKey: "role", // Nome
    header: "Nome",
  },
  {
    accessorKey: "barberShop.active", // Atividade da barbearia
    header: "Situacao",
    cell: ({ row }) => {
      return row.original.barberShop?.active ? "Ativo" : "Inativo"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
