import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Film, Image as ImageIcon } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { DataService } from '../lib/supabase';
import { GalleryImage } from '../types/database.types';
import { CategoryFilter } from '../components/gallery/CategoryFilter';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { YouTubeShowcase } from '../components/home/YouTubeShowcase';

export const PortfolioPage: React.FC = () => {
  const { categories } = useStudio();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      const res = await DataService.fetchGalleryImages(activeCategory);
      setImages(res);
      setLoading(false);
    }
    loadImages();
  }, [activeCategory]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="relative py-16 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Visual Gallery & Archives
          </span>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-studio-light">
            Our Photography Portfolio
          </h1>
          <p className="mt-4 text-sm sm:text-base text-studio-muted max-w-2xl mx-auto">
            Explore our visual craftsmanship across sacred wedding ceremonies, intimate outdoor pre-wedding moments, milestone birthdays, and archival album designs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            activeSlug={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Gallery Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="h-80 rounded-xl bg-studio-card/60 animate-pulse border border-studio-border/40"
              />
            ))}
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}

        {/* Video Showcase Section */}
        <div className="mt-24 pt-16 border-t border-studio-border/60">
          <YouTubeShowcase />
        </div>

      </div>
    </div>
  );
};
