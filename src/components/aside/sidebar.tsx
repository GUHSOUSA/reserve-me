import { SidebarRoutes } from "./sidebar-routes";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
export const Sidebar = () => {
  const route = useRouter();
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm justify-between">
      <div>
        <div className="flex flex-col w-full items-center text-2xl p-5 font-bold">
          <h1 className="text-blue-500">
            Barber<span className="text-blue-200">Shop</span>
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <SidebarRoutes />
        </div>
      </div>
      <Button
        className="m-5"
        onClick={() => {
          localStorage.removeItem("userProfile");
          route.push("/login");
        }}
      >
        Sair
      </Button>
    </div>
  );
};
