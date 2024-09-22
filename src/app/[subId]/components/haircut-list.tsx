import { Haircut } from "@/@types";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TimerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
interface Props {
  haircut: Haircut;
  barberShopId: number;
}

export const HaircutList = ({ haircut, barberShopId }: Props) => {
  const route = useRouter();
  return (
    <div
      key={haircut.id}
      className="px-5 md:px-10 mx-2 h-20 flex flex-row items-center justify-between my-2 bg-[#acbebf1d] rounded-md"
    >
      <div className="flex flex-col justify-center">
        <p className="font-semibold text-[14px]">{haircut.name}</p>
        <div className="flex flex-row items-center">
          <TimerIcon size={19} className="mr-1" />
          <p className="text-[13px]">{haircut.duration} min</p>
        </div>
        <div className="flex flex-row items-center">
          <DollarSign size={19} className="mr-1" />
          <p className="text-[13px]">A partir de R${19} Reais</p>
        </div>
      </div>
      <Button
        onClick={() => route.push(`/${barberShopId}/${haircut.id}`)}
        className="flex flex-row gap-x-2"
        variant="default"
      >
        <Calendar size={17} />
        Reservar
      </Button>
    </div>
  );
};
