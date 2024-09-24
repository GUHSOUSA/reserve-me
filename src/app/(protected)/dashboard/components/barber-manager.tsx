import { useState, useEffect } from "react";
import { BarberServices } from "@/services/front/barberServices";
import { Appointment } from "@/@types";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { LocalStorage } from "@/infra";
import { columns } from "./columns-barber";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";

const AppointmentsPage = () => {
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>([]);
  const [totalFutureAppointments, setTotalFutureAppointments] = useState(0);
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
        setTotalFutureAppointments(response.totalFuture);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
      console.log(futureAppointments);
      
  }, [page, limit]);
  const totalFuturePages = Math.ceil(totalFutureAppointments / limit);
  const handleNextPage = () => {
    if (page < totalFuturePages) {
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
     <div className="flex items-center justify-between">
        <Heading
          title={`Agendaentos (${totalFutureAppointments})`}
          description="Gerenciamentos de clientes"
        />
       
      </div>
      <Separator />
      <DataTable
        searchKey="barber"
        columns={columns}
        data={futureAppointments}
        total={totalFutureAppointments}
        page={page}
        pageSize={limit}
        onPageChange={setPage}
      />
      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={page === totalFutureAppointments}>
          Próximo
        </Button>
      </div>
    </>
  );
};
export default AppointmentsPage;