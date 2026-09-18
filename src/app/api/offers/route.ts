import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει όλες τις προσφορές μαζί με τα στοιχεία του προϊόντος
export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        product: true, // Φέρνει live το όνομα του προϊόντος από το Neon
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

// POST: Δημιουργεί νέα προσφορά συνδεδεμένη με το productId
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.productId || !data.discount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        productId: Number(data.productId),
        discount: data.discount,
      },
      include: {
        product: true, // Επιστρέφει το προϊόν αμέσως στο frontend
      },
    });

    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
