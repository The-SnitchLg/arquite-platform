import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = 'md'
}) => {
  const maxSizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in no-print" />
        <DialogPrimitive.Content
          className={`modal-dialog-content fixed left-[50%] top-[50%] z-50 w-[94vw] ${maxSizes[maxWidth]} translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-surface-white p-6 shadow-modal border border-border-subtle focus:outline-none animate-in fade-in zoom-in-95`}
        >
          <div className="modal-header-section flex items-start justify-between pb-4 mb-4 border-b border-border-subtle no-print">
            <div>
              <DialogPrimitive.Title className="font-editorial text-2xl text-ink font-normal">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-1 text-sm text-ink-muted">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="rounded-full p-1.5 text-ink-muted hover:bg-canvas-subtle hover:text-ink transition-colors cursor-pointer">
              <X className="w-5 h-5" />
              <span className="sr-only">Cerrar</span>
            </DialogPrimitive.Close>
          </div>

          <div className="modal-body-content">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
