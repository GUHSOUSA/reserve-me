import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import db from "@/lib/db";
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { email, password, name, role } = await req.json();
  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: "Por favor, Preencha todos os campos" }, { status: 400 });
  }
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string, id: string };
    if (decoded.role != "MANAGER"){
      return NextResponse.json({ error: 'Não Autorizado' }, { status: 403 });
    }
    const deletedBarber = await db.user.delete({
      where: {
        id: params.id,
      }
    });
    
    return NextResponse.json(deletedBarber, {status: 200});
  }catch(err: any){
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}