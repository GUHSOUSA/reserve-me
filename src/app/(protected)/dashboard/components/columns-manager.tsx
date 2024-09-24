"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action-manager"
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
    header: "Role",
  },
  {
    accessorKey: "barberShop.active", // Atividade da barbearia
    header: "Situacao",
    cell: ({ row }) => {
      return row.original.BarberShop?.active ? "Ativo" : "Inativo"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
