import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE: Διαγραφή παραγγελίας και όλων των order items της
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 👑 ΣΩΣΤΟ NEXT.JS 16 AWAIT PARAMS
    const resolvedParams = await params;
    const orderId = Number(resolvedParams.id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // 🔥 ΣΗΜΑΝΤΙΚΟ ΓΙΑ POSTGRES: Σβήνουμε πρώτα τα OrderItems λόγω Foreign Key!
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    // 2. Μετά σβήνουμε την ίδια την Παραγγελία
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("❌ ORDERS DELETE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
