'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  profilePicture: z.string().url('Invalid URL').optional(),
  verificationReason: z.string().optional(),
  portfolioUrl: z.string().url('Invalid URL').optional(),
});

export async function updateUserProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    const validatedData = updateProfileSchema.parse(data);

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      throw new Error('No data to update');
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true,
        verified: true,
        isExpert: true,
        verificationReason: true,
        portfolioUrl: true,
        createdAt: true,
      },
    });

    // Revalidate pages that might show user data
    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
}

export async function requestExpertVerification(data: {
  verificationReason: string;
  portfolioUrl: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    const validatedData = z.object({
      verificationReason: z.string().min(10, 'Please provide a detailed reason (at least 10 characters)'),
      portfolioUrl: z.string().url('Please provide a valid URL'),
    }).parse(data);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        verificationReason: validatedData.verificationReason,
        portfolioUrl: validatedData.portfolioUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        role: true,
        verified: true,
        isExpert: true,
        verificationReason: true,
        portfolioUrl: true,
        createdAt: true,
      },
    });

    revalidatePath('/profile');

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error requesting verification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to request verification' 
    };
  }
}
