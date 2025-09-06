'use client';

import { ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: var(--space-md);

  @media (max-width: 768px) {
    padding: var(--space-sm);
    align-items: flex-start;
    padding-top: 10vh;
  }
`;

const ModalContainer = styled.div`
  background: var(--background);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    max-width: none;
    width: 100%;
    max-height: 80vh;
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
    border-radius: var(--radius-md);
    max-height: 85vh;
  }
`;

const CloseButton = styled.button`
  background: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.25rem;
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:hover {
    background: var(--background);
    border-color: var(--primary-color);
    color: var(--text-primary);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
    top: var(--space-sm);
    right: var(--space-sm);

    &:hover {
      transform: none;
    }
  }
`;

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the modal when it opens - use requestAnimationFrame for better reliability
      const focusModal = () => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      };
      
      // Try both setTimeout and requestAnimationFrame for test compatibility
      setTimeout(focusModal, 0);
      requestAnimationFrame(focusModal);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <ModalContainer 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <CloseButton onClick={onClose} aria-label="Close Modal">
          ×
        </CloseButton>
        {children}
      </ModalContainer>
    </Overlay>,
    document.body,
  );
}
