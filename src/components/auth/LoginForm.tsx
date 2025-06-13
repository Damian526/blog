'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Title,
  FormContainer,
  Input,
  Button,
  ErrorMessage,
} from '@/styles/components/auth/authFormStyles';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const SubTitle = styled.p`
  text-align: center;
  color: var(--text-muted);
  margin: -var(--space-md) 0 var(--space-md) 0;
  font-size: var(--font-small);
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const InputLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 12px;
  background: var(--background);
  padding: 0 4px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  transition: all 0.2s ease;
  z-index: 1;
`;

const StyledInput = styled(Input)`
  padding: var(--space-lg) var(--space-md);

  &:focus + ${InputLabel} {
    color: var(--primary-color);
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--space-sm) 0;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary-color);
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: var(--font-small);
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
`;

const ForgotPasswordLink = styled.a`
  font-size: var(--font-small);
  color: var(--primary-color);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }
`;

const StyledButton = styled(Button)`
  padding: var(--space-lg);
  font-weight: 600;
  font-size: var(--font-medium);
  background: linear-gradient(135deg, var(--primary-color) 0%, #3b82f6 100%);
  border: none;
  box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.3);

  &:hover {
    background: linear-gradient(135deg, var(--primary-hover) 0%, #2563eb 100%);
    box-shadow: 0 6px 20px 0 rgba(37, 99, 235, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--text-muted);
    box-shadow: none;
    transform: none;
  }
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: var(--space-lg) 0;
  gap: var(--space-md);
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--border-color);
`;

const DividerText = styled.span`
  font-size: var(--font-small);
  color: var(--text-muted);
  padding: 0 var(--space-sm);
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--background);
  color: var(--text-primary);
  font-size: var(--font-small);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export default function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        emailOrUsername,
        password,
        rememberMe: rememberMe.toString(), // Pass rememberMe as string
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = '/dashboard';
      } else {
        setError('Invalid email/username or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setIsLoading(true);

    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <LoginWrapper>
      <div>
        <Title>Welcome Back</Title>
        <SubTitle>Sign in to your account to continue</SubTitle>
      </div>

      <FormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <StyledInput
            type="text"
            placeholder="Enter your email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <InputLabel>Email or Username</InputLabel>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <InputLabel>Password</InputLabel>
        </InputGroup>

        <RememberMeContainer>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
          </CheckboxContainer>
          <ForgotPasswordLink>Forgot password?</ForgotPasswordLink>
        </RememberMeContainer>

        <StyledButton type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </StyledButton>
      </FormContainer>

      <DividerContainer>
        <DividerLine />
        <DividerText>or</DividerText>
        <DividerLine />
      </DividerContainer>

      <SocialButton
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </SocialButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginWrapper>
  );
}
