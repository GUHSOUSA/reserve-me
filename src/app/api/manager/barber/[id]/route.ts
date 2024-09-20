import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";
import bcrypt from 'bcryptjs';
import { UserRole } from "@/@types";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    await db.user.delete({
      where: {
        id: params.id,
      }
    });
    
    return NextResponse.json( {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    const barber = await db.user.findUnique({
      where: {
        id: params.id,
      }, 
      include: {
        BarberShop: {
          select: {
            active: true
          }
        }
      }
    });
    return NextResponse.json(barber, {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { name, email, active, role, password } = await req.json();

  // Construção dinâmica dos dados que serão atualizados
  let updatedUserData: { name?: string; email?: string; password?: string; role?: UserRole } = { name, email, role };
  
  // Hash da senha se fornecida
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedUserData.password = hashedPassword;
  }

  try {
    // Decodifica o token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; id: string };
    
    // Apenas MANAGER pode atualizar
    if (decoded.role !== "MANAGER") {
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }

    // Atualiza o usuário
    await db.user.update({
      where: {
        id: params.id,
      },
      data: updatedUserData
    });

    // Verifica se a barbearia existe para o usuário antes de tentar atualizá-la
    const barberShop = await db.barberShop.findUnique({
      where: {
        userId: params.id,
      },
    });

    // Se a barbearia existir, atualiza o campo `active`
    if (barberShop) {
      await db.barberShop.update({
        where: {
          userId: params.id,
        },
        data: {
          active,
        },
      });
    }

    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}