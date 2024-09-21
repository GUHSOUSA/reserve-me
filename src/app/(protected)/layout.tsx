"use client";
import { User } from "@/@types";
import { MainNav } from "@/components/aside/main-nav";
import { MobileSidebar } from "@/components/aside/mobile-sidebar";
import { Sidebar } from "@/components/aside/sidebar";
import { Loader } from "@/components/loader";
import { ThemeToggle } from "@/components/theme-toggle";
import { isTokenExpired } from "@/config/axios";
import { UserContext } from "@/context/useContext";
import { LocalStorage } from "@/infra";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: Props) => {
  const { user } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const localStorage = new LocalStorage();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const checkUser = async () => {
  
      try {
        const userProfile = await localStorage.get<User>("userProfile")
        if (!userProfile || !userProfile.openAccessToken) {
          router.push('/login');
          return;
        }
          if (isTokenExpired(userProfile.openAccessToken)) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    };
    checkUser();
  }, []);
  return isAuthenticated ? <div className="h-full">
  <div className="px-4 pt-4 items-center flex justify-between">
    <MobileSidebar />
    { pathname.startsWith("/barbershop") &&
    <MainNav className="mx-6" />
}
    <ThemeToggle />
  </div>
  <aside className="hidden md:flex h-full w-56 flex-col fixed inset-y-0">
    <Sidebar />
  </aside>
  <main className="md:pl-60 p-5 md:p-5 h-full">
    {children}
  </main>
</div> : <div className="flex h-full w-full items-center justify-center">
  <Loader />
</div>;
};
export default ProtectedLayout; 