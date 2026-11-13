import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  alignment?: 'center' | 'left';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  alignment = 'center',
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        alignment === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl',
        className
      )}
    >
      {subtitle && (
        <div className={cn("inline-flex items-center gap-2 mb-3", alignment === 'center' && "justify-center")}>
          <span className="w-8 h-[1px] bg-gold-500/60" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            {subtitle}
          </span>
          <span className="w-8 h-[1px] bg-gold-500/60" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel font-bold text-studio-light tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-studio-muted font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
