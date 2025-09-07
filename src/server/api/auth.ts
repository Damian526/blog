import { apiClient } from './client';
import { z } from 'zod';

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const validatedData = RegisterSchema.parse(data);

  return apiClient.post(
    '/api/auth/register',
    validatedData,
    {
      cache: 'no-store',
    },
    z.object({
      message: z.string(),
      success: z.boolean().optional(),
    })
  );
}

export async function requestVerification(data: {
  verificationReason: string;
  portfolioUrl?: string;
}) {
  const RequestVerificationSchema = z.object({
    verificationReason: z.string().min(10, 'Please provide a detailed reason'),
    portfolioUrl: z.string().url().optional(),
  });

  const validatedData = RequestVerificationSchema.parse(data);

  return apiClient.post(
    '/api/user/request-verification',
    validatedData,
    {
      cache: 'no-store',
    },
    z.object({
      message: z.string(),
      success: z.boolean().optional(),
    })
  );
}
