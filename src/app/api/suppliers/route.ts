import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει τους προμηθευτές ΑΥΣΤΗΡΑ μόνο για το συγκεκριμένο κατάστημα
export async function GET(req: Request) {
  try {
    const shopId = req.headers.get("x-shop-id");
    
    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const suppliers = await prisma.supplier.findMany({
      where: {
        shopId: Number(shopId), // 👑 Η ΨΗΦΙΑΚΗ ΑΣΠΙΔΑ: Απομόνωση των suppliers live
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(suppliers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Δημιουργεί νέο προμηθευτή κλειδωμένο στο shopId του συνδεδεμένου χρήστη
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shopId = req.headers.get("x-shop-id");

    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        shopId: Number(shopId), // 👑 Κλειδώνει αυτόματα στο κατάστημα του χρήστη
      },
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
