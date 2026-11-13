import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Film, Heart, Award, ShieldCheck, Sparkles, MapPin, CalendarCheck, Phone } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { useStudio } from '../context/StudioContext';
import { buildWhatsAppLink } from '../lib/utils';

export const AboutPage: React.FC = () => {
  const { settings, about } = useStudio();
  const whatsappUrl = buildWhatsAppLink(
    "Hello Nithya Studio & Video, I am reading about your studio and would like to connect."
  );

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Page Header Banner */}
      <div className="relative py-16 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-16">
        <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Our Legacy & Passion
          </span>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-studio-light">
            About {settings.business_name || "Nithya Studio & Video"}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-studio-muted max-w-2xl mx-auto">
            {about.page_subtitle || "Honoring heritage, sacred matrimonial rituals, and heartwarming familial celebrations with cinematic artistry in Karapattu, Tamil Nadu."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500/60" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                Our Story
              </span>
            </div>

            <h2 className="text-3xl font-cinzel font-bold text-studio-light leading-snug">
              {about.story_title || "Preserving Tamil Nadu's Auspicious Moments with Dignity and Joy"}
            </h2>

            <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
              {about.story_paragraphs?.[0] || "Established in Karapattu, Uthangarai Taluk, Nithya Studio & Video was born out of a genuine devotion to the art of visual storytelling. In South Indian weddings, rituals are not merely events—they are sacred transitions brimming with spiritual depth, ancestral blessings, and emotional bonds."}
            </p>

            <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
              {about.story_paragraphs?.[1] || "Whether it is the intimate turmeric blessings of the Nalangu, the regal beauty of the Kanchipuram silk saree, or the electric excitement of the bridegroom’s arrival, we stand quietly in the golden light, ensuring no glance or tear is forgotten."}
            </p>

            <div className="p-4 rounded-xl bg-studio-card/80 border border-gold-500/30 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <div className="text-xs text-studio-light">
                <span className="font-semibold block text-gold-400 mb-0.5">Physical Studio Location</span>
                {settings.address_line1}, {settings.address_line2 ? `${settings.address_line2}, ` : ''}{settings.taluk ? `${settings.taluk}, ` : ''}{settings.district_state ? `${settings.district_state} ` : 'Tamil Nadu '}– {settings.pincode}, India.
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl aspect-[4/3]">
              <img
                src={about.main_image_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"}
                alt="Nithya Studio & Video Photography"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Studio Principles */}
        <div className="py-12 border-y border-studio-border/60">
          <SectionHeading
            subtitle="Our Philosophy"
            title="What Sets Nithya Studio Apart"
            description="We balance timeless technical excellence with genuine human warmth."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-studio-card/60 border border-studio-border/60 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-studio-light mb-2">
                Candid & Traditional Harmony
              </h3>
              <p className="text-xs text-studio-muted leading-relaxed">
                We believe you shouldn't have to choose between natural candid storytelling and formal family portraits. We deliver both in magnificent fidelity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-studio-card/60 border border-studio-border/60 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-studio-light mb-2">
                4K Cinema & Aerials
              </h3>
              <p className="text-xs text-studio-muted leading-relaxed">
                Equipped with cinema-grade sensors, multi-axis motorized gimbals, and licensed drone aerial rigs, your wedding film feels like a motion picture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-studio-card/60 border border-studio-border/60 hover:border-gold-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-semibold text-studio-light mb-2">
                Archival Heirloom Albums
              </h3>
              <p className="text-xs text-studio-muted leading-relaxed">
                Each album is custom designed page-by-page and printed on tear-resistant, waterproof metallic and silk luster paper built to endure for decades.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-studio-card via-studio-surface to-studio-card border border-gold-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl font-cinzel font-bold text-studio-light">
            Ready to Plan Your Photography Experience?
          </h2>
          <p className="text-sm text-studio-muted max-w-xl mx-auto">
            Contact us today to check date availability for your wedding, pre-wedding shoot, or family function.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <Button variant="gold" size="lg" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                Submit Booking Enquiry
              </Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="dark" size="lg" leftIcon={<Phone className="w-4 h-4 text-emerald-400" />}>
                WhatsApp Direct (+91 84891 28362)
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
