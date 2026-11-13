import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-studio-card/85 backdrop-blur-md border border-studio-border/70 rounded-xl overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:border-gold-500/40 hover:-translate-y-1',
        glow && 'hover:shadow-gold-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
