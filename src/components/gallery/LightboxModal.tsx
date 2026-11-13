import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../../types/database.types';

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none animate-fade-in">
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-left">
          <h4 className="text-sm sm:text-base font-cinzel font-semibold text-studio-light">
            {currentImage.title}
          </h4>
          <span className="text-xs text-gold-400 capitalize">
            {currentImage.category_slug?.replace('-', ' ')} • {currentIndex + 1} of {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-studio-surface/80 border border-studio-border text-studio-light hover:text-gold-400 hover:border-gold-500/50 transition-colors"
            aria-label="Close image preview"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Prev Navigation Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-studio-dark/70 hover:bg-studio-surface border border-studio-border text-studio-light hover:text-gold-400 transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[82vh] w-full px-4 flex items-center justify-center z-10">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || currentImage.title}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-gold-500/20"
        />
      </div>

      {/* Next Navigation Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-studio-dark/70 hover:bg-studio-surface border border-studio-border text-studio-light hover:text-gold-400 transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Bottom details */}
      <div className="absolute bottom-4 inset-x-0 text-center text-xs text-studio-muted pointer-events-none">
        <span>Use arrow keys or click arrows to browse</span>
      </div>
    </div>
  );
};
