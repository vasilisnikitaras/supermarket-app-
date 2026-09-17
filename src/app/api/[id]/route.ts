import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data,
  });

  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Deleted" });
}
