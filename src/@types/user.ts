export type User = {
  id: string,
  name: string,
  email: string,
  openAccessToken: string;
  role: string;
};
export enum UserRole {
  MANAGER = "MANAGER",
  BARBER = "BARBER"
}
