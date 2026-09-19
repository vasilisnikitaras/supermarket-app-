import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Επιστρέφει όλους τους χρήστες με το live status τους
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOnline: true, // 🟢 ΕΠΙΒΑΛΛΕΙ ΤΗΝ ΕΠΙΣΤΡΟΦΗ ΤΟΥ LIVE STATUS
        lastSeen: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Δημιουργία νέου χρήστη live στο Neon DB
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.trim(),
        password: data.password,
        role: data.role.toUpperCase(),
        shopId: 1,
      },
    });
    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
