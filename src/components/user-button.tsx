import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Folder } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

// Define the props type for the UserButton component
interface UserButtonProps {
  name: string;
  email: string;
  subId: number;
  onLogout: () => void; // Function type for logout action
}

export const UserButton: React.FC<UserButtonProps> = ({ name, email, subId, onLogout }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback className="bg-sky-500">
            {name ? name.charAt(0) : "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuItem>
          <div className="flex flex-col my-0">
            <div className="text-sm font-semibold text-slate-800">
              {name || "Usuário"}
            </div>
            <div className="text-[12px] font-normal text-slate-500">
              {email || "email@example.com"}
            </div>
          </div>
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem onClick={() => router.push(`/${subId}/agendamentos`)}>
          <Folder className="h-4 w-4 mr-2" />
          Meus Agendamentos
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem onClick={onLogout}>
          <ExitIcon className="h-4 w-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
