import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Ορίστηκε ως Promise
) {
  // ΔΙΟΡΘΩΘΗΚΕ: Κάνουμε await τα params για το Next.js 16
  const resolvedParams = await params; 
  
  const product = await prisma.product.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  return NextResponse.json(product);
}
