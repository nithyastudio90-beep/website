import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { buildWhatsAppLink, buildServiceEnquiryMessage } from '../lib/utils';

export const ServicesPage: React.FC = () => {
  const { services } = useStudio();
  const activeServices = services.filter((s) => s.is_active);

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Banner */}
      <div className="relative py-16 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-16">
        <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Comprehensive Photography & Cinematography
          </span>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-studio-light">
            Our Studio Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-studio-muted max-w-2xl mx-auto">
            From life’s grandest celebrations to treasured physical keepsakes, explore the nine specialized photography and imaging services offered by Nithya Studio & Video.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {activeServices.map((service, index) => {
          const isEven = index % 2 === 0;
          const whatsappUrl = buildWhatsAppLink(buildServiceEnquiryMessage(service.title));

          return (
            <div
              key={service.id}
              id={service.slug}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-14 scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-studio-card/70 border border-studio-border/70 hover:border-gold-500/30 transition-all ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image Column */}
              <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] border border-studio-border/60 shadow-xl group">
                <img
                  src={service.image_url}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-studio-black/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-gold-400 font-semibold border border-gold-500/30">
                  Service #{index + 1}
                </span>
              </div>

              {/* Description & Action Column */}
              <div className="w-full lg:w-1/2 space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light mb-3">
                    {service.title}
                  </h2>
                  <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
                    {service.full_description || service.short_description}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                {service.features && service.features.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-2.5">
                      Highlights:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-studio-light/90">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to={`/booking?service=${encodeURIComponent(service.title)}`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="gold"
                      size="md"
                      fullWidth
                      leftIcon={<CalendarCheck className="w-4 h-4 text-studio-black" />}
                    >
                      Book This Service
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
                      size="md"
                      fullWidth
                      leftIcon={<MessageSquare className="w-4 h-4 text-emerald-400" />}
                      className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40"
                    >
                      WhatsApp Enquiry
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Custom Consultation CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-studio-card via-studio-surface to-studio-card border border-gold-500/40 text-center space-y-4">
          <h3 className="text-2xl font-cinzel font-bold text-studio-light">
            Need a Custom Combined Photography & Video Package?
          </h3>
          <p className="text-xs sm:text-sm text-studio-muted max-w-xl mx-auto leading-relaxed">
            We customize multi-day wedding packages including Muhurtham, Reception, Pre-Wedding, Drone coverage, and custom leatherette albums. Reach out to discuss your specific requirements.
          </p>
          <div className="pt-2">
            <Link to="/booking">
              <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Request Custom Package Consultation
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
