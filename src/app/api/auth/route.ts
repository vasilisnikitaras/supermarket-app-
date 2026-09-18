import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Έλεγχος στοιχείων σύνδεσης (Login)
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Ψάχνουμε live στο Neon DB τον χρήστη με αυτό το email
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    // Αν δεν βρεθεί ή ο κωδικός είναι λάθος
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Αν όλα είναι σωστά, επιστρέφουμε τα στοιχεία και τον Ρόλο του
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // "ADMIN" ή "STAFF"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
