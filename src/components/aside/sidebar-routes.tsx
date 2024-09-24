"use client";
import { Layout, Settings } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useContext } from "react";
import { UserContext } from "@/context/useContext";
const managerRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["MANAGER", "BARBER"],
  },
  {
    icon: Settings,
    label: "Barbearia",
    href: "/barbershop",
    roles: ["BARBER"],
  },
];
export const SidebarRoutes = () => {
  const { user } = useContext(UserContext);
  const routes = managerRoutes.filter((route) => {
    if (route.roles && !route.roles.includes(user.role)) {
      return false;
    }
    return true;
  });
  return (
    <div className="flex flex-col w-full justify-between h-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};