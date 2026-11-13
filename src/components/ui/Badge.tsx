import React from 'react';
import { cn } from '../../lib/utils';
import { BookingStatus } from '../../types/database.types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'default' | 'success' | 'warning' | 'info' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    gold: 'bg-gold-500/15 text-gold-400 border border-gold-500/30',
    default: 'bg-studio-surface text-studio-muted border border-studio-border',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant="warning">⏳ Pending Review</Badge>;
    case 'Confirmed':
      return <Badge variant="success">✓ Confirmed</Badge>;
    case 'Completed':
      return <Badge variant="info">★ Completed</Badge>;
    case 'Cancelled':
      return <Badge variant="danger">✕ Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
