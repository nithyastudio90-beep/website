import React from 'react';
import { Instagram, ExternalLink, Heart } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { useStudio } from '../../context/StudioContext';

export const InstagramSection: React.FC = () => {
  const { settings } = useStudio();

  // Curated showcase tiles representing the latest reels & photo series
  const instaPosts = [
    {
      id: 'ig-1',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
      caption: 'Sacred garland moments in Karapattu #TamilWedding #NithyaStudio',
      likes: '482',
    },
    {
      id: 'ig-2',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      caption: 'Kanchipuram silk bridal portrait elegance #BridalGlow',
      likes: '629',
    },
    {
      id: 'ig-3',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      caption: 'Golden hour pre-wedding romance in Tamil Nadu hills #PreWedding',
      likes: '810',
    },
    {
      id: 'ig-4',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
      caption: 'Pure serenity and tender newborn photography #BabyShoot',
      likes: '512',
    },
  ];

  return (
    <section className="py-20 bg-studio-dark/60 border-t border-studio-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-8 h-[1px] bg-gold-500/60" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                Social Feed
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-studio-light">
              Follow Our Journey on <span className="text-pink-400">Instagram</span>
            </h2>
            <p className="text-xs sm:text-sm text-studio-muted mt-2">
              Connect with <span className="text-gold-400 font-medium">@nithyastudiokpt</span> for behind-the-scenes, daily reels & recent wedding teasers.
            </p>
          </div>

          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              variant="outline"
              leftIcon={<Instagram className="w-4 h-4 text-pink-400" />}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="border-pink-500/40 hover:border-pink-500 text-xs tracking-wider uppercase"
            >
              Follow @nithyastudiokpt
            </Button>
          </a>
        </div>

        {/* 4-Tile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {instaPosts.map((post) => (
            <a
              key={post.id}
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-studio-card border border-studio-border/60 hover:border-gold-500/50 transition-all duration-300 shadow-lg block"
            >
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover overlay with likes and Instagram icon */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between items-center text-center">
                <div className="self-end text-pink-400">
                  <Instagram className="w-5 h-5" />
                </div>

                <p className="text-xs text-studio-light line-clamp-3 px-2">
                  {post.caption}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
