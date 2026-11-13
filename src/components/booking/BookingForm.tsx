import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, MapPin, MessageSquare, Send, AlertCircle, ShieldAlert } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { DataService } from '../../lib/supabase';
import { Booking } from '../../types/database.types';
import { Button } from '../ui/Button';
import { BookingSuccessModal } from './BookingSuccessModal';
import { isValidIndianMobile, isValidEmail, buildWhatsAppLink, buildPreFilledBookingMessage } from '../../lib/utils';

interface BookingFormProps {
  defaultService?: string;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ defaultService, className }) => {
  const { services } = useStudio();

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    email: '',
    service_id: '',
    service_name: defaultService || (services[0]?.title ?? 'Wedding Photography'),
    event_date: '',
    event_location: '',
    additional_message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Please provide your full name.';
    } else if (formData.customer_name.trim().length < 3) {
      newErrors.customer_name = 'Name must be at least 3 characters.';
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required for booking.';
    } else if (!isValidIndianMobile(formData.mobile_number)) {
      newErrors.mobile_number = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.email.trim() && !isValidEmail(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.service_name) {
      newErrors.service_name = 'Please select a service.';
    }

    if (!formData.event_date) {
      newErrors.event_date = 'Please select your event date.';
    } else {
      const selected = new Date(formData.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.event_date = 'Event date cannot be in the past.';
      }
    }

    if (!formData.event_location.trim()) {
      newErrors.event_location = 'Please specify the event venue or city.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'service_name') {
        const found = services.find((s) => s.title === value);
        return { ...prev, service_name: value, service_id: found ? found.id : '' };
      }
      return { ...prev, [name]: value };
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await DataService.submitBooking({
        customer_name: formData.customer_name,
        mobile_number: formData.mobile_number,
        email: formData.email,
        service_id: formData.service_id || null,
        service_name: formData.service_name,
        event_date: formData.event_date,
        event_location: formData.event_location,
        additional_message: formData.additional_message,
      });

      if (result.success && result.data) {
        setSubmittedBooking(result.data);
        // Reset form
        setFormData({
          customer_name: '',
          mobile_number: '',
          email: '',
          service_id: '',
          service_name: services[0]?.title ?? 'Wedding Photography',
          event_date: '',
          event_location: '',
          additional_message: '',
        });
      } else {
        setSubmitError(result.error || 'Failed to submit booking enquiry. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantWhatsApp = () => {
    const msg = buildPreFilledBookingMessage({
      name: formData.customer_name || undefined,
      phone: formData.mobile_number || undefined,
      service: formData.service_name,
      date: formData.event_date || undefined,
      location: formData.event_location || undefined,
      message: formData.additional_message || undefined,
    });
    window.open(buildWhatsAppLink(msg), '_blank');
  };

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-5 bg-studio-card/80 border border-studio-border/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        
        {submitError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <p className="font-semibold">Submission Failed</p>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
            Your Full Name <span className="text-gold-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              placeholder="e.g. Karthikeyan S"
              className={`w-full bg-studio-dark/90 border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder-studio-muted/60 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                errors.customer_name ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
              }`}
            />
          </div>
          {errors.customer_name && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.customer_name}</p>
          )}
        </div>

        {/* Mobile & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
              Mobile Number <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                placeholder="e.g. +91 98421 23456"
                className={`w-full bg-studio-dark/90 border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder-studio-muted/60 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                  errors.mobile_number ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
                }`}
              />
            </div>
            {errors.mobile_number && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.mobile_number}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
              Email Address <span className="text-studio-muted font-normal text-[11px]">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full bg-studio-dark/90 border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder-studio-muted/60 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                  errors.email ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Service & Event Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
              Select Service <span className="text-gold-400">*</span>
            </label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleInputChange}
              className={`w-full bg-studio-dark/90 border rounded-xl px-4 py-3 text-sm text-studio-light focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                errors.service_name ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
              }`}
            >
              {services.map((s) => (
                <option key={s.id} value={s.title} className="bg-studio-dark text-white">
                  {s.title}
                </option>
              ))}
            </select>
            {errors.service_name && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.service_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
              Event Date <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
              <input
                type="date"
                name="event_date"
                min={todayStr}
                value={formData.event_date}
                onChange={handleInputChange}
                className={`w-full bg-studio-dark/90 border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                  errors.event_date ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
                }`}
              />
            </div>
            {errors.event_date && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.event_date}</p>
            )}
          </div>
        </div>

        {/* Event Location */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
            Event Venue / City <span className="text-gold-400">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
            <input
              type="text"
              name="event_location"
              value={formData.event_location}
              onChange={handleInputChange}
              placeholder="e.g. Uthangarai, Karapattu, Krishnagiri, Harur, Salem..."
              className={`w-full bg-studio-dark/90 border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder-studio-muted/60 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                errors.event_location ? 'border-rose-500' : 'border-studio-border focus:border-gold-500'
              }`}
            />
          </div>
          {errors.event_location && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.event_location}</p>
          )}
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-2">
            Additional Details & Requirements <span className="text-studio-muted font-normal text-[11px]">(Optional)</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-studio-muted" />
            <textarea
              name="additional_message"
              rows={3}
              value={formData.additional_message}
              onChange={handleInputChange}
              placeholder="Share details about ceremony timing, special requests (drone, teaser video, luxury album)..."
              className="w-full bg-studio-dark/90 border border-studio-border rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder-studio-muted/60 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-studio-muted leading-relaxed">
          * Note: Submission of this form registers your enquiry with our studio team. Date reservations are confirmed after mutual schedule verification and advance booking.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? 'Submitting Enquiry...' : 'Submit Booking Enquiry'}
          </Button>

          <Button
            type="button"
            variant="dark"
            size="lg"
            className="w-full sm:w-auto shrink-0 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40"
            onClick={handleInstantWhatsApp}
            leftIcon={<MessageSquare className="w-4 h-4" />}
          >
            Enquire via WhatsApp
          </Button>
        </div>

      </form>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={submittedBooking !== null}
        booking={submittedBooking}
        onClose={() => setSubmittedBooking(null)}
      />
    </div>
  );
};
