import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarberShopContext } from "@/context/barberShopContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { LocalStorage } from "@/infra";
import { UserButton } from "@/components/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
export const Header = () => {
  const { barberShop } = useContext(BarberShopContext);
  const route = useRouter();
  const localStorage = new LocalStorage();
  const handleFocusInput = () => {
    // Ajuste a rolagem para garantir que o diálogo esteja visível quando o teclado abrir
    window.scrollTo(0, 0);
  };

  const handleBlurInput = () => {
    // Retorne a rolagem ao estado normal (opcional)
    window.scrollTo(0, 0); // Pode ajustar de acordo com seu layout
  };
  // Estado para armazenar as informações do usuário
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await localStorage.get<{
        name: string;
        email: string;
      }>("clientInfo"); // Verifica se o usuário está salvo no LocalStorage
      if (storedUser && storedUser.email && storedUser.name) {
        setUser(storedUser); // Atualiza o estado se o usuário estiver logado
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await localStorage.set("clientInfo", {}); // Alternativa: remover item do LocalStorage
    setUser(null);
  };

  return (
    <header className="sticky top-0 h-20 flex items-center justify-between border-b-2 text-neutral-400 lg:z-50 pr-2">
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
      <div className="flex flex-row gap-2 items-center">
        <ThemeToggle />
        {user && user.name && user.email ? (
          <UserButton
            name={user.name}
            email={user.email}
            subId={barberShop?.subId || 0}
            onLogout={handleLogout}
          />
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Meus agendamentos</Button>
            </AlertDialogTrigger>
            <AlertDialogContent style={{ marginTop: "10vh" }}>
              {" "}
              {/* Ajuste a posição inicial */}
              <AlertDialogHeader>
                <AlertDialogTitle>Confirme seus dados</AlertDialogTitle>
                <AlertDialogDescription>
                  <p className="flex text-start">
                    Por favor, escreva abaixo o nome e o e-mail usados para
                    acessar o serviço
                  </p>
                  <p className="py-2 flex">Nome</p>
                  <Input
                    id="nameInput"
                    onFocus={handleFocusInput}
                    onBlur={handleBlurInput} // Restaura ao perder o foco
                  />
                  <p className="py-2 flex">E-mail</p>
                  <Input
                    id="emailInput"
                    onFocus={handleFocusInput}
                    onBlur={handleBlurInput} // Restaura ao perder o foco
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Voltar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const name = (
                      document.getElementById("nameInput") as HTMLInputElement
                    ).value;
                    const email = (
                      document.getElementById("emailInput") as HTMLInputElement
                    ).value;
                    if (name && email) {
                      const userData = { name, email };
                      await localStorage.set("clientInfo", userData); // Salva o usuário no LocalStorage
                      setUser(userData); // Atualiza o estado do usuário
                      route.refresh(); // Redireciona para a página de agendamentos
                    }
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </header>
  );
};
export default Header;
