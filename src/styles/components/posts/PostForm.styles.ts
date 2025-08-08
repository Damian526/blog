import styled from 'styled-components';
import { colors } from '../../colors';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg);
`;

export const TitleHeading = styled.h1`
  text-align: center;
  margin-bottom: var(--space-lg);
  color: ${colors.textPrimary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: var(--space-sm);
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const Input = styled.input`
  margin-bottom: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid ${colors.border};
  border-radius: var(--radius-md);
  font-size: var(--font-medium);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryBg};
  }
`;

export const Button = styled.button`
  background-color: ${colors.primary};
  color: ${colors.background};
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-medium);
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ErrorMessage = styled.p`
  color: ${colors.error};
  font-size: var(--font-small);
  margin-top: var(--space-xs);
`;
