import { BarberShop, Barber, Haircut, User, Appointment } from "@/@types";
import { BarberFormValues } from "@/app/(protected)/barbershop/barber/[id]/components/barberForm";
import { HaircutFormValues } from "@/app/(protected)/barbershop/haircut/[id]/components/haircutForm";
import { LocalStorage } from "@/infra";
import axios from "axios";

export class BarberServices {
  constructor(private readonly localStorage: LocalStorage) {}

  async getBarberShop(): Promise<BarberShop | null> {
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

  // rotas para criar barbeiro e cortes de cabelo 

  async createBarber(newBarber: { name: string, email: string }): Promise<Barber> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.post<Barber>(`/api/barber/barbers`, newBarber, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data);
  }

  async createHaircut(newHaircut: { name: string, duration: number}): Promise<Haircut> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.post<Haircut>(`/api/barber/haircuts`, newHaircut, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data);
  }


  // rotas para pegar barbeiros e cortes de cabelo

  async getBarbers( page: number, limit: number): Promise<{ barbers: Barber[], total: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ barbers: Barber[], total: number }>(`/api/barber/barbers`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => ({
      barbers: response.data.barbers,
      total: response.data.total
    }));
  }

  async getHaircuts(page: number, limit: number): Promise<{ haircuts: Haircut[], total: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ haircuts: Haircut[], total: number }>(`/api/barber/haircuts`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => ({
      haircuts: response.data.haircuts,
      total: response.data.total
    }));
  }

  // pega cortes de cabelo por id
  async getHaircutById(id: string): Promise<Haircut>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.get<Haircut>(`/api/barber/haircuts/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
  async getBarberById(id: string): Promise<Barber>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');

    return await axios.get<Barber>(`/api/barber/barbers/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    }).then(response => response.data)
  }
  //

  async deleteHaircut (id: string): Promise<void> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    await axios.delete(`/api/barber/haircuts/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    })
  }
  async deleteBarber (id: string): Promise<void> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    await axios.delete(`/api/barber/barbers/${id}`, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    })
  }

  //
  async updateHaircut (id: string, data: HaircutFormValues): Promise<void>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    await axios.patch(`/api/barber/haircuts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    })
  }
  async updateBarber (id: string, data: BarberFormValues): Promise<void>{
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    await axios.patch(`/api/barber/barbers/${id}`, data, {
      headers: {
        Authorization: `Bearer ${openAccessToken}`
      }
    })
  }
  // rotas para pegar agendamentos

  async getAppointments( page: number, limit: number, search?: string): Promise<{ futureAppointments: Appointment[], pastAppointments: Appointment[], totalFuture: number, totalPast: number }> {
    const { openAccessToken } = await this.localStorage.get<User>('userProfile');
    return await axios.get<{ futureAppointments: Appointment[], pastAppointments: Appointment[], totalFuture: number, totalPast: number }>(
      `/api/barber/barber-shop/1/appointments`,
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
