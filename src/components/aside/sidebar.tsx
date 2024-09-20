import Image from "next/image"
import { SidebarRoutes } from "./sidebar-routes"
import UserAvatar from "../user"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { UserContext } from "@/context/useContext";
import { useContext } from "react";

export const Sidebar = () => {
  const route = useRouter();
  const { user } = useContext(UserContext);
  
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm justify-between">
      <div>
        <div className="flex flex-col w-full items-center ">
         <Image
            width={100}
            height={80}
            className="object-cover py-5"
            alt={"title"}
            src={"https://www.cdnlogo.com/logos/b/24/barbershop2.svg"}
          />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
      
      </div>
      <Button className="m-5" onClick={() => {
        localStorage.removeItem('userProfile');
        route.push('/login');
      }}>Sair</Button>
    </div>
  )
}