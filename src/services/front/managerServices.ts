import { ClientColumn, User } from "@/@types";
import { ClientFormValues } from "@/app/(protected)/dashboard/[id]/components/client-form";
import { LocalStorage } from "@/infra";
import axios from "axios";

export class ManagerService {
  constructor( private readonly localStorage: LocalStorage) {}

  async getBarbers(page: number, limit: number): Promise<{ barbers: ClientColumn[], total: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.get<{ barberShop: ClientColumn[], total: number }>("/api/manager/barber", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => ({
      barbers: response.data.barberShop,
      total: response.data.total,
    }));
  }

  async getBarberById(id: string): Promise<User>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.get<User>(`/api/manager/barber/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
  async createBarber(data: ClientFormValues): Promise<void>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.post(`/api/manager/barber/`, data, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
  async deleteBarber(id: string): Promise<void>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.delete(`/api/manager/barber/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
}
