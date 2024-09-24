import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/@types";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
  },
  // Outras colunas que você quiser exibir
];
