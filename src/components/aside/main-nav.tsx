"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/barbershop`,
      label: 'Clientes',
      active: pathname === `/barbershop`,
    },
    {
      href: `/barbershop/haircut`,
      label: 'Cortes',
      active: pathname === `/barbershop/haircut`,
    },
    {
      href: `/barbershop/barber`,
      label: 'Barbeiros',
      active: pathname === `/barbershop/barber`,
    },
    {
      href: `/barbershop/settings`,
      label: 'Configuracoes',
      active: pathname === `/barbershop/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6 overflow-x-auto no-scrollbar", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
