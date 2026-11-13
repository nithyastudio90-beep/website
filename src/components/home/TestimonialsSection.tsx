import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { TESTIMONIALS } from '../../lib/constants';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-studio-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Kind Words"
          title="Loved by Couples & Families"
          description="Read genuine feedback from families whose most sacred days and milestones we have had the honor of immortalizing."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="p-8 flex flex-col justify-between bg-studio-card/80 border-studio-border/70 hover:border-gold-500/40 relative"
            >
              <div>
                {/* Gold Stars */}
                <div className="flex items-center gap-1 mb-4 text-gold-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>

                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-gold-500/20 mb-3" />

                {/* Review Content */}
                <p className="text-xs sm:text-sm text-studio-light/90 italic leading-relaxed mb-6">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-studio-border/60">
                <h4 className="font-cinzel text-base font-semibold text-studio-light">
                  {testimonial.client_name}
                </h4>
                <p className="text-xs text-gold-400 font-medium">
                  {testimonial.event}
                </p>
                <div className="flex items-center justify-between text-[11px] text-studio-muted mt-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-studio-muted" />
                    {testimonial.location}
                  </span>
                  <span>{testimonial.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
