import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, CalendarCheck, MessageSquare, Check, Sparkles, MapPin, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { INITIAL_GALLERY_IMAGES } from '../lib/constants';
import { buildWhatsAppLink, buildServiceEnquiryMessage } from '../lib/utils';

export const PreWeddingPhotographyPage: React.FC = () => {
  const preWedImages = INITIAL_GALLERY_IMAGES.filter(
    (img) => img.category_slug === 'pre-wedding'
  );

  const whatsappUrl = buildWhatsAppLink(
    buildServiceEnquiryMessage("Pre-Wedding Couple Photoshoot Package")
  );

  const destinations = [
    { name: 'Krishnagiri Dam & Lakeview', desc: 'Scenic reservoir waters, open horizon sunsets, and tranquil grassy banks.' },
    { name: 'Karapattu & Uthangarai Countryside', desc: 'Verdant green coconut groves, rustic village paths, and pastoral golden hour light.' },
    { name: 'Yercaud & Shevaroy Hilltops', desc: 'Misty pine forests, winding mountain roads, and romantic elevated viewpoints.' },
    { name: 'Heritage Temple Backdrops', desc: 'Ancient stone pillars, traditional attire styling, and historic Dravidian architecture.' },
  ];

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Banner */}
      <div className="relative py-20 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=80"
            alt="Pre-Wedding Photoshoot"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-dark via-studio-dark/50 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Love in Golden Hour Light
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white mb-6">
            Pre-Wedding Photography
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-studio-light/80 max-w-2xl mx-auto mb-8">
            Celebrate your intimate bond in scenic natural landscapes before the wedding day flurry. Relaxed, artistic, and completely unique to your journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking?service=Pre-Wedding%20Photography">
              <Button variant="gold" size="lg" leftIcon={<CalendarCheck className="w-4 h-4 text-studio-black" />}>
                Book Pre-Wedding Shoot
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="dark" size="lg" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}>
                WhatsApp Location Ideas
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Destination Ideas */}
        <div>
          <SectionHeading
            subtitle="Scenic Backdrops"
            title="Curated Locations Across Tamil Nadu"
            description="We guide you to scenic sunrise and golden hour locations that complement your attire and visual aesthetic."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border/70 hover:border-gold-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 w-fit mb-3">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="font-cinzel text-base font-semibold text-studio-light mb-2">
                    {d.name}
                  </h3>
                  <p className="text-xs text-studio-muted leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <SectionHeading
            subtitle="Recent Couple Shoots"
            title="Pre-Wedding Romance Gallery"
            description="Authentic chemistry and cinematic color palettes captured by Nithya Studio & Video."
          />
          <GalleryGrid images={preWedImages} />
        </div>

        {/* What to Expect */}
        <div className="p-8 sm:p-12 rounded-3xl bg-studio-card/90 border border-gold-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
                Stress-Free Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light">
                Why Couples Love Our Pre-Wedding Sessions
              </h3>
              <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                Many couples feel self-conscious in front of a camera at first. Our photographers use a gentle, candid directorial style that makes the shoot feel like a relaxed date rather than a forced pose session.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-studio-light">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Up to 3 costume changes (traditional silk, western, or casual)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Optimal sunrise and sunset golden hour lighting scheduling</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Save-The-Date digital invites designed for WhatsApp & Instagram</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>All high-resolution edited photos ready before wedding day</span>
                </li>
              </ul>
            </div>

            <div className="text-center bg-studio-dark/80 p-8 rounded-2xl border border-studio-border/80 space-y-4">
              <Heart className="w-12 h-12 text-gold-400 mx-auto" />
              <h4 className="font-cinzel text-xl font-bold text-studio-light">
                Plan Your Couple Shoot
              </h4>
              <p className="text-xs text-studio-muted max-w-sm mx-auto">
                Discuss dates and choose scenic locations with our studio team.
              </p>
              <Link to="/booking?service=Pre-Wedding%20Photography" className="block">
                <Button variant="gold" fullWidth size="lg">
                  Enquire for Pre-Wedding Shoot
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
