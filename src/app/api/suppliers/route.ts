import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Φέρνει όλους τους προμηθευτές
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({ 
      orderBy: { id: "asc" } 
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

// POST: Αποθηκεύει τον προμηθευτή live στο Neon DB
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        shopId: 1, // 👑 ΚΛΕΙΔΩΝΕΙ LIVE ΣΤΟ ΚΑΤΑΣΤΗΜΑ 1
      },
    });

    return NextResponse.json(supplier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
