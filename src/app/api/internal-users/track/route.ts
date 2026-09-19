import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, isOnline } = data;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        isOnline: Boolean(isOnline),
        lastSeen: new Date(),
      },
    });

    return NextResponse.json({ success: true, isOnline: updatedUser.isOnline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
