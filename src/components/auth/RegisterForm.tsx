'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/actions/auth';
import {
  Title,
  FormContainer,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
} from '@/styles/components/auth/authFormStyles';
import styled from 'styled-components';

const RegisterWrapper = styled.div`
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

const PasswordStrengthBar = styled.div<{ strength: number }>`
  width: 100%;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => props.strength}%;
    background: ${(props) =>
      props.strength < 30
        ? '#ef4444'
        : props.strength < 60
          ? '#f59e0b'
          : props.strength < 80
            ? '#3b82f6'
            : '#10b981'};
    transition: all 0.3s ease;
  }
`;

const PasswordStrengthText = styled.span<{ strength: number }>`
  font-size: 11px;
  color: ${(props) =>
    props.strength < 30
      ? '#ef4444'
      : props.strength < 60
        ? '#f59e0b'
        : props.strength < 80
          ? '#3b82f6'
          : '#10b981'};
  margin-top: 4px;
  display: block;
`;

const PasswordMatch = styled.span<{ isMatch: boolean; show: boolean }>`
  font-size: 11px;
  color: ${(props) => (props.isMatch ? '#10b981' : '#ef4444')};
  margin-top: 4px;
  display: ${(props) => (props.show ? 'block' : 'none')};
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

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check password strength
    if (passwordStrength < 50) {
      setError('Please choose a stronger password.');
      return;
    }

    try {
      const result = await registerUser({ name, email, password });
      
      if (result.success) {
        setSuccess(
          'Registration successful! Check your email to verify your account.',
        );
      } else {
        setError(result.error || 'An error occurred while registering.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred while registering.');
    }
  }

  return (
    <RegisterWrapper>
      <div>
        <Title>Create Account</Title>
        <SubTitle>Join our community and start your journey</SubTitle>
      </div>

      <FormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <StyledInput
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputLabel>Full Name</InputLabel>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputLabel>Email Address</InputLabel>
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputLabel>Password</InputLabel>
          {password.length > 0 && (
            <>
              <PasswordStrengthBar strength={passwordStrength} />
              <PasswordStrengthText strength={passwordStrength}>
                {getPasswordStrengthText(passwordStrength)} password
              </PasswordStrengthText>
            </>
          )}
        </InputGroup>

        <InputGroup>
          <StyledInput
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <InputLabel>Confirm Password</InputLabel>
          <PasswordMatch
            isMatch={passwordsMatch}
            show={confirmPassword.length > 0}
          >
            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
          </PasswordMatch>
        </InputGroup>

        <StyledButton type="submit">Create Account</StyledButton>
      </FormContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </RegisterWrapper>
  );
}
