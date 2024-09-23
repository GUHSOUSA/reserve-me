'use client';
import { useEffect, useState } from 'react';
import { BarberServices } from '@/services/front/barberServices';
import { BarberShop as BarberShopType } from '@/@types';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '@/components/ui/button';
import { LocalStorage } from '@/infra';
import { Loader } from '@/components/loader';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const [barberShop, setBarberShop] = useState<BarberShopType | null>(null);
  const [loading, setLoading] = useState(true);
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);
  const storeModal = useStoreModal();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    barberServices.getBarberShop().then(response => {
      if (response === null) {
        storeModal.onOpen();
      } else {
        setBarberShop(response);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader />
    </div>
  );

  const handleViewBarbershop = () => {
    if (barberShop) {
      router.push(`/${barberShop.subId}`);
    }
  };

  return (
    <>
      {!barberShop && (
        <div className="h-full flex justify-center items-center">
          <Button variant={"secondary"} onClick={storeModal.onOpen}>
            Crie sua barbearia
          </Button>
        </div>
      )}

      {barberShop && (
        <div className="">
          <h1 className="text-2xl font-bold mb-4">Informações da sua Barbearia</h1>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">ID da Barbearia:</span> {barberShop.id}
            </div>
            <div>
              <span className="font-semibold">Nome:</span> {barberShop.name || 'Nome não definido'}
            </div>
            <div>
              <span className="font-semibold">SubId:</span> {barberShop.subId}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {barberShop.active ? 'Ativa' : 'Inativa'}
            </div>
          </div>
        </div>
      )}

      {/* Botão fixo no rodapé */}
      {barberShop && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
          <Button
            onClick={handleViewBarbershop}
            className="w-full max-w-md"
          >
            Ver Barbearia
          </Button>
        </div>
      )}
    </>
  );
};

export default SettingsPage;
