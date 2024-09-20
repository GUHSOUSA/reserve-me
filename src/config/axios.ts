import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // tempo atual em segundos
    return decoded.exp < currentTime; // true se expirou
  } catch (error) {
    return true; // se der erro ao decodificar, considera expirado
  }
};