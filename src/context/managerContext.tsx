// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { ManagerService } from '@/services/front/managerServices';

// interface Barber {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: string;
// }

// interface ManagerContextProps {
//   barbers: Barber[];
//   getBarbers: (page?: number, limit?: number) => Promise<void>;
//   createBarber: (name: string, email: string, password: string) => Promise<void>;
//   deleteBarber: (id: string) => Promise<void>;
//   activateBarberShop: (userId: string) => Promise<void>;
//   deactivateBarberShop: (userId: string) => Promise<void>;
// }

// const ManagerContext = createContext<ManagerContextProps | undefined>(undefined);

// export const useManager = () => {
//   const context = useContext(ManagerContext);
//   if (!context) {
//     throw new Error("useManager must be used within a ManagerProvider");
//   }
//   return context;
// };

// export const ManagerProvider = ({ children, managerServices }: { children: ReactNode, managerServices: ManagerService }) => {
//   const [barbers, setBarbers] = useState<Barber[]>([]);

//   // Função para listar barbeiros
//   const getBarbers = async (page = 1, limit = 10) => {
//     try {
//       const response = await managerServices.getBarbers(page, limit);
//       setBarbers(response); // Aqui você pode precisar ajustar de acordo com a estrutura de resposta
//     } catch (error) {
//       console.error('Erro ao buscar barbeiros:', error);
//     }
//   };

//   // Função para criar um barbeiro
//   const createBarber = async (name: string, email: string, password: string) => {
//     // try {
//     //   await managerServices.createBarber(name, email, password);
//     //   getBarbers(); // Atualiza a lista após criar
//     // } catch (error) {
//     //   console.error('Erro ao criar barbeiro:', error);
//     // }
//   };

//   // Função para excluir um barbeiro
//   const deleteBarber = async (id: string) => {
//     // try {
//     //   await managerServices.deleteBarber(id);
//     //   getBarbers(); // Atualiza a lista após excluir
//     // } catch (error) {
//     //   console.error('Erro ao excluir barbeiro:', error);
//     // }
//   };

//   // Função para ativar barbearia
//   const activateBarberShop = async (userId: string) => {
//     // try {
//     //   await managerServices.activateBarberShop(userId);
//     //   getBarbers(); // Atualiza a lista de barbeiros/barbearias
//     // } catch (error) {
//     //   console.error('Erro ao ativar a barbearia:', error);
//     // }
//   };

//   // Função para desativar barbearia
//   const deactivateBarberShop = async (userId: string) => {
//     // try {
//     //   await managerServices.deactivateBarberShop(userId);
//     //   getBarbers(); // Atualiza a lista de barbeiros/barbearias
//     // } catch (error) {
//     //   console.error('Erro ao desativar a barbearia:', error);
//     // }
//   };

//   return (
//     <ManagerContext.Provider
//       value={{ barbers, getBarbers, createBarber, deleteBarber, activateBarberShop, deactivateBarberShop }}
//     >
//       {children}
//     </ManagerContext.Provider>
//   );
// };
