import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: Number(data.price),
        shopId: 1, // Συνδέεται με το Shop 1
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    // 🚨 ΑΥΤΟ ΘΑ ΜΑΣ ΔΕΙΞΕΙ ΤΗΝ ΑΛΗΘΕΙΑ ΣΤΟ POWERSHELL ΑΝ ΑΠΟΤΥΧΕΙ!
    console.error("❌ CRITICAL PRISMA PRODUCT ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
