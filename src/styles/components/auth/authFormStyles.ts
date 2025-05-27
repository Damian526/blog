import styled from 'styled-components';

export const Title = styled.h1`
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: var(--space-xl);
  text-align: center;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: var(--font-large);
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 480px) {
    font-size: var(--font-medium);
    margin-bottom: var(--space-md);
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: var(--space-md);
    max-width: none;
  }

  @media (max-width: 480px) {
    gap: var(--space-sm);
  }
`;

export const Input = styled.input`
  padding: var(--space-md);
  font-size: var(--font-medium);
  font-family: inherit;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  width: 100%;
  box-sizing: border-box;
  background: var(--background);
  color: var(--text-primary);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  min-height: 44px; /* Touch-friendly target */

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    padding: var(--space-md) var(--space-lg);
    font-size: var(--font-medium);
    min-height: 48px;
  }

  @media (max-width: 480px) {
    font-size: var(--font-small);
  }
`;

export const Button = styled.button`
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-medium);
  font-weight: 500;
  font-family: inherit;
  background: var(--primary-color);
  color: var(--background);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background: var(--text-muted);
    border-color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    min-height: 48px;

    &:hover {
      transform: none;
    }
  }

  @media (max-width: 480px) {
    font-size: var(--font-small);
  }
`;

export const ErrorMessage = styled.p`
  color: var(--error-color);
  font-size: var(--font-small);
  text-align: center;
  margin: var(--space-sm) 0 0 0;
  padding: var(--space-sm) var(--space-md);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const SuccessMessage = styled.p`
  color: var(--success-color);
  font-size: var(--font-small);
  text-align: center;
  margin: var(--space-sm) 0 0 0;
  padding: var(--space-sm) var(--space-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-md);

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;
