"use client";
import { useEffect, useState } from "react";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";
import { Barber } from "@/@types";
import { Loader } from "@/components/loader";
import { BarberForm } from "./components/barberForm";
import { BarberServices } from "@/services/front/barberServices";

const BarberPage = ({ params }: { params: { id: string } }) => {
  const [barber, setbarber] = useState<Barber | null>(null); 
  const [loading, setLoading] = useState(true); 
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  useEffect(() => {
    const fetchbarber = async () => {
      try {
        const response = await barberServices.getBarberById(params.id);
        setbarber(response);
      } catch (err) {
        setbarber(null);
      } finally {
        setLoading(false);
      }
    };
    fetchbarber();
  }, [params.id]);
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="space-y-4">
        <BarberForm initialData={barber} />
      </div>
    </div>
  );
};

export default BarberPage;