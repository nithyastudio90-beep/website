import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, CalendarCheck, MessageSquare, ArrowRight, Award, Film, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { buildWhatsAppLink } from '../../lib/utils';
import { useStudio } from '../../context/StudioContext';

export const HeroSection: React.FC = () => {
  const { settings } = useStudio();
  const whatsappUrl = buildWhatsAppLink(
    "Hello Nithya Studio & Video, I am interested in checking your availability and booking a photography session."
  );

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Cinematic Visual with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury South Indian Wedding Photography by Nithya Studio"
          className="w-full h-full object-cover object-center filter brightness-[0.32] scale-105 transform animate-pulse-subtle"
        />
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-studio-black via-studio-black/60 to-studio-black/40" />
        <div className="absolute inset-0 bg-radial-gold opacity-30" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio-surface/80 border border-gold-500/30 backdrop-blur-md mb-6 animate-fade-in shadow-gold-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
            Premier Photography & Cinematography
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-bold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-md">
          Capturing <span className="text-gold-gradient">Eternal</span> Moments,{' '}
          <span className="italic font-normal">Crafting</span> Legacies.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-studio-light/80 font-normal leading-relaxed mb-10">
          From sacred traditional weddings and romantic pre-wedding stories to 4K cinematic films and heirloom albums. Based in Karapattu, serving Tamil Nadu with artistic devotion.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/portfolio" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Our Work
            </Button>
          </Link>

          <Link to="/booking" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              leftIcon={<CalendarCheck className="w-4 h-4 text-studio-black" />}
            >
              Book Your Session
            </Button>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="dark"
              size="lg"
              fullWidth
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
              className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40"
            >
              WhatsApp Booking
            </Button>
          </a>
        </div>

        {/* Key Studio Features Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-studio-border/50 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 bg-studio-dark/60 backdrop-blur-md p-3 rounded-xl border border-studio-border/40">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-studio-light">Ultra-HD & Candid</p>
              <p className="text-[11px] text-studio-muted">Sacred ritual coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-studio-dark/60 backdrop-blur-md p-3 rounded-xl border border-studio-border/40">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-studio-light">4K Cinema & Drone</p>
              <p className="text-[11px] text-studio-muted">Cinematic wedding films</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-studio-dark/60 backdrop-blur-md p-3 rounded-xl border border-studio-border/40 col-span-2 md:col-span-1">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-studio-light">Heirloom Albums</p>
              <p className="text-[11px] text-studio-muted">Handcrafted acrylic & wood</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
