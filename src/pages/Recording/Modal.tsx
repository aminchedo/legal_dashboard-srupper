import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Simple reusable modal used by recording related pages.
 * This component deliberately lives inside `src/pages/Recording` so it can be
 * imported via `./pages/Recording/Modal` from within `App.tsx` or any other
 * feature modules without updating legacy import paths that might still exist
 * in deployment artifacts.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        {/* Modal content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;