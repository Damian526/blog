'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import styled from 'styled-components';
import { uploadImage } from '@/lib/supabase';
import Image from 'next/image';
import { api, User } from '@/server/api';

const FormContainer = styled.div`
  background: var(--background);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-large);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-light);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const Label = styled.label`
  font-size: var(--font-medium);
  font-weight: 500;
  color: var(--text-primary);
`;

const Input = styled.input`
  padding: var(--space-md);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
  background: var(--background);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: var(--background-tertiary);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
`;

const ProfilePicturePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--border-light);
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
  }
`;

const ProfilePictureInitials = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UploadButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--primary-color);
  font-size: var(--font-small);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--primary-color);
    color: var(--background);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const RemoveButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--error-color);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--error-color);
  font-size: var(--font-small);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--error-color);
    color: var(--background);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: var(--space-md) var(--space-xl);
  border: 2px solid;
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? `
        background: var(--primary-color);
        color: var(--background);
        border-color: var(--primary-color);

        &:hover:not(:disabled) {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `
      : `
        background: transparent;
        color: var(--text-secondary);
        border-color: var(--border-light);

        &:hover:not(:disabled) {
          background: var(--background-tertiary);
          border-color: var(--text-secondary);
        }
      `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
  font-weight: 500;

  ${({ $type }) =>
    $type === 'success'
      ? `
        background: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(16, 185, 129, 0.2);
      `
      : `
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border: 1px solid rgba(239, 68, 68, 0.2);
      `}
`;

const UserInfo = styled.div`
  background: var(--background-tertiary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);

  p {
    margin: 0;
    font-size: var(--font-small);
    color: var(--text-secondary);

    strong {
      color: var(--text-primary);
    }
  }
`;

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User>('current-user-profile', () => api.users.getCurrentProfile(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
      setProfilePicture(user.profilePicture || null);
    }
  }, [user]);

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 5MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }

      setIsUploadingImage(true);
      setMessage(null);

      try {
        const imageUrl = await uploadImage(file);
        setProfilePicture(imageUrl);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to upload image. Please try again.',
        });
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setMessage({ type: 'success', text: 'Profile picture removed' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setMessage({
        type: 'error',
        text: 'Current password is required to change password',
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters long',
      });
      setIsLoading(false);
      return;
    }

    try {
      interface UpdateData {
        name?: string;
        email?: string;
        profilePicture?: string;
        currentPassword?: string;
        newPassword?: string;
      }

      const updateData: UpdateData = {};
      const emailChanged = formData.email !== user?.email;

      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }

      if (emailChanged) {
        updateData.email = formData.email;
      }

      if (profilePicture !== user?.profilePicture) {
        updateData.profilePicture = profilePicture || '';
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.users.updateCurrentProfile(updateData);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Update session with new data
      if (updateData.name || updateData.email) {
        await update({
          name: updateData.name || user?.name,
          email: updateData.email || user?.email,
        });
      }

      // Refresh the SWR cache with new data
      mutate(response);
      if (emailChanged) {
        setTimeout(() => {
          mutate();
        }, 1000);
      } else {
        // Refresh user data immediately if email didn't change
        mutate();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <FormContainer>
        <Message $type="error">Failed to load profile data</Message>
      </FormContainer>
    );
  }

  if (!user) {
    return (
      <FormContainer>
        <div>Loading profile...</div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        {message && <Message $type={message.type}>{message.text}</Message>}

        <Section>
          <SectionTitle>Profile Picture</SectionTitle>
          <ProfilePictureContainer>
            <ProfilePicturePreview>
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile Picture"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="120px"
                />
              ) : (
                <ProfilePictureInitials>
                  {getUserInitials(user.name, user.email)}
                </ProfilePictureInitials>
              )}
            </ProfilePicturePreview>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <UploadButton
                type="button"
                onClick={handleImageUpload}
                disabled={isUploadingImage || isLoading}
              >
                {isUploadingImage ? 'Uploading...' : 'Upload Photo'}
              </UploadButton>
              {profilePicture && (
                <RemoveButton
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  Remove
                </RemoveButton>
              )}
            </div>
          </ProfilePictureContainer>
        </Section>

        <Section>
          <SectionTitle>Account Information</SectionTitle>
          <UserInfo>
            <p>
              <strong>Account created:</strong>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {user.verified ? 'Verified' : 'Unverified'}
            </p>
          </UserInfo>
        </Section>

        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <InputGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>Change Password</SectionTitle>
          <InputGroup>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
            />
          </InputGroup>
        </Section>

        <ButtonGroup>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => {
              setFormData({
                name: user.name || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setProfilePicture(user.profilePicture || null);
              setMessage(null);
            }}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingImage}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}
