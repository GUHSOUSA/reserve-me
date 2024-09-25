"use client";
import { useState, useEffect } from "react";
import { ClientServices } from "@/services/front/clientServices";
import { Appointment } from "@/@types";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/infra";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import Header from "../components/header";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";

const localStorage = new LocalStorage;
const clientServices = new ClientServices(localStorage);

const ClientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);  // Limite de resultados por página
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const route = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await clientServices.getClientAppointmentsByEmail(page, limit);
        setAppointments(response.appointments);
        setTotalAppointments(response.total);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit]);

  const totalPages = Math.ceil(totalAppointments / limit);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setOpen(true);  // Abre o modal para confirmar a exclusão
  };

  const onDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      setModalLoading(true);
      await clientServices.deleteAppointmentByEmail(appointmentToDelete);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== appointmentToDelete)
      );
      toast.success("Agendamento excluido com sucesso!");

    } catch (error: any) {
      toast.error("Erro ao excluir agendamento:", error);

      console.error("Erro ao excluir agendamento:", error);
    } finally {
      setModalLoading(false);
      setOpen(false);  // Fecha o modal após a exclusão
      setAppointmentToDelete(null);  // Reseta o estado do agendamento a ser excluído
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={modalLoading}
      />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Histórico de Agendamentos</h1>
        <div className="appointment-list grid gap-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 shadow-md rounded-lg flex flex-row justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-600">
                    Data:{" "}
                    <span className="font-semibold">
                      {format(new Date(appointment.appointmentTime), "dd/MM/yyyy HH:mm")}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Duração: <span className="font-semibold">{appointment.duration} minutos</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Barbeiro: <span className="font-semibold">{appointment.barber?.name || "Não informado"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Barbearia: <span className="font-semibold">{appointment.barberShop?.name || "Não informado"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Corte: <span className="font-semibold">{appointment.haircut?.name || "Não informado"}</span>
                  </p>
                </div>
                <Button
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  <Trash color="white" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Nenhum agendamento encontrado.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Próximo
          </Button>
        </div>
      </div>
    </>
  );
};

export default ClientAppointmentHistory;
