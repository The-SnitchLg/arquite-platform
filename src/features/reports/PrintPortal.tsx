import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PrintPortalProps {
  children: React.ReactNode;
}

export const PrintPortal: React.FC<PrintPortalProps> = ({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById('arquite-print-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'arquite-print-root';
      document.body.appendChild(el);
    }
    setContainer(el);
  }, []);

  if (!container) return null;

  return createPortal(children, container);
};
