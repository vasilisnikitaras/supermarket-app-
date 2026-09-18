import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, 
        role: data.role || "STAFF",
        shopId: Number(data.shopId || 1),
      },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Prisma Live Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
