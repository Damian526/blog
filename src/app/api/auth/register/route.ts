import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Basic validation
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 },
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'User with this email already exists' },
      { status: 400 },
    );
  }

  // Store user without hashing (for now)
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password, // Store the password directly (plain text)
    },
  });

  return NextResponse.json(newUser);
}
