import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Camera, Award, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export const AboutOverview: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-studio-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Collage */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl shadow-gold-500/5 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="South Indian Traditional Wedding Ceremony by Nithya Studio"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-studio-dark/95 backdrop-blur-md border border-gold-500/50 p-5 rounded-2xl shadow-2xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-cinzel font-bold text-xl">
                  ★
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-studio-light">
                    Heartfelt Dedication
                  </h4>
                  <p className="text-xs text-studio-muted">
                    Honoring Tamil rituals and authentic expressions with cinematic excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* Location Pill */}
            <div className="absolute top-4 left-4 bg-studio-black/80 backdrop-blur-md border border-studio-border/80 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs text-gold-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Karapattu, Uthangarai</span>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500/60" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                About Nithya Studio & Video
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-studio-light leading-tight">
              Where Ancient Traditions Meet <span className="text-gold-gradient">Modern Cinema</span>
            </h2>

            <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
              Rooted in <strong>Karapattu, Uthangarai Taluk</strong>, Nithya Studio & Video was established to give couples and families in Tamil Nadu an unmatched visual legacy. We understand the sanctity of Tamil nuptial ceremonies — the delicate rhythm of the Nadaswaram, the solemn sanctity of the Kanyadanam, and the euphoric roar of the Mangalyadharanam.
            </p>

            <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
              Our artists combine cinematic eye, gentle unobtrusive presence, and state-of-the-art 4K gear to preserve unscripted emotions and grand spectacles alike.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-studio-card/70 border border-studio-border/50">
                <Camera className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-studio-light uppercase tracking-wider">
                    Unscripted Emotion
                  </h4>
                  <p className="text-xs text-studio-muted mt-0.5">
                    Real smiles, tears of joy, and sacred rituals caught without awkward posing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-studio-card/70 border border-studio-border/50">
                <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-studio-light uppercase tracking-wider">
                    Heirloom Craftsmanship
                  </h4>
                  <p className="text-xs text-studio-muted mt-0.5">
                    Archival grade non-tearable albums designed to endure for generations.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link to="/about">
                <Button
                  variant="gold"
                  rightIcon={<ArrowRight className="w-4 h-4 text-studio-black" />}
                >
                  Discover Our Story
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="dark">
                  Visit Studio
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
