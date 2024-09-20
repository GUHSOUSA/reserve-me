// lib/jwt.ts
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "your-refresh-secret-key";

export const signToken = (user: { id: number, role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    SECRET_KEY,
    { expiresIn: '15m' }  // Token expira em 15 minutos
  );
};

export const signRefreshToken = (user: { id: number, role: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    REFRESH_SECRET_KEY,
    { expiresIn: '7d' }  // Refresh token válido por 7 dias
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error: any) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  } catch (error: any) {
    return null;
  }
};
