import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει όλες τις προσφορές μαζί με τα στοιχεία του προϊόντος τους
export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        product: true, // Συμπεριλαμβάνει το όνομα και την τιμή του προϊόντος
      },
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// POST: Δημιουργεί μια νέα προσφορά στη βάση δεδομένων
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Έλεγχος αν υπάρχουν τα απαραίτητα στοιχεία
    if (!data.discount || !data.productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOffer = await prisma.offer.create({
      data: {
        discount: data.discount,
        productId: Number(data.productId),
      },
      include: {
        product: true, // Επιστρέφει τη νέα προσφορά μαζί με το προϊόν της
      },
    });

    return NextResponse.json(newOffer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
