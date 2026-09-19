import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει όλες τις παραγγελίες μαζί με τους προμηθευτές και τα προϊόντα τους
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true, // 👑 ΣΗΜΑΝΤΙΚΟ: Τραβάει live το όνομα του προϊόντος (π.χ. Chocolate)
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Δημιουργεί νέα παραγγελία live στο Neon DB
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Υπολογισμός συνολικού ποσού της παραγγελίας στο Backend
    const total = data.items.reduce(
      (sum: number, item: any) => sum + Number(item.quantity) * Number(item.price),
      0
    );

    const order = await prisma.order.create({
      data: {
        supplierId: Number(data.supplierId),
        total: Number(total),
        shopId: 1,
        items: {
          create: data.items.map((item: any) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
