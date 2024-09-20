import { BarberShop, ClientColumn, User } from "@/@types";
import { LocalStorage } from "@/infra";
import axios from "axios";

export class BarberServices {
  constructor( private readonly localStorage: LocalStorage) {}

  async getBarber(): Promise<BarberShop | null> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.get<BarberShop>("/api/barber/barber-shop", {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
      .catch(error => {
        if (error.response && error.response.status === 404) {
          return null;
        }
        throw error;
      });
  }
  async createBarberShop(name: string): Promise<void> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    await axios.post("/api/barber/barber-shop",{
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
}