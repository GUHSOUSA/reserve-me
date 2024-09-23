"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import { BarberShop, Barber, Haircut } from "@/@types";
import { ClientServices } from "@/services/front/clientServices";
import { LocalStorage } from "@/infra";

type BarberShopContextProviderProps = {
  children: ReactNode | ReactNode[];
  subId: string;  // ID único da barbearia
};

type BarberShopContextProps = {
  barberShop: BarberShop | null;
  barbers: Barber[];
  haircuts: Haircut[];
  setBarberShop: (shop: BarberShop | null) => void;
  setBarbers: (barbers: Barber[]) => void;
  setHaircuts: (haircuts: Haircut[]) => void;
};

const emptyBarberShop: BarberShopContextProps = {
  barberShop: null,
  barbers: [],
  haircuts: [],
  setBarberShop: () => {},
  setBarbers: () => {},
  setHaircuts: () => {},
};

export const BarberShopContext = createContext<BarberShopContextProps>(emptyBarberShop);

export const BarberShopContextProvider = ({ children, subId }: BarberShopContextProviderProps) => {
  const [barberShop, setBarberShop] = useState<BarberShop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const clientServices = new ClientServices(new LocalStorage());

  useEffect(() => {
    const fetchBarberShopData = async () => {
      try {
        const { barberShop, barbers, haircuts } = await clientServices.getBarberShopData(subId);
        setBarberShop(barberShop);
        setBarbers(barbers);
        setHaircuts(haircuts);
      } catch (error) {
      }
    };

    fetchBarberShopData();
  }, [subId]);

  return (
    <BarberShopContext.Provider value={{ barberShop, barbers, haircuts, setBarberShop, setBarbers, setHaircuts }}>
      {children}
    </BarberShopContext.Provider>
  );
};
