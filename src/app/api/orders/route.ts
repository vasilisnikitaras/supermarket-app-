import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει όλες τις παραγγελίες ΑΥΣΤΗΡΑ και μόνο για το συγκεκριμένο κατάστημα
export async function GET(req: Request) {
  try {
    const shopId = req.headers.get("x-shop-id");
    
    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        shopId: Number(shopId), // 👑 Η ΨΗΦΙΑΚΗ ΑΣΠΙΔΑ: Απομόνωση των orders live
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
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

// POST: Δημιουργεί νέα παραγγελία κλειδωμένη στο shopId του συνδεδεμένου χρήστη
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shopId = req.headers.get("x-shop-id");

    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }
    
    // Υπολογισμός συνολικού ποσού της παραγγελίας στο Backend
    const total = data.items.reduce(
      (sum: number, item: any) => sum + Number(item.quantity) * Number(item.price),
      0
    );

    const order = await prisma.order.create({
      data: {
        supplierId: Number(data.supplierId),
        total: Number(total),
        shopId: Number(shopId), // 👑 Κλειδώνει αυτόματα στο κατάστημα του χρήστη
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
