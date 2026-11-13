import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, Sparkles, Phone, MessageSquare, Clock } from 'lucide-react';
import { BookingForm } from '../components/booking/BookingForm';
import { useStudio } from '../context/StudioContext';
import { buildWhatsAppLink } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service') || undefined;
  const { settings } = useStudio();

  const directWhatsAppUrl = buildWhatsAppLink(
    "Hello Nithya Studio & Video, I am looking to book a photography session."
  );

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Banner */}
      <div className="relative py-16 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            Online Reservation Portal
          </span>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-studio-light">
            Book Your Session
          </h1>
          <p className="mt-4 text-sm sm:text-base text-studio-muted max-w-2xl mx-auto">
            Fill in your event details below to submit an official booking enquiry. Our studio team will review schedule availability and reach out to you promptly.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Booking Form */}
          <div className="lg:col-span-7">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-studio-light">
                Submit Booking Enquiry
              </h2>
              <p className="text-xs text-studio-muted mt-1">
                Please provide accurate contact details so we can reach you to verify your date.
              </p>
            </div>
            
            <BookingForm defaultService={selectedService} />
          </div>

          {/* Right Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Booking Notice Card */}
            <div className="p-6 rounded-2xl bg-studio-card/90 border border-gold-500/30 space-y-4">
              <div className="flex items-center gap-2 text-gold-400">
                <Sparkles className="w-5 h-5 shrink-0" />
                <h3 className="font-cinzel text-base font-bold text-studio-light">
                  How The Booking Works
                </h3>
              </div>

              <ol className="space-y-3 text-xs text-studio-muted list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-studio-light">Submit Enquiry:</strong> Fill out the form with your preferred service and event date.
                </li>
                <li>
                  <strong className="text-studio-light">Schedule Verification:</strong> Our studio manager checks photographer and equipment availability.
                </li>
                <li>
                  <strong className="text-studio-light">Consultation & Confirmation:</strong> We discuss your package preferences and confirm your date upon agreement.
                </li>
              </ol>

              <div className="pt-2 border-t border-studio-border/60 text-[11px] text-amber-200/90">
                * Note: Submitting this form is an enquiry. Official reservation is confirmed upon studio confirmation and advance booking.
              </div>
            </div>

            {/* Direct WhatsApp Quick Contact */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-studio-light">
                  Prefer Instant WhatsApp Chat?
                </h3>
                <p className="text-xs text-studio-muted mt-1">
                  Connect immediately with our team on WhatsApp for fast answers and instant date checks.
                </p>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="gold"
                  fullWidth
                  className="bg-emerald-500 hover:bg-emerald-400 text-studio-black font-semibold"
                >
                  Chat with Us on WhatsApp
                </Button>
              </a>
            </div>

            {/* Studio Hours & Phone */}
            <div className="p-6 rounded-2xl bg-studio-card/70 border border-studio-border/70 text-xs text-studio-muted space-y-3">
              <div className="flex items-center gap-2 text-studio-light font-semibold">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Studio Working Hours</span>
              </div>
              <p>Monday to Sunday: 9:00 AM – 9:00 PM</p>
              <div className="pt-2 border-t border-studio-border/40 flex items-center justify-between">
                <span>Call Studio directly:</span>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-gold-400 font-semibold hover:underline"
                >
                  {settings.phone}
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
