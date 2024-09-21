'use client';
import { useEffect, useState } from 'react';
import { BarberServices } from '@/services/front/barberServices';
import { BarberShop as BarberShopType } from '@/@types';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '@/components/ui/button';
import { LocalStorage } from '@/infra';
import { Loader } from '@/components/loader';

const SettingsPage = () => {
  const [barberShop, setBarberShop] = useState<BarberShopType | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);
  const storeModal = useStoreModal();

  useEffect(() => {
    setLoading(true);
    barberServices.getBarber().then(response => {
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

  if (loading) return <div className="flex h-full w-full items-center justify-center">
  <Loader />
</div>;

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
    </>
  );
};

export default SettingsPage;
