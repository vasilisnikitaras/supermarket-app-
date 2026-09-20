import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει τους χρήστες ΑΥΣΤΗΡΑ μόνο για το συγκεκριμένο κατάστημα
export async function GET(req: Request) {
  try {
    const shopId = req.headers.get("x-shop-id");
    
    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        shopId: Number(shopId), // 👑 Η ΨΗΦΙΑΚΗ ΑΣΠΙΔΑ: Απομόνωση προσωπικού ανά tenant live
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOnline: true, // 🟢 Live status tracking
        lastSeen: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Δημιουργία νέου χρήστη κλειδωμένο στο σωστό κατάστημα
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shopId = req.headers.get("x-shop-id");

    if (!shopId) {
      return NextResponse.json({ error: "Missing Shop Identity Configuration" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.trim(),
        password: data.password, // Ιδανικά στο μέλλον βάλε bcrypt hashing εδώ!
        role: data.role.toUpperCase(),
        shopId: Number(shopId), // 👑 Πλέον συνδέεται δυναμικά με το σωστό κατάστημα!
      },
    });
    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
