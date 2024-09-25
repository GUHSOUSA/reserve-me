"use client";
import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { ClientServices } from "@/services/front/clientServices";
import { LocalStorage } from "@/infra";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, startOfToday, addWeeks, subWeeks } from "date-fns";
import { BarberShopContext } from "@/context/barberShopContext";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const AppointmentBarberPage = ({
  params,
}: {
  params: { cutId: string; subId: string };
}) => {
  const { barberShop, barbers, haircuts } = useContext(BarberShopContext);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false); // Pop-up para adicionar informações do usuário
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para indicar se está criando o agendamento
  const localStorage = new LocalStorage();
  const clientServices = new ClientServices(localStorage);
  const router = useRouter();

  const today = startOfToday();
  const selectedHaircut = haircuts.find(
    (haircut) => haircut.id === params.cutId
  );

  useEffect(() => {
    // Função assíncrona para buscar os dados do usuário
    const fetchUser = async () => {
      const user = await localStorage.get<{ name: string; email: string }>(
        "clientInfo"
      );

      if (!user || !user.email || !user.name) {
        // Verifica se os dados estão ausentes
        setShowUserPopup(true); // Se os dados estiverem ausentes, exibe o pop-up
      } else {
        setUserDetails(user); // Caso os dados existam, salva-os no estado
      }
    };

    fetchUser(); // Chama a função assíncrona para buscar o usuário

    // Define a semana atual se houver barbeiros e barbearia
    if (barbers.length > 0 && barberShop) {
      const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
      setCurrentWeek(days);
    }
  }, [barbers, barberShop]); // Dependências do useEffect

  const handleBarberSelection = (barberId: number) => {
    setSelectedBarber(barberId);
  };

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    if (selectedBarber && barberShop) {
      setLoading(true);
      clientServices
        .getBarberAvailability(
          selectedBarber,
          barberShop.id,
          format(date, "yyyy-MM-dd"),
          params.cutId
        )
        .then((times) => {
          setAvailability(times);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleFocusInput = () => {
    // Ajuste a posição do dialog quando o teclado for aberto
    window.scrollTo(0, 0);
  };

  const handleCreateAppointment = async () => {
    if (selectedBarber && selectedDate && selectedTime && userDetails) {
      const localDateTime = new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00`
      );
      const utcDateTimeString = localDateTime.toISOString(); // Converte para UTC
      setIsSubmitting(true); // Ativa o estado de loading no botão de confirmação

      try {
        await clientServices.createAppointmentWithSubId({
          barberId: selectedBarber,
          haircutId: params.cutId,
          appointmentTime: utcDateTimeString,
          clientId: userDetails.email,
          clientName: userDetails.name,
        });

        // Exibe toast de sucesso
        toast.success("Agendamento criado com sucesso!");

        // Redireciona após confirmar
        router.push(`/${params.subId}/agendamentos`);
      } catch (error) {
        // Tratar erro e exibir toast de erro
        toast.error("Ocorreu um erro ao criar o agendamento.");
      } finally {
        setIsSubmitting(false); // Desativa o loading após a operação
      }
    }
  };

  const handleNextWeek = () => {
    const nextWeek = currentWeek.map((day) => addWeeks(day, 1));
    if (nextWeek[0] <= addWeeks(today, 4)) {
      setCurrentWeek(nextWeek);
    }
  };

  const handlePreviousWeek = () => {
    const previousWeek = currentWeek.map((day) => subWeeks(day, 1));
    if (previousWeek[0] >= today) {
      setCurrentWeek(previousWeek);
    }
  };

  const handleOpenConfirmation = (time: string) => {
    setSelectedTime(time);
    setShowConfirmationPopup(true);
  };

  const handleSaveUserDetails = async () => {
    if (userDetails?.name && userDetails?.email) {
      await localStorage.set("clientInfo", userDetails); // Salva no LocalStorage
      setShowUserPopup(false); // Fecha o pop-up
      toast.success("Informações do usuário salvas com sucesso!"); // Exibe toast de sucesso
    }
  };

  if (!barberShop || barbers.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <div className="p-6 text-center">
        <h1 className="text-md font-semibold">
          Serviço Selecionado: {selectedHaircut?.name}
        </h1>
        <p className="text-sm mb-8">Selecione um profissional</p>
        <div className="flex space-x-6 justify-center">
          {barbers.map((barber) => (
            <div key={barber.id} className="items-center flex flex-col">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  selectedBarber === barber.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => handleBarberSelection(barber.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="text-white">B</span>
              </div>
              <p className="text-[13px]">{barber.name || "Barbeiro"}</p>
            </div>
          ))}
        </div>

        {selectedBarber && (
          <div className="border-t border-b mt-7 pb-6">
            <h2 className="text-md mt-3">Setembro 2024</h2>
            <div className="flex justify-center mt-5 items-center">
              <Button
                size={"icon"}
                variant="ghost"
                onClick={handlePreviousWeek}
              >
                <ChevronLeft size={18} />
              </Button>
              <div className="w-80 grid grid-cols-7 gap-x-2">
                {currentWeek.map((day) => (
                  <div
                    key={day.toString()}
                    className={`border p-4 rounded flex flex-col items-center justify-center h-14 ${
                      selectedDate?.toString() === day.toString()
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleDateSelection(day)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="text-sm">{format(day, "EEE")}</p>
                    <p className="text-sm font-semibold">{format(day, "dd")}</p>
                  </div>
                ))}
              </div>
              <Button size={"icon"} variant="ghost" onClick={handleNextWeek}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {selectedDate && availability.length > 0 && (
          <>
            {!loading ? (
              <div className="mt-8">
              <h2 className="text-md text-gray-600 mb-4">
                Selecione o Horário
              </h2>
              <div className="grid grid-cols-7 gap-4">
                {availability.map((slot) => (
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    key={slot}
                    onClick={() => handleOpenConfirmation(slot)}
                    className="p-1 text-sm rounded-3xl border"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <ClipLoader className="mt-8" color="#3498db" size={50} />
          )}
        </>
      )}
    </div>

    {/* Popup de confirmação de agendamento */}
    <Dialog
      open={showConfirmationPopup}
      onOpenChange={setShowConfirmationPopup}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmação de Agendamento</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>Serviço: {selectedHaircut?.name}</p>
          <p>
            Barbeiro: {barbers.find((b) => b.id === selectedBarber)?.name}
          </p>
          <p>Data: {selectedDate && format(selectedDate, "dd/MM/yyyy")}</p>
          <p>Horário: {selectedTime}</p>
          <p>Nome: {userDetails?.name}</p>
          <p>Email: {userDetails?.email}</p>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleCreateAppointment}
            disabled={isSubmitting} // Desabilita o botão se estiver carregando
          >
            {isSubmitting ? <ClipLoader size={20} color="#fff" /> : "Confirmar"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowConfirmationPopup(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Popup para adicionar/atualizar informações do usuário */}
    <Dialog open={showUserPopup} onOpenChange={setShowUserPopup}>
      <DialogContent style={{ marginTop: "10vh" }}>
        <DialogHeader>
          <DialogTitle>Insira suas informações</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="Nome"
            value={userDetails?.name || ""}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                name: e.target.value || "", // Garante que name nunca seja undefined
              }))
            }
            onFocus={handleFocusInput}
            className="mb-4"
          />
          <Input
            placeholder="E-mail"
            value={userDetails?.email || ""}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                email: e.target.value || "", // Garante que email nunca seja undefined
              }))
            }
            onFocus={handleFocusInput}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={handleSaveUserDetails}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);
};

export default AppointmentBarberPage;

