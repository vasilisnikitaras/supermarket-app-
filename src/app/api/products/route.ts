import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει όλα τα προϊόντα από τη βάση
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// POST: Δημιουργεί νέο προϊόν στη βάση
export async function POST(req: Request) {
  const data = await req.json();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
    },
  });

  return NextResponse.json(product);
}
