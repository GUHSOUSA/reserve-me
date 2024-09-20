"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ClientColumn } from "@/@types"



export const columns: ColumnDef<ClientColumn>[] = [
  {
    accessorKey: "name", // Nome
    header: "Nome",
  },
  {
    accessorKey: "payment", // Pagamento
    header: "Pagamento",
  },
  {
    accessorKey: "store", // Loja
    header: "Loja",
  },
  {
    accessorKey: "clients", // Clientes
    header: "Clientes",
  },
  {
    accessorKey: "contact",
    header: "Contato",
    cell: ({ row }) => (
      <div className="flex flex-row gap-x-2">
        <Image src="/whats.svg" width="20" height="20" alt="whatsapp link para falar com client" />
        WhatsApp
      </div>
    ),
  },
  {
    accessorKey: "state", // Situação
    header: "Situação",
    cell: ({ row }) => <Badge>{row.original.state}</Badge>, // Acessando corretamente o valor de state
  },  

  {
    accessorKey: "customerSince", // Cliente desde
    header: "Entrou em",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
