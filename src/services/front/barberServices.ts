import { BarberShop, Barber, Haircut, User, Appointment } from "@/@types";
import { LocalStorage } from "@/infra";
import axios from "axios";

export class BarberServices {
  constructor(private readonly localStorage: LocalStorage) {}

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
    await axios.post("/api/barber/barber-shop", {
      name: name
    }, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data);
  }

  async createBarber(barberShopId: string, newBarber: { name: string, email: string }): Promise<Barber> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.post<Barber>(`/api/barber/barber-shop/${barberShopId}/barbers`, newBarber, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data);
  }

  async createHaircut(newHaircut: { name: string, duration: number}): Promise<Haircut> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.post<Haircut>(`/api/barber/barber-shop/1/haircuts`, newHaircut, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data);
  }

  async getBarbers(barberShopId: string, page: number, limit: number): Promise<{ barbers: Barber[], total: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ barbers: Barber[], total: number }>(`/api/barber/barber-shop/${barberShopId}/barbers`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => ({
      barbers: response.data.barbers,
      total: response.data.total
    }));
  }

  // Função paginada para buscar tipos de corte
  async getHaircuts(barberShopId: string, page: number, limit: number): Promise<{ haircuts: Haircut[], total: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ haircuts: Haircut[], total: number }>(`/api/barber/barber-shop/${barberShopId}/haircuts`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => ({
      haircuts: response.data.haircuts,
      total: response.data.total
    }));
  }
  async getAppointments( page: number, limit: number, search?: string): Promise<{ futureAppointments: Appointment[], pastAppointments: Appointment[], totalFuture: number, totalPast: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ futureAppointments: Appointment[], pastAppointments: Appointment[], totalFuture: number, totalPast: number }>(
      `/api/barber/barber-shop//appointments`,
      {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${openAccessToken}`,
        },
      }
    ).then(response => ({
      futureAppointments: response.data.futureAppointments,
      pastAppointments: response.data.pastAppointments,
      totalFuture: response.data.totalFuture,
      totalPast: response.data.totalPast,
    }));
  }
}
