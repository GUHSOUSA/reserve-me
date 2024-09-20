"use client";
import { Layout, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
const managerRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Settings,
    label: "Config",
    href: "/config" ,
  },
]
export const SidebarRoutes = () => {
  const routes =  managerRoutes;
  return (
    <div className="flex flex-col w-full justify-between h-full ">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}   
    </div>
  )
}