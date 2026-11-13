import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, CalendarCheck, MessageSquare, Check, Sparkles, Heart, Clock, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { INITIAL_GALLERY_IMAGES } from '../lib/constants';
import { buildWhatsAppLink, buildServiceEnquiryMessage } from '../lib/utils';

export const WeddingPhotographyPage: React.FC = () => {
  const weddingImages = INITIAL_GALLERY_IMAGES.filter(
    (img) => img.category_slug === 'wedding-photography'
  );

  const whatsappUrl = buildWhatsAppLink(
    buildServiceEnquiryMessage("Wedding Photography (Muhurtham & Reception)")
  );

  const rituals = [
    { name: 'Nalangu & Haldi Rituals', desc: 'Lively yellow paste blessings, song, laughter, and playful family camaraderie.' },
    { name: 'Janavasam / Groom Entry', desc: 'Festive procession, traditional percussion, and celebratory grand arrival.' },
    { name: 'Vrutham & Kanyadanam', desc: 'Solemn Vedic chanting, sacred vows, and heartfelt parental handover.' },
    { name: 'Mangalyadharanam & Tali', desc: 'The golden pinnacle moment of holy matrimony frozen forever in timeless clarity.' },
    { name: 'Saptapadi & Metti', desc: 'The seven sacred steps around the holy fire promising lifelong companionship.' },
    { name: 'Grand Evening Reception', desc: 'Regal couple portraits, stage greetings, lighting, and joyous dancing.' },
  ];

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative py-20 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
            alt="South Indian Wedding"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-dark via-studio-dark/50 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Sacred Rituals & Pure Emotions
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white mb-6">
            Luxury Wedding Photography
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-studio-light/80 max-w-2xl mx-auto mb-8">
            Specializing in traditional Tamil weddings, sacred Brahmin muhurthams, and contemporary celebrations across Karapattu, Uthangarai, Krishnagiri, and Tamil Nadu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking?service=Wedding%20Photography">
              <Button variant="gold" size="lg" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                Check Wedding Date Availability
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="dark" size="lg" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}>
                WhatsApp Wedding Consultation
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Rituals Coverage Showcase */}
        <div>
          <SectionHeading
            subtitle="Ceremonial Mastery"
            title="Honoring Every Sacred Ritual"
            description="Our photography team understands the chronological sequence, auspicious timing, and family significance of each phase of your marriage."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rituals.map((r, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border/70 hover:border-gold-500/40 transition-all"
              >
                <div className="text-gold-400 font-cinzel text-xl font-bold mb-2">
                  0{i + 1}.
                </div>
                <h3 className="font-cinzel text-lg font-semibold text-studio-light mb-2">
                  {r.name}
                </h3>
                <p className="text-xs text-studio-muted leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Wedding Gallery */}
        <div>
          <SectionHeading
            subtitle="Visual Moments"
            title="Recent Wedding Captures"
            description="A glimpse into the authentic smiles, sacred garlands, and emotional moments we have documented."
          />
          <GalleryGrid images={weddingImages} />
        </div>

        {/* Wedding Inclusions */}
        <div className="p-8 sm:p-12 rounded-3xl bg-studio-card/90 border border-gold-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
                Comprehensive Coverage
              </span>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light">
                What Our Wedding Photography Service Delivers
              </h3>
              <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                We bring a dedicated team of master candid photographers and traditional portrait artists with multiple camera angles and backup gear to ensure flawless preservation of your wedding day.
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-studio-light">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Dual photographer coverage: Candid photojournalism + Traditional group portraits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>High-resolution color-graded digital gallery with full private download rights</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Signature couple portraits before or after Muhurtham with studio lighting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Direct consultation with lead photographer prior to wedding day</span>
                </li>
              </ul>
            </div>

            <div className="text-center bg-studio-dark/80 p-8 rounded-2xl border border-studio-border/80 space-y-5">
              <Award className="w-12 h-12 text-gold-400 mx-auto" />
              <h4 className="font-cinzel text-xl font-bold text-studio-light">
                Reserve Your Wedding Date
              </h4>
              <p className="text-xs text-studio-muted max-w-sm mx-auto">
                Popular auspicious dates in Tamil Nadu fill fast. Enquire now with your wedding venue and dates.
              </p>
              <Link to="/booking?service=Wedding%20Photography" className="block">
                <Button variant="gold" fullWidth size="lg">
                  Submit Wedding Enquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
