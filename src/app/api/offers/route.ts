import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει τις προσφορές ΑΥΣΤΗΡΑ μόνο για τα προϊόντα του συγκεκριμένου καταστήματος
export async function GET(req: Request) {
  try {
    const shopId = req.headers.get("x-shop-id");
    
    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const offers = await prisma.offer.findMany({
      where: {
        product: {
          shopId: Number(shopId), // 👑 Η ΨΗΦΙΑΚΗ ΑΣΠΙΔΑ: Φιλτράρισμα μέσω της σχέσης με το Product
        },
      },
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

// POST: Δημιουργεί νέα προσφορά, αφού πρώτα βεβαιωθεί ότι το προϊόν ανήκει στο μαγαζί του χρήστη
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shopId = req.headers.get("x-shop-id");

    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    if (!data.productId || !data.discount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🛡️ ΕΛΕΓΧΟΣ ΑΣΦΑΛΕΙΑΣ: Βεβαιωνόμαστε ότι το προϊόν ανήκει στον συγκεκριμένο tenant
    const productExists = await prisma.product.findFirst({
      where: {
        id: Number(data.productId),
        shopId: Number(shopId),
      },
    });

    if (!productExists) {
      return NextResponse.json({ error: "Unauthorized product assignment" }, { status: 403 });
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
