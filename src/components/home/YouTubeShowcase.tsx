import React, { useState } from 'react';
import { Youtube, Play, ExternalLink, Film } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useStudio } from '../../context/StudioContext';
import { YouTubeVideo } from '../../types/database.types';

export const YouTubeShowcase: React.FC = () => {
  const { youtubeVideos, settings } = useStudio();
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  return (
    <section className="py-20 bg-studio-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-[1px] bg-gold-500/60" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                Cinematic Wedding Films
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-studio-light">
              Watch Our Stories on <span className="text-red-500 font-bold">YouTube</span>
            </h2>
          </div>

          <a
            href={settings.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              variant="dark"
              leftIcon={<Youtube className="w-4 h-4 text-red-500" />}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="border-red-500/30 hover:border-red-500 text-xs uppercase tracking-wider"
            >
              Visit @nithyastudiokpt
            </Button>
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              className="group relative rounded-2xl overflow-hidden bg-studio-card border border-studio-border/70 hover:border-gold-500/50 transition-all duration-300 shadow-xl"
            >
              {/* Thumbnail / Visual */}
              <div className="relative aspect-video overflow-hidden bg-studio-dark">
                <img
                  src={
                    video.thumbnail_url ||
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />

                {/* Big Play Button Overlay */}
                <button
                  onClick={() => setActiveVideo(video)}
                  className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                  aria-label={`Play ${video.title}`}
                >
                  <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl pl-1 group-hover:bg-red-500 transition-colors">
                    <Play className="w-7 h-7 fill-white" />
                  </div>
                </button>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/80 text-[11px] font-semibold text-white tracking-wider flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-red-500" />
                  <span>4K UHD</span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="font-cinzel text-lg font-semibold text-studio-light group-hover:text-gold-400 transition-colors mb-2">
                  {video.title}
                </h3>
                <p className="text-xs text-studio-muted leading-relaxed line-clamp-2 mb-4">
                  {video.description || 'Watch our cinematic wedding highlights crafted with devotion by Nithya Studio & Video.'}
                </p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-studio-border/40">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-gold-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Play Highlight Film</span>
                    <span>→</span>
                  </button>

                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-studio-muted hover:text-white flex items-center gap-1"
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        <Modal
          isOpen={activeVideo !== null}
          onClose={() => setActiveVideo(null)}
          title={activeVideo?.title}
          maxWidth="2xl"
        >
          {activeVideo && (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}
        </Modal>

      </div>
    </section>
  );
};
