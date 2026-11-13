import React from 'react';
import { GalleryCategory } from '../../types/database.types';
import { cn } from '../../lib/utils';

interface CategoryFilterProps {
  categories: GalleryCategory[];
  activeSlug: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeSlug,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border select-none',
              isActive
                ? 'bg-gold-500 text-studio-black border-gold-500 font-semibold shadow-gold-glow-sm'
                : 'bg-studio-surface/80 text-studio-muted border-studio-border/70 hover:text-studio-light hover:border-gold-500/40'
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
