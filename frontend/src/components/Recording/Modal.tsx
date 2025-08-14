import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { colors, spacing, shadows, breakpoints, componentStyles } from './theme';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFocus = (e: React.FocusEvent) => {
    // Trap focus within modal
    if (!modalRef.current?.contains(e.target as Node)) {
      modalRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing.md,
  };

  const contentStyles: React.CSSProperties = {
    background: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: '16px',
    padding: spacing.xl,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: shadows.xl,
    width: '100%',
    position: 'relative',
  };

  // Responsive styles
  const responsiveStyles = `
    @media (max-width: ${breakpoints.md}) {
      .modal-overlay {
        padding: ${spacing.sm} !important;
      }
      
      .modal-content {
        max-width: 95vw !important;
        max-height: 95vh !important;
        padding: ${spacing.lg} !important;
      }
    }
    
    @media (min-width: ${breakpoints.md}) {
      .modal-content {
        max-width: ${maxWidth} !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div
        className="modal-overlay"
        style={overlayStyles}
        onClick={handleBackdropClick}
        onFocus={handleFocus}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className="modal-content"
          style={contentStyles}
          tabIndex={-1}
          role="document"
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between mb-6"
            style={{ 
              marginBottom: spacing.xl,
              gap: spacing.md,
            }}
          >
            <h2 
              id="modal-title"
              className="text-xl font-bold"
              style={{ 
                color: colors.text.primary,
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                flex: 1,
              }}
            >
              {title}
            </h2>
            
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant="secondary"
                size="sm"
                icon={X}
                aria-label="بستن مودال"
                style={{
                  minWidth: 'auto',
                  padding: spacing.sm,
                }}
              />
            )}
          </div>

          {/* Content */}
          <div 
            style={{
              maxHeight: 'calc(90vh - 120px)', // Account for header and padding
              overflowY: 'auto',
              ...componentStyles.scrollbar,
            } as React.CSSProperties}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;