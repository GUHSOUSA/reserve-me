import { BarberShopContextProvider } from "@/context/barberShopContext";
import Header from "./components/header";
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subId: string };
}) {
  return (
    <BarberShopContextProvider subId={params.subId}>
      {children}
    </BarberShopContextProvider>
  );
}
