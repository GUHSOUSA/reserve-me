import { User } from "@/@types"
import { LocalStorage } from "@/infra"
import axios from "axios"
import { headers } from "next/headers"

export const fecthUserData = async(token: string): Promise<User> => {
  const response = await axios.get<User>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data;
}
export const loginUser = async(localStorage: LocalStorage, email: string, password: string) => {
  const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.set('userProfile', {
        ...user,
        openAccessToken: token
      });
}