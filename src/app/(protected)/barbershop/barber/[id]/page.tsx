"use client";
import { useEffect, useState } from "react";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";
import { ClientColumn, Haircut } from "@/@types";
import { Loader } from "@/components/loader";
import { BarberForm } from "./components/haircutForm";

const HairCutPage = ({ params }: { params: { id: string } }) => {
  const [hairCut, sethairCut] = useState<Haircut | null>(null); 
  const [loading, setLoading] = useState(true); 
  const localStorage = new LocalStorage();
  const managerServices = new ManagerService(localStorage);

  useEffect(() => {
    const fetchhairCut = async () => {
      try {
        const response = await managerServices.getHaircutById(params.id);
        sethairCut(response);
      } catch (err) {
        sethairCut(null);
      } finally {
        setLoading(false);
      }
    };
    fetchhairCut();
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
        <BarberForm initialData={hairCut} />
      </div>
    </div>
  );
};

export default HairCutPage;