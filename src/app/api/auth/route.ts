import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password } = data;

    // Ψάχνουμε live τον χρήστη στην PostgreSQL (Neon DB)
    const user = await prisma.user.findFirst({
      where: { 
        email: email.trim() 
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 👑 ΤΟ ΜΕΓΑΛΟ ΚΛΕΙΔΙ: Επιστρέφουμε το αληθινό shopId του χρήστη από τη βάση!
    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
      shopId: user.shopId, // 🧠 Πλέον ο Γιάννης θα στείλει το 6!
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
