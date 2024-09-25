"use client";
import { useContext } from "react";
import { BarberShopContext } from "@/context/barberShopContext";
import Header from "./components/header";
import { HaircutList } from "./components/haircut-list";
import { Loader } from "@/components/loader";

const HaircutsPage = () => {
  const { barberShop, haircuts } = useContext(BarberShopContext);
  if (!barberShop) {
    return <Loader />;
  }
  return (
    <div>
      {haircuts.map((haircut) => (
        <HaircutList haircut={haircut} barberShopId={barberShop.subId} />
      ))}
    </div>
  );
};
export default HaircutsPage;
