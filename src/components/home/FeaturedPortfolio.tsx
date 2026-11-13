import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { CategoryFilter } from '../gallery/CategoryFilter';
import { GalleryGrid } from '../gallery/GalleryGrid';
import { Button } from '../ui/Button';
import { useStudio } from '../../context/StudioContext';
import { DataService } from '../../lib/supabase';
import { GalleryImage } from '../../types/database.types';

export const FeaturedPortfolio: React.FC = () => {
  const { categories } = useStudio();
  const [activeCategory, setActiveCategory] = useState<string>('all');
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

  return (
    <section className="py-20 bg-studio-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Portfolio Gallery"
          title="Moments Frozen In Timeless Splendor"
          description="Immerse yourself in our recent visual captures spanning sacred weddings, picturesque pre-wedding rendezvous, and cherished family milestones."
        />

        {/* Filter Pills */}
        <div className="mb-10">
          <CategoryFilter
            categories={categories}
            activeSlug={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-xl bg-studio-card/60 animate-pulse border border-studio-border/40"
              />
            ))}
          </div>
        ) : (
          <GalleryGrid images={images} limit={6} />
        )}

        {/* Explore Full Gallery */}
        <div className="text-center mt-12">
          <Link to="/portfolio">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Full Gallery & Albums
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
