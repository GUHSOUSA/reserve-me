// services/userService.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (email: string, password: string, roleName: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = await prisma.role.findUnique({ where: { name: roleName } });

  if (!role) {
    throw new Error("Role não encontrada");
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      roleId: role.id
    }
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true }
  });
};
