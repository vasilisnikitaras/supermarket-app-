import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const suppliers = await prisma.supplier.findMany();
  return NextResponse.json(suppliers);
}

export async function POST(req: Request) {
  const data = await req.json();

  const supplier = await prisma.supplier.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });

  return NextResponse.json(supplier);
}
