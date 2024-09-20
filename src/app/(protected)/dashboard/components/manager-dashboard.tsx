
import { useState, useEffect } from "react";
import axios from "axios";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { ClientColumn } from "@/@types";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";

export const ManagerDashboard = () => {
  const [clients, setClients] = useState<ClientColumn[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalClients, setTotalClients] = useState(0);
  const router = useRouter();
  const localStorage = new LocalStorage();
  const managerServices = new ManagerService(localStorage);

  useEffect(() => {
    managerServices.getBarbers(page, limit).then(response => {
      setClients(response.barbers);
      setTotalClients(response.total);
    });
  }, [page, limit]);
  
  console.log(clients);
  
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

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Usuários (${totalClients})`}
          description="Gerenciamento de usuários"
        />
        <Button onClick={() => router.push(`/dashboard/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
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
