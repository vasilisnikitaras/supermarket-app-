import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET one order
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      supplier: true,
      items: { include: { product: true } }
    }
  });

  return NextResponse.json(order);
}

// PUT update order
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const total = data.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
    0
  );

  // Delete old items
  await prisma.orderItem.deleteMany({
    where: { orderId: Number(params.id) }
  });

  const updated = await prisma.order.update({
    where: { id: Number(params.id) },
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

  return NextResponse.json(updated);
}

// DELETE order
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.order.delete({
    where: { id: Number(params.id) }
  });

  return NextResponse.json({ message: "Deleted" });
}
