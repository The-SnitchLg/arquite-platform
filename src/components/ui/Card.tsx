import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyle = hoverable ? 'transition-all duration-300 hover:shadow-hover hover:border-slate-300' : '';

  return (
    <div
      className={`bg-surface-white border border-border-subtle rounded-xl shadow-card ${paddings[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
