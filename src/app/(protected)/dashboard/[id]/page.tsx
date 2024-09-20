"use client";
import { useEffect, useState } from "react";
import { ClientForm } from "./components/client-form";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";
import { User } from "@/@types";

const ClientPage = ({ params }: { params: { id: string } }) => {
  const [barber, setBarber] = useState<User | null>(null); 
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
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientForm initialData={barber} />
      </div>
    </div>
  );
};

export default ClientPage;
