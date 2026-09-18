import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        supplier: true,
        items: { include: { product: true } }
      },
      orderBy: { id: "asc" }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const total = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

    const order = await prisma.order.create({
      data: {
        supplierId: Number(data.supplierId),
        total: Number(total),
        shopId: 1, // Κλειδώνει live στο κατάστημα 1
        items: {
          create: data.items.map((item: any) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        }
      },
      include: {
        supplier: true,
        items: { include: { product: true } }
      }
    });
    return NextResponse.json(order);
  } catch (error: any) {
    // 🚨 ΕΚΤΥΠΩΣΗ ΣΦΑΛΜΑΤΟΣ ΓΙΑ ΤΟ TEST
    console.error("❌ CRITICAL ORDERS ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
