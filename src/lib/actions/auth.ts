'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from '@/lib/sendVerificationEmail';

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
    const { name, email, password } = formData;

    // Basic validation
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
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
    return { success: false, error: 'Failed to register user' };
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
    if (formData.name !== undefined) updateData.name = formData.name;
    if (formData.profilePicture !== undefined) updateData.profilePicture = formData.profilePicture;

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
    return { success: false, error: 'Failed to update profile' };
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
    if (!token) {
      return { success: false, error: 'Verification token is required' };
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
    return { success: false, error: 'Failed to verify email' };
  }
}
