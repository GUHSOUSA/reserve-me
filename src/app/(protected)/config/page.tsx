'use client';
import { useEffect, useState } from 'react';
import { BarberServices } from '@/services/front/barberServices';
import { BarberShop } from '@/@types';
import { useStoreModal } from '@/hooks/use-store-modal';
import { Button } from '@/components/ui/button';
import { LocalStorage } from '@/infra';

const Config = () => {
  const [barberShop, setBarberShop] = useState<BarberShop | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      {/* Se o usuário não tiver uma barbearia, exibe o botão para criar */}
      {!barberShop && (
        <div className="h-full flex justify-center items-center">
          <Button variant={"secondary"} onClick={storeModal.onOpen}>
            Crie sua barbearia
          </Button>
        </div>
      )}

      {/* Exibe as informações da barbearia caso ela exista */}
      {barberShop && (
        <div className="p-6">
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

            {/* Exibe a lista de barbeiros */}
            <div>
              <span className="font-semibold">Barbeiros:</span>
              <ul className="list-disc ml-6">
                {barberShop.barbers.length > 0 ? (
                  barberShop.barbers.map((barber) => (
                    <li key={barber.id}>
                      {barber.name || 'Nome não definido'} ({barber.email || 'Email não disponível'})
                    </li>
                  ))
                ) : (
                  <li>Não há barbeiros cadastrados</li>
                )}
              </ul>
            </div>

            {/* Exibe a lista de cortes de cabelo */}
            <div>
              <span className="font-semibold">Cortes de Cabelo:</span>
              <ul className="list-disc ml-6">
                {barberShop.haircut.length > 0 ? (
                  barberShop.haircut.map((haircut) => (
                    <li key={haircut.id}>
                      {haircut.name} - {haircut.duration} min
                    </li>
                  ))
                ) : (
                  <li>Não há cortes cadastrados</li>
                )}
              </ul>
            </div>
          </div>

          {/* Botão para abrir modal de edição ou outras ações */}
          <Button onClick={storeModal.onOpen} className="mt-6">
            Editar Barbearia
          </Button>
        </div>
      )}
    </>
  );
};

export default Config;
