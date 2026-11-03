import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'terracotta' | 'neutral' | 'mint' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    sage: 'bg-sage-soft text-primary border border-emerald-100',
    terracotta: 'bg-terracotta-soft text-secondary border border-orange-100',
    mint: 'bg-teal-50 text-teal-800 border border-teal-200',
    neutral: 'bg-canvas-subtle text-ink-muted border border-border-subtle',
    outline: 'bg-white text-ink border border-border-subtle'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
