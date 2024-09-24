import { Barber } from "./barber";
import { BarberShop } from "./barberShop";
import { Haircut } from "./haircut";

export type Appointment = {
  id: string;
  appointmentTime: Date;
  duration: number;
  barber: Barber;
  barberShop: BarberShop;
  haircut?: Haircut;
};
