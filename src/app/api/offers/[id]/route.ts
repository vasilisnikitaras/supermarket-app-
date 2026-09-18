import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE: Διαγραφή συγκεκριμένης προσφοράς live από το Neon DB
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 👑 ΣΩΣΤΟ NEXT.JS 16 AWAIT PARAMS
    const resolvedParams = await params;
    const offerId = Number(resolvedParams.id);

    if (isNaN(offerId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Διαγραφή από το Neon DB
    await prisma.offer.delete({
      where: { id: offerId },
    });

    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error: any) {
    console.error("❌ OFFERS DELETE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
