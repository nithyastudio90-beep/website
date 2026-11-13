import React from 'react';
import { Link } from 'react-router-dom';
import { Film, CalendarCheck, MessageSquare, Check, Play, Youtube, Radio, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { YouTubeShowcase } from '../components/home/YouTubeShowcase';
import { buildWhatsAppLink, buildServiceEnquiryMessage } from '../lib/utils';
import { useStudio } from '../context/StudioContext';

export const WeddingVideographyPage: React.FC = () => {
  const { settings } = useStudio();
  const whatsappUrl = buildWhatsAppLink(
    buildServiceEnquiryMessage("Wedding Videography & Cinema Package")
  );

  const filmFeatures = [
    { title: '4K Ultra-HD Cinema', desc: 'Shot on high-dynamic-range cinema cameras with rich film color science and bokeh.' },
    { title: 'Crystal Audio Capture', desc: 'Multi-channel wireless lavalier microphones capturing Vedic mantras, laughter, and speeches.' },
    { title: 'Dynamic Gimbal Motion', desc: 'Smooth, cinematic gliding tracking shots along wedding aisles, stages, and processions.' },
    { title: 'Aerial Drone Angles', desc: 'Sweeping panoramic aerial vistas of the mandapam, wedding procession, and scenic backdrops.' },
    { title: 'Instagram Reel Teasers', desc: 'Fast, vertical 9:16 high-impact teaser videos ready for sharing on social channels within days.' },
    { title: 'Full Length Master Film', desc: 'Comprehensive archival film preserving every ritual, guest interaction, and stage blessing.' },
  ];

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="relative py-20 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=80"
            alt="Wedding Videography by Nithya Studio"
            className="w-full h-full object-cover brightness-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-dark via-studio-dark/50 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Cinematic Motion & Pristine Sound
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white mb-6">
            Cinematic Wedding Films
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-studio-light/80 max-w-2xl mx-auto mb-8">
            Turning your once-in-a-lifetime wedding into a breathtaking visual cinematic experience. High definition multi-camera capture and evocative musical storytelling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking?service=Wedding%20Videography">
              <Button variant="gold" size="lg" leftIcon={<CalendarCheck className="w-4 h-4 text-studio-black" />}>
                Book Wedding Videography
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="dark" size="lg" leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}>
                WhatsApp Video Enquiry
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Film Production Features */}
        <div>
          <SectionHeading
            subtitle="The Filmmaking Process"
            title="Cinematic Production Standards"
            description="We treat your wedding with the technical discipline of film production—from pre-event audio checks to nuanced color grading."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmFeatures.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border/70 hover:border-gold-500/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-cinzel text-lg font-semibold text-studio-light mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-studio-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Showcase Section */}
        <div>
          <YouTubeShowcase />
        </div>

        {/* Deliverables Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-studio-card/90 border border-gold-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
                Your Complete Film Package
              </span>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light">
                What You Receive With Nithya Studio Videography
              </h3>
              <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                All video footage is backed up immediately and edited by our in-house post-production team with licensed music tracks, dialogue audio enhancements, and color grading.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-studio-light">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Cinematic Highlight Teaser (3 to 5 minutes)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Full Comprehensive Ceremony Documentary (60 to 120 minutes)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Delivered on high-speed USB Drive + Private Cloud Link</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Optional Drone Aerial add-on for outdoor processions</span>
                </li>
              </ul>
            </div>

            <div className="text-center bg-studio-dark/80 p-8 rounded-2xl border border-studio-border/80 space-y-4">
              <Film className="w-12 h-12 text-gold-400 mx-auto" />
              <h4 className="font-cinzel text-xl font-bold text-studio-light">
                Secure Your Videography Team
              </h4>
              <p className="text-xs text-studio-muted max-w-sm mx-auto">
                Reach out to verify date availability and discuss multi-camera videography packages.
              </p>
              <Link to="/booking?service=Wedding%20Videography" className="block">
                <Button variant="gold" fullWidth size="lg">
                  Submit Videography Enquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
