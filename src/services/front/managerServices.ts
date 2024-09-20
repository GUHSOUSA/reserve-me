import { ClientColumn, User } from "@/@types";
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
}
