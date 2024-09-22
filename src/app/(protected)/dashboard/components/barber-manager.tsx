import { useState, useEffect } from "react";
import { BarberServices } from "@/services/front/barberServices";
import { Appointment } from "@/@types";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/infra";

const AppointmentsPage = () => {
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [totalFutureAppointments, setTotalFutureAppointments] = useState(0);
  const [totalPastAppointments, setTotalPastAppointments] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  useEffect(() => {
    setLoading(true);
    barberServices.getAppointments( page, limit)
      .then(response => {
        setFutureAppointments(response.futureAppointments);
        setPastAppointments(response.pastAppointments);
        setTotalFutureAppointments(response.totalFuture);
        setTotalPastAppointments(response.totalPast);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, limit]);

  const totalFuturePages = Math.ceil(totalFutureAppointments / limit);
  const totalPastPages = Math.ceil(totalPastAppointments / limit);

  const handleNextPage = () => {
    if (page < totalFuturePages || page < totalPastPages) {
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
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Próximos Agendamentos</h1>
      </div>

      {futureAppointments.length === 0 ? (
        <p>Nenhum agendamento futuro</p>
      ) : (
        <div className="space-y-4">
          {futureAppointments.map(appointment => (
            <div key={appointment.id} className="p-4 border rounded-md">
              <p><strong>Barbeiro:</strong> {appointment.barber.name}</p>
              <p><strong>Corte:</strong> {appointment.haircut?.name}</p>
              <p><strong>Data:</strong> {new Date(appointment.appointmentTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 mt-8">
        <h1 className="text-xl font-semibold">Agendamentos Passados</h1>
      </div>

      {pastAppointments.length === 0 ? (
        <p>Nenhum agendamento passado</p>
      ) : (
        <div className="space-y-4">
          {pastAppointments.map(appointment => (
            <div key={appointment.id} className="p-4 border rounded-md">
              <p><strong>Barbeiro:</strong> {appointment.barber.name}</p>
              <p><strong>Corte:</strong> {appointment.haircut?.name}</p>
              <p><strong>Data:</strong> {new Date(appointment.appointmentTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={page >= totalFuturePages && page >= totalPastPages}>
          Próximo
        </Button>
      </div>
    </>
  );
};

export default AppointmentsPage;
