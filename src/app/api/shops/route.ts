import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει όλα τα εγγεγραμμένα μαγαζιά (Μόνο για εσένα τον Super Admin)
export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        _count: {
          select: { products: true, orders: true, users: true }
        }
      },
      orderBy: { id: "asc" }
    });
    return NextResponse.json(shops);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Δημιουργεί ένα ολοκαίνουργιο μαγαζί στη βάση δεδομένων (Neon DB)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (!data.name) {
      return NextResponse.json({ error: "Missing Shop Name" }, { status: 400 });
    }

    const newShop = await prisma.shop.create({
      data: {
        name: data.name
      }
    });

    return NextResponse.json(newShop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
