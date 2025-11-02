'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from '@/lib/sendVerificationEmail';
import { z } from 'zod';
import { checkRateLimit, rateLimitConfigs } from '@/lib/ratelimit';

// Validation schemas
const registerUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim()
    .optional(),
  profilePicture: z.string()
    .url('Invalid profile picture URL')
    .optional(),
});

const verifyEmailSchema = z.string()
  .min(1, 'Verification token is required')
  .uuid('Invalid verification token');

/**
 * Server Action: Register a new user
 * Used in registration forms
 */
export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = registerUserSchema.safeParse(formData);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const { name, email, password } = validationResult.data;

    // Check rate limit (use email as identifier for registration)
    const rateLimitResult = await checkRateLimit(
      email,
      rateLimitConfigs.register
    );
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    // Send verification email
    await sendVerificationEmail({
      to: newUser.email,
      token: verificationToken,
      name: newUser.name || 'User',
    });

    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'User with this email already exists' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to register user' 
    };
  }
}

/**
 * Server Action: Update user profile
 * Used in profile edit forms
 */
export async function updateProfile(formData: {
  name?: string;
  profilePicture?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = updateProfileSchema.safeParse(formData);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to update profile' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const updateData: any = {};
    const validatedData = validationResult.data;
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.profilePicture !== undefined) updateData.profilePicture = validatedData.profilePicture;
    
    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No data to update' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Revalidate profile pages
    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'User not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to update profile' 
    };
  }
}

/**
 * Server Action: Request email verification
 * Used when user wants to resend verification email
 */
export async function requestVerification(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { success: false, error: 'You must be logged in to request verification' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.verified) {
      return { success: false, error: 'Email is already verified' };
    }

    // Generate new verification token
    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send verification email
    await sendVerificationEmail({
      to: user.email,
      token: verificationToken,
      name: user.name || 'User',
    });

    return { success: true };
  } catch (error) {
    console.error('Error requesting verification:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}

/**
 * Server Action: Verify email with token
 * Used when user clicks verification link
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validationResult = verifyEmailSchema.safeParse(token);
    if (!validationResult.success) {
      return { 
        success: false, 
        error: validationResult.error.issues[0].message 
      };
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return { success: false, error: 'Invalid or expired verification token' };
    }

    if (user.verified) {
      return { success: false, error: 'Email is already verified' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying email:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { success: false, error: 'User not found' };
      }
    }
    
    return { 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Failed to verify email' 
    };
  }
}

