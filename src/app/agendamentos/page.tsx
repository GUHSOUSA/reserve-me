"use client";
import { useState, useEffect } from "react";
import { ClientServices } from "@/services/front/clientServices";
import { Appointment } from "@/@types";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/infra";
import { format } from "date-fns";

const localStorage = new LocalStorage;
const clientServices = new ClientServices(localStorage);

const ClientAppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);  // Limite de resultados por página
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("guigiy");
    
    clientServices.getClientAppointmentsByEmail( page, limit)
      .then(response => {
        setAppointments(response.appointments);
        setTotalAppointments(response.total);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Histórico de Agendamentos</h1>
      <div className="appointment-list grid gap-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="p-4 bg-white shadow-md rounded-lg">
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
          ))
        ) : (
          <p className="text-gray-600">Nenhum agendamento encontrado.</p>
        )}
      </div>

      {/* Pagination */}
      {totalAppointments > limit && (
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
      )}
    </div>
  );
};

export default ClientAppointmentHistory;
