import styled from 'styled-components';

// Reusable form container
export const FormContainer = styled.form`
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

// Form header section
export const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

// Form title with emoji support
export const FormTitle = styled.h2<{ emoji?: string }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  ${({ emoji }) =>
    emoji &&
    `
    &::before {
      content: '${emoji}';
      font-size: 1.5rem;
    }
  `}

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Form description text
export const FormDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

// Form field wrapper
export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

// Form label
export const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
`;

// Form input
export const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f8fafc;
    color: #64748b;
    cursor: not-allowed;
  }
`;

// Form textarea
export const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f8fafc;
    color: #64748b;
    cursor: not-allowed;
  }
`;

// Primary form button
export const FormButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger';
}>`
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: #f1f5f9;
          color: #64748b;

          &:hover:not(:disabled) {
            background: #e2e8f0;
            color: #475569;
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
          }
        `;
      default:
        return '';
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Button group for multiple buttons
export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// Error message component
export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
`;

// Success message component
export const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.875rem;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  border-left: 4px solid #059669;
`;

// Helper text component
export const HelperText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

// Loading message component
export const LoadingMessage = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '⏳';
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
