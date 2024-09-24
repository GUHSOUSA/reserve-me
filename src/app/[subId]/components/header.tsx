import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarberShopContext } from "@/context/barberShopContext";
import { useContext } from "react";
export const Header = () => {
  const { barberShop } = useContext(BarberShopContext);

  return (
    <header className="stycky top-0 h-20 flex items-center justify-between border-b-2 text-neutral-400 lg:z-50 pr-2">
      <div className="flex flex-row gap-4 items-center p-2">
        <Avatar>
          <AvatarImage src="https://marketplace.canva.com/EAE_pF9jQO8/1/0/1600w/canva-logotipo-circular-vintage-floral-terracota-para-estética-e-beleza-isR0zH2IodY.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[13px]">Bem vindos(a) ao</p>
          <p className="text-[18px] font-bold">{barberShop?.name}</p>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Meus agendamentos</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirme seu número</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="flex text-start">
                Por favor, escreva abaixo o número de celular usado para acessar
                o serviço
              </p>
              <p className="py-2 flex">Celular (whatsapp) </p>
              <Input />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
