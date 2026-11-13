import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import { GalleryImage } from '../../types/database.types';
import { LightboxModal } from './LightboxModal';

interface GalleryGridProps {
  images: GalleryImage[];
  limit?: number;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, limit }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = limit ? images.slice(0, limit) : images;

  if (displayImages.length === 0) {
    return (
      <div className="text-center py-16 bg-studio-surface/40 rounded-2xl border border-studio-border/60">
        <Sparkles className="w-8 h-8 text-gold-500/60 mx-auto mb-3" />
        <p className="text-studio-muted text-sm">No photography works in this category currently.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative h-80 sm:h-84 rounded-xl overflow-hidden cursor-pointer bg-studio-card border border-studio-border/60 hover:border-gold-500/60 transition-all duration-500 hover:shadow-gold-glow-sm"
          >
            {/* Image */}
            <img
              src={image.thumbnail_url || image.image_url}
              alt={image.alt_text || image.title}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content & Hover Info */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-black/50 text-studio-light/80 group-hover:text-gold-400 group-hover:bg-gold-500/20 group-hover:scale-110 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold mb-1 block">
                  {image.category_slug?.replace('-', ' ')}
                </span>
                <h4 className="font-cinzel text-base font-semibold text-studio-light group-hover:text-white line-clamp-2">
                  {image.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={displayImages}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </>
  );
};
