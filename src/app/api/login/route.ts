import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password } = data;

    // Ψάχνουμε τον χρήστη στη βάση
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 👑 Επιστρέφουμε όλα τα στοιχεία, μαζί με το shopId του καταστήματός του!
    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
      shopId: user.shopId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
