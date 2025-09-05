import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '@/components/ui/Modal';

// Mock ReactDOM.createPortal
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.body for portal
    document.body.innerHTML = '';
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const overlay = screen.getByText('Modal Content').parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    );

    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders close button and handles click', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles ESC key press to close modal', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on other key presses', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('prevents body scroll when modal is open', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('renders children correctly', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Modal Title</h1>
        <p>Modal description</p>
        <button>Action Button</button>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal description')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // The modal should have role="dialog"
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  it('focuses on modal when opened', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveFocus();
  });
});
