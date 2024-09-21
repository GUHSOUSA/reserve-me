"use client";
import { useEffect, useState } from "react";
import { ClientForm } from "./components/client-form";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";
import { ClientColumn } from "@/@types";
import { Loader } from "@/components/loader";

const ClientPage = ({ params }: { params: { id: string } }) => {
  const [barber, setBarber] = useState<ClientColumn | null>(null); 
  const [loading, setLoading] = useState(true); 
  const localStorage = new LocalStorage();
  const managerServices = new ManagerService(localStorage);

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const response = await managerServices.getBarberById(params.id);
        setBarber(response);
      } catch (err) {
        setBarber(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBarber();
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
        <ClientForm initialData={barber} />
      </div>
    </div>
  );
};

export default ClientPage;
