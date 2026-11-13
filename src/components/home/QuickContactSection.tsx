import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, Clock, ArrowRight, CalendarCheck } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Button } from '../ui/Button';
import { buildWhatsAppLink } from '../../lib/utils';

export const QuickContactSection: React.FC = () => {
  const { settings } = useStudio();
  const whatsappUrl = buildWhatsAppLink(
    "Hello Nithya Studio & Video, I would like to enquire about your studio availability."
  );

  return (
    <section className="py-20 bg-studio-dark/80 relative border-t border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-studio-card via-studio-surface/90 to-studio-card border border-gold-500/30 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          
          {/* Subtle gold radial background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial-gold opacity-50 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Left Col: Studio Contact Details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gold-500/60" />
                <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                  Get in Touch
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-studio-light leading-tight">
                Let’s Preserve Your <span className="text-gold-gradient">Special Moments</span>
              </h2>

              <p className="text-sm text-studio-muted leading-relaxed">
                Whether you are planning a grand wedding in Uthangarai, a pre-wedding shoot across Tamil Nadu, or wish to print custom heirloom photo frames, we are just a message away.
              </p>

              {/* Verified Contact Details Grid */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-studio-light uppercase tracking-wider">
                      Studio Location
                    </h4>
                    <p className="text-xs text-studio-muted mt-0.5 leading-relaxed">
                      99, Karapattu Village and Post, Uthangarai Taluk, Karapattu, Tamil Nadu – 635306, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-studio-light uppercase tracking-wider">
                      Direct Phone & WhatsApp
                    </h4>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs text-gold-400 hover:underline font-semibold block mt-0.5"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-studio-light uppercase tracking-wider">
                      Official Email
                    </h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-xs text-studio-light hover:text-gold-400 transition-colors block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Instant Booking CTA Box */}
            <div className="bg-studio-black/80 border border-studio-border/80 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between text-center space-y-6">
              <div>
                <span className="w-12 h-12 rounded-full bg-gold-500/15 text-gold-400 inline-flex items-center justify-center mb-3">
                  <CalendarCheck className="w-6 h-6" />
                </span>
                <h3 className="text-xl font-cinzel font-bold text-studio-light">
                  Plan Ahead For Auspicious Dates
                </h3>
                <p className="text-xs text-studio-muted mt-2 max-w-sm mx-auto leading-relaxed">
                  Tamil wedding muhurtham dates book out rapidly. Secure your dates early with our team to guarantee full multi-camera & drone coverage.
                </p>
              </div>

              <div className="space-y-3">
                <Link to="/booking" className="block">
                  <Button
                    variant="gold"
                    size="lg"
                    fullWidth
                    leftIcon={<CalendarCheck className="w-4 h-4" />}
                  >
                    Send Online Booking Enquiry
                  </Button>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="dark"
                    size="lg"
                    fullWidth
                    leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
                    className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40"
                  >
                    Quick Chat on WhatsApp
                  </Button>
                </a>
              </div>

              <div className="pt-2 text-[11px] text-studio-muted flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>Operating Monday – Sunday: 9:00 AM – 9:00 PM</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
