export type ClientColumn = {
  id: string
  name: string;
  email: string;
  role: string;
  password: string;
  barberShop?: {
    active: boolean
  }
}