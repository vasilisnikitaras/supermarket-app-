import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει έναν συγκεκριμένο προμηθευτή (Next.js 16 Compliant)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(resolvedParams.id) },
    });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }
}

// PUT: Ενημερώνει τα στοιχεία ενός προμηθευτή
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const data = await req.json();

    const updated = await prisma.supplier.update({
      where: { id: Number(resolvedParams.id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Διαγραφή συγκεκριμένου προμηθευτή
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.supplier.delete({
      where: { id: Number(resolvedParams.id) },
    });
    return NextResponse.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot delete supplier. It might be linked to an order." },
      { status: 500 }
    );
  }
}
