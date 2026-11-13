import React from 'react';
import { CheckCircle2, MessageSquare, PhoneCall, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Booking } from '../../types/database.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { buildWhatsAppLink, buildPreFilledBookingMessage, formatDate } from '../../lib/utils';
import { useStudio } from '../../context/StudioContext';

interface BookingSuccessModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  booking,
  onClose,
}) => {
  const { settings } = useStudio();
  if (!booking) return null;

  const whatsappMessage = buildPreFilledBookingMessage({
    name: booking.customer_name,
    phone: booking.mobile_number,
    service: booking.service_name,
    date: formatDate(booking.event_date),
    location: booking.event_location,
    message: booking.additional_message || undefined,
  });

  const whatsappUrl = buildWhatsAppLink(whatsappMessage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center py-2">
        {/* Animated Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-cinzel font-bold text-studio-light mb-1">
          Enquiry Received
        </h3>
        <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-3">
          Reference ID: #{booking.id.slice(-6).toUpperCase()}
        </p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5 text-left text-xs text-amber-200">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Important Notice:
          </p>
          <p className="text-studio-muted">
            This submission is an official <strong>booking enquiry</strong>. Our studio manager will review your date availability and contact you shortly to confirm your reservation and discuss custom packages.
          </p>
        </div>

        {/* Enquiry Summary */}
        <div className="bg-studio-surface/70 border border-studio-border/60 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between items-center py-1 border-b border-studio-border/40">
            <span className="text-studio-muted">Customer Name:</span>
            <span className="font-semibold text-studio-light">{booking.customer_name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-studio-border/40">
            <span className="text-studio-muted">Selected Service:</span>
            <span className="font-semibold text-gold-400">{booking.service_name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-studio-border/40">
            <span className="text-studio-muted">Event Date:</span>
            <span className="font-semibold text-studio-light">{formatDate(booking.event_date)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-studio-muted">Event Location:</span>
            <span className="font-semibold text-studio-light">{booking.event_location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="gold"
              fullWidth
              leftIcon={<MessageSquare className="w-4 h-4 text-emerald-950" />}
              className="bg-emerald-500 hover:bg-emerald-400 text-studio-black font-semibold"
            >
              Send Details to WhatsApp Now
            </Button>
          </a>

          <Button
            variant="dark"
            fullWidth
            onClick={onClose}
          >
            Done & Return to Website
          </Button>
        </div>

        <p className="text-[11px] text-studio-muted mt-4">
          For urgent queries, call us directly at{' '}
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="text-gold-400 hover:underline font-semibold"
          >
            {settings.phone}
          </a>
        </p>
      </div>
    </Modal>
  );
};
