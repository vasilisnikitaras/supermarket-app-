import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all orders
export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      supplier: true,
      items: {
        include: { product: true }
      }
    }
  });

  return NextResponse.json(orders);
}

// POST create order
export async function POST(req: Request) {
  const data = await req.json();

  // data = { supplierId, items: [{ productId, quantity, price }] }

  const total = data.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
    0
  );

  const order = await prisma.order.create({
    data: {
      supplierId: data.supplierId,
      total,
      items: {
        create: data.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      supplier: true,
      items: { include: { product: true } }
    }
  });

  return NextResponse.json(order);
}
