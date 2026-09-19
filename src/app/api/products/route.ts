import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει προϊόντα ΑΥΣΤΗΡΑ μόνο για το συγκεκριμένο μαγαζί
export async function GET(req: Request) {
  try {
    const shopId = req.headers.get("x-shop-id");
    
    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        shopId: Number(shopId), // 👑 Η ΨΗΦΙΑΚΗ ΑΣΠΙΔΑ: Φιλτράρισμα live
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Δημιουργία νέου προϊόντος κλειδωμένο στο μαγαζί του συνδεδεμένου χρήστη
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shopId = req.headers.get("x-shop-id");

    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: Number(data.price),
        shopId: Number(shopId), // 👑 Αντικαταστάθηκε το καρφωμένο "1" με το δυναμικό ID του πελάτη σου
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("❌ CRITICAL PRISMA PRODUCT ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
