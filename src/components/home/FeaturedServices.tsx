import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, CalendarCheck } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { buildWhatsAppLink, buildServiceEnquiryMessage } from '../../lib/utils';

export const FeaturedServices: React.FC = () => {
  const { services } = useStudio();
  const activeServices = services.filter((s) => s.is_active);

  return (
    <section className="py-20 bg-studio-dark/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Our Expertise"
          title="Mastercrafted Photography & Cinema"
          description="From grand auspicious matrimonial ceremonies to milestone family portraits, explore our dedicated services crafted with utmost care and technical mastery."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.slice(0, 6).map((service) => {
            const whatsappEnquiryUrl = buildWhatsAppLink(
              buildServiceEnquiryMessage(service.title)
            );

            return (
              <Card
                key={service.id}
                className="flex flex-col justify-between group overflow-hidden bg-studio-card/90"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-card via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-studio-black/80 backdrop-blur-md text-[10px] uppercase tracking-widest text-gold-400 font-semibold border border-gold-500/20">
                    Studio Service
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-cinzel font-semibold text-studio-light group-hover:text-gold-400 transition-colors mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-xs text-studio-muted leading-relaxed mb-6">
                      {service.short_description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-studio-border/60 flex items-center justify-between gap-3">
                    <Link
                      to={`/booking?service=${encodeURIComponent(service.title)}`}
                      className="flex-1"
                    >
                      <Button
                        variant="gold"
                        size="sm"
                        fullWidth
                        leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
                      >
                        Book Now
                      </Button>
                    </Link>

                    <a
                      href={whatsappEnquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button
                        variant="dark"
                        size="sm"
                        className="px-3 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30"
                        title="Enquire on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View all 9 services button */}
        <div className="text-center mt-12">
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All 9 Studio Services
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
