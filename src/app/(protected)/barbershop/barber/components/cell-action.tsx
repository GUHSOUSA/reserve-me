import { Edit, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Barber } from "@/@types";

interface BarberActionsProps {
  data: Barber;
}

export const BarberActions: React.FC<BarberActionsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/barbershop/barber/${data.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Atualizar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
