"use client";
import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { Client } from "@/@types"; // Tipagem para os clientes
import { BarberServices } from "@/services/front/barberServices";
import { LocalStorage } from "@/infra";
import { Loader } from "@/components/loader";
import { clientColumns } from "./components/client-columns";

const ClientPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  useEffect(() => {
    setLoading(true);
    barberServices
      .getClients(page, limit)
      .then((response) => {
        setClients(response.clients);
        setTotalClients(response.total);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, limit]);

  const totalPages = Math.ceil(totalClients / limit);

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
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Clientes (${totalClients})`}
          description="Gerenciamento de clientes"
        />
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={clientColumns} // Colunas para clientes
        data={clients}
        total={totalClients}
        page={page}
        pageSize={limit}
        onPageChange={setPage}
      />
      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={page === 1}>
          Anterior
        </Button>
        <Button onClick={handleNextPage} disabled={page === totalPages}>
          Próximo
        </Button>
      </div>
    </>
  );
};

export default ClientPage;
