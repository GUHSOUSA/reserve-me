import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.get('userProfile').openAccessToken;

  // Verificar se o token ainda é válido
  if (isTokenExpired(token)) {
    // Se o token estiver expirado, redirecionar para login ou obter um novo
    // router.push('/login');
    throw new Error('Token expirado');
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // tempo atual em segundos
    return decoded.exp < currentTime; // true se expirou
  } catch (error) {
    return true; // se der erro ao decodificar, considera expirado
  }
};