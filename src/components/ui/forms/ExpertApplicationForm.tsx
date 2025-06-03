'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  FormContainer,
  FormHeader,
  FormTitle,
  FormDescription,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormButton,
  ErrorMessage,
  SuccessMessage,
  HelperText,
} from '@/components/ui/forms/FormComponents';

interface ExpertApplicationFormProps {
  onSuccess?: () => void;
}

export default function ExpertApplicationForm({
  onSuccess,
}: ExpertApplicationFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    reason: '',
    portfolioUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!formData.reason.trim()) {
      setError('Please provide a reason for your expert application.');
      setIsSubmitting(false);
      return;
    }

    if (formData.reason.length < 20) {
      setError(
        'Please provide a more detailed reason (minimum 20 characters).',
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/user/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: formData.reason.trim(),
          portfolioUrl: formData.portfolioUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(
        'Your expert application has been submitted successfully! Our team will review it soon.',
      );
      setFormData({ reason: '', portfolioUrl: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <FormTitle emoji="🎯">Apply to Become an Expert</FormTitle>
        <FormDescription>
          Experts can write articles and share their knowledge with the
          community. Tell us about your expertise and experience.
        </FormDescription>
      </FormHeader>

      <FormField>
        <FormLabel htmlFor="reason">
          Why do you want to become an expert? *
        </FormLabel>
        <FormTextarea
          id="reason"
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Describe your experience, expertise, and why you'd like to contribute as an expert writer..."
          disabled={isSubmitting}
          required
        />
        <HelperText>
          Please provide details about your background, experience, and how you
          plan to contribute (minimum 20 characters).
        </HelperText>
      </FormField>

      <FormField>
        <FormLabel htmlFor="portfolioUrl">
          Portfolio/Website URL (Optional)
        </FormLabel>
        <FormInput
          id="portfolioUrl"
          type="url"
          value={formData.portfolioUrl}
          onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
          placeholder="https://your-website.com"
          disabled={isSubmitting}
        />
        <HelperText>
          Share a link to your portfolio, GitHub, LinkedIn, or personal website
          to showcase your work.
        </HelperText>
      </FormField>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FormButton
        type="submit"
        disabled={isSubmitting}
        style={{ width: '100%' }}
      >
        {isSubmitting
          ? 'Submitting Application...'
          : 'Submit Expert Application'}
      </FormButton>
    </FormContainer>
  );
}
