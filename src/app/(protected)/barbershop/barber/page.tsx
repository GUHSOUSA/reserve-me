"use client";
import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { Barber } from "@/@types"; // Tipagem para barbeiros
import { BarberServices } from "@/services/front/barberServices";
import { LocalStorage } from "@/infra";
import { Loader } from "@/components/loader";
import { columns } from "./components/barber-columns";

const BarberPage = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalBarbers, setTotalBarbers] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  useEffect(() => {
    setLoading(true);
    barberServices.getBarbers("barberShopId", page, limit).then(response => {
      setBarbers(response.barbers);
      setTotalBarbers(response.total);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [page, limit]);

  const totalPages = Math.ceil(totalBarbers / limit);

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
        <Heading title={`Barbeiros (${totalBarbers})`} description="Gerenciamento de barbeiros" />
        <Button onClick={() => router.push(`/barbershop/barber/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={barbers}
        total={totalBarbers}
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
export default BarberPage;