// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@/src/context/user-context";
// import { parseCookies } from "nookies";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const BarberDashboard = () => {
//   const [clients, setClients] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { refreshToken } = useAuth();

//   const fetchClients = async (token: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/barber/agendaments`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setClients(response.data); // Aqui você recebe os dados dos agendamentos
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         const newAccessToken = await refreshToken();
//         if (newAccessToken) {
//           fetchClients(newAccessToken);
//         } else {
//           console.log("Erro ao renovar o token");
//         }
//       } else {
//         console.error("Erro ao buscar clientes:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cookies = parseCookies();
//     const token = cookies.authToken;
//     if (token) {
//       fetchClients(token);
//     }
//   }, []);

//   // Agrupando agendamentos por data (exemplo simples)
//   const groupedAppointments = clients.reduce((group: any, appointment: any) => {
//     const date = new Date(appointment.appointmentTime).toLocaleDateString("pt-BR");
//     if (!group[date]) {
//       group[date] = [];
//     }
//     group[date].push(appointment);
//     return group;
//   }, {});

//   return (
//     <>
//       {loading && <p>Carregando...</p>}
//       <Accordion className="mb-4" type="single" collapsible>
//         {Object.keys(groupedAppointments).map((date) => (
//           <AccordionItem className="border-b-0" value={date} key={date}>
//             <AccordionTrigger className="bg-blue-400/15  px-5 rounded-md">
//               {date}
//             </AccordionTrigger>
//             <AccordionContent className="my-5">
//               <Card className="">
//                 <CardHeader className="py-2 pl-5">
//                   <CardTitle className="text-lg">Agendamentos de {date}</CardTitle>
//                 </CardHeader>
//                 <Separator className="h-1 bg-slate-300" />
//                 <CardContent>
//                   <Table>
//                     <TableHeader className="hover:bg-none">
//                       <TableRow className="border-b-transparent">
//                         <TableHead className="font-bold text-black px-0">Nome</TableHead>
//                         <TableHead className="font-bold text-black px-0">Horário</TableHead>
//                         <TableHead className="font-bold text-black px-0">Tipo de corte</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody className="">
//                       {groupedAppointments[date].map((appointment: any) => (
//                         <TableRow key={appointment.id}>
//                           <TableCell className="h-1 py-3 px-0">
//                             {appointment.client.name}
//                           </TableCell>
//                           <TableCell className="h-1 py-2 px-0">
//                             {new Date(appointment.appointmentTime).toLocaleTimeString("pt-BR", {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </TableCell>
//                           <TableCell className="h-1 py-1.5 px-0">
//                             {appointment.haircutId ? "Corte de cabelo" : "Sem corte definido"}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </CardContent>
//               </Card>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </>
//   );
// };

// export default BarberDashboard;
