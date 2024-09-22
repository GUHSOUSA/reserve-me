"use client";
import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { ClientServices } from "@/services/front/clientServices";
import { LocalStorage } from "@/infra";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, startOfToday, addWeeks, subWeeks, isValid } from "date-fns";
import { BarberShopContext } from "@/context/barberShopContext";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import { ClipLoader } from "react-spinners";

const AppointmentBarberPage = ({ params }: { params: { cutId: string, subId: string } }) => {
  const { barberShop, barbers, haircuts } = useContext(BarberShopContext);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const clientServices = new ClientServices(new LocalStorage());
  const router = useRouter();

  const today = startOfToday();
  const selectedHaircut = haircuts.find((haircut) => haircut.id === params.cutId);


  useEffect(() => {
    if (barbers.length > 0 && barberShop) {
      const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
      setCurrentWeek(days);
    }
  }, [barbers, barberShop]);

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

  const handleCreateAppointment = async (time: string) => {
    if (selectedBarber && selectedDate) {
      const localDateTimeString = `${format(selectedDate, "yyyy-MM-dd")}T${time}:00`;

      try {
        await clientServices.createAppointmentWithSubId({
          barberId: selectedBarber,
          haircutId: params.cutId,
          appointmentTime: localDateTimeString,
          clientId: "cliente@example.com",
        });
      } catch (error) {
        console.error("Erro ao criar o agendamento", error);
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

  if (!barberShop || barbers.length === 0) {
    return <Loader />;
  }

  return (
    <>
    <Header />
    <div className="p-6 text-center">
      <h1 className="text-md font-semibold">Serviço Selecionado: {selectedHaircut?.name}</h1>
      <p className="text-sm mb-8">Selecione um profissional</p>
      <div className="flex space-x-6 justify-center">
        {barbers.map((barber) => (
          <div key={barber.id} className=" items-center flex flex-col">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                selectedBarber === barber.id ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => handleBarberSelection(barber.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Placeholder para a foto */}
              <span className="text-white">B</span>
            </div>
            <p className="text-[13px]">{barber.name || "Barbeiro"}</p>
          </div>
        ))}
      </div>

      {/* Campo para selecionar a data */}
      {!selectedBarber && (
        <div className="border-t border-b py-10 mt-7">
          <h2 className="text-md text-slate-700">
            Selecione um profissional para visualizarr seu horario
          </h2>
        </div>
      )}
      
      {/* Exibição do calendário semanal */}
      {selectedBarber && (
        <div className="border-t border-b mt-7 pb-6">
          <h2 className="text-md mt-3">
            setembro 2024
        </h2>
          <div className="flex justify-center mt-5 items-center">
            <Button size={"icon"} variant="ghost" onClick={handlePreviousWeek}>
              <ChevronLeft size={18} />
            </Button>
            <div className="w-80 grid grid-cols-7 gap-x-2">
            {currentWeek.map((day) => (
              <div
                key={day.toString()}
                className={`border p-4 rounded flex flex-col items-center justify-center h-14 ${
                  selectedDate?.toString() === day.toString()
                    ? "bg-blue-500 text-white"
                    : format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                    
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

      {/* Selecione o horário disponível */}
      {selectedDate && availability.length > 0 && (
        <> 
        {!loading ? (<div className="mt-8">
          <h2 className="text-md text-gray-600 mb-4">Selecione o Horário</h2>
          <div className="grid grid-cols-7 gap-4">
            {availability.map((slot) => (
              <Button
              variant={"outline"}
              size={"sm"}
                key={slot}
                onClick={() => handleCreateAppointment(slot)}
                className="p-1 text-sm rounded-3xl border"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>): <ClipLoader className="mt-8" color="#3498db" size={50} />}
        </>
       
      )}

      
    </div>
    </>
  );
};

export default AppointmentBarberPage;
