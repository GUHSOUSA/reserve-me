"use client";
import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { Haircut } from "@/@types"; // Tipagem para cortes de cabelo
import { BarberServices } from "@/services/front/barberServices";
import { LocalStorage } from "@/infra";
import { Loader } from "@/components/loader";
import { columns } from "./components/haircut-columns";

const HaircutPage = () => {
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalHaircuts, setTotalHaircuts] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  useEffect(() => {
    setLoading(true);
    barberServices.getHaircuts("barberShopId", page, limit).then(response => {
      setHaircuts(response.haircuts);
      setTotalHaircuts(response.total);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [page, limit]);

  const totalPages = Math.ceil(totalHaircuts / limit);

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
        <Heading title={`Cortes de Cabelo (${totalHaircuts})`} description="Gerenciamento de cortes de cabelo" />
        <Button onClick={() => router.push(`/barber-shop/haircut/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={haircuts}
        total={totalHaircuts}
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
export default HaircutPage;