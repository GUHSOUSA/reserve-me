import { BarberShop, Barber, Haircut, Appointment, BarberAvailability } from "@/@types";
import { LocalStorage } from "@/infra";
import axios from "axios";

export class ClientServices {
  constructor(private readonly localStorage: LocalStorage) {}

  async getBarberShopData(subId: string): Promise<{ barberShop: BarberShop, haircuts: Haircut[], barbers: Barber[] }> {
    return await axios.get<{ barberShop: BarberShop, haircuts: Haircut[], barbers: Barber[] }>(
      `/api/client/barber-shop/${subId}`
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  }

  async createAppointmentWithSubId(appointmentData: { barberId: number, haircutId: string, appointmentTime: string, clientId: string, clientName: string }): Promise<void> {
    return await axios.post("/api/client/appointment", appointmentData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
  

  async getBarberAvailability(barberId: number, barberShopId: string, date: string, haircutId: string): Promise<string[]> {
    return await axios.get<{ availableTimes: string[] }>(`/api/client/barber-shop/${barberShopId}/barbers/${barberId}`, {
      params: {
        date,
        haircutId
      }
    })
    .then(response => response.data.availableTimes)
    .catch(error => {
      throw error;
    });
  }
  async getClientAppointmentsByEmail( page: number = 1, limit: number = 10): Promise<{ appointments: Appointment[], total: number }> {
    const email = await this.localStorage.get<String>('userEmail');
    return await axios.get<{ appointments: Appointment[], total: number }>(`/api/client/history`, {
      params: {
        email,
        page,
        limit
      }
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  }
  
}
