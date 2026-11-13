import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Instagram, Youtube, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Button } from '../components/ui/Button';
import { buildWhatsAppLink } from '../lib/utils';

export const ContactPage: React.FC = () => {
  const { settings } = useStudio();
  const [formSent, setFormSent] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone) return;

    // Direct to WhatsApp with contact message
    const msg = `Hello Nithya Studio & Video,\n\nName: ${contactData.name}\nPhone: ${contactData.phone}\nMessage: ${contactData.message || 'I would like to get in touch.'}`;
    window.open(buildWhatsAppLink(msg), '_blank');
    setFormSent(true);
  };

  const whatsappDirect = buildWhatsAppLink(
    "Hello Nithya Studio & Video, I am visiting your contact page and would like to get in touch."
  );

  return (
    <div className="pt-28 pb-20 animate-fade-in">
      {/* Banner */}
      <div className="relative py-16 bg-studio-dark border-b border-studio-border/60 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block">
            We’d Love to Hear From You
          </span>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-studio-light">
            Contact Nithya Studio & Video
          </h1>
          <p className="mt-4 text-sm sm:text-base text-studio-muted max-w-2xl mx-auto">
            Located in Karapattu, Uthangarai Taluk, Tamil Nadu. Connect with our team for studio visits, custom packages, or date reservations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Official Business Details */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
                Official Studio Address
              </span>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light mt-1">
                {settings.business_name}
              </h2>
            </div>

            {/* Verified Address Card */}
            <div className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border/70 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-studio-light uppercase tracking-wider mb-1">
                    Studio Premises
                  </h3>
                  <address className="not-italic text-sm text-studio-muted leading-relaxed">
                    99, Karapattu Village and Post,<br />
                    Uthangarai Taluk,<br />
                    Karapattu, Tamil Nadu – 635306,<br />
                    India.
                  </address>
                  <a
                    href="https://maps.google.com/?q=Karapattu+Uthangarai+Tamil+Nadu+635306"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs text-gold-400 hover:underline font-semibold"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-studio-card/80 border border-studio-border/70 space-y-2">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 w-fit">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs uppercase tracking-wider text-studio-muted font-semibold">
                  Phone Number
                </h4>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-sm font-semibold text-studio-light hover:text-gold-400 block transition-colors"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                  Official WhatsApp
                </h4>
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-emerald-400 hover:underline block"
                >
                  {settings.whatsapp}
                </a>
              </div>
            </div>

            {/* Email & Social Links */}
            <div className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-studio-muted font-semibold">
                    Email Inquiries
                  </h4>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm text-studio-light hover:text-gold-400 transition-colors font-medium"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-studio-border/60 flex items-center justify-between">
                <span className="text-xs text-studio-muted">Connect on Social Channels:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-pink-400 hover:border-pink-500/50 transition-all"
                    title="Instagram @nithyastudiokpt"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-red-500 hover:border-red-500/50 transition-all"
                    title="YouTube @nithyastudiokpt"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Contact Form & Map View */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-studio-card/90 border border-studio-border/80 shadow-2xl backdrop-blur-md">
              <div className="mb-6">
                <h3 className="text-xl font-cinzel font-bold text-studio-light">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-studio-muted mt-1">
                  Have a quick question? Message us and we’ll respond quickly on WhatsApp or Phone.
                </p>
              </div>

              {formSent ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-cinzel text-base font-semibold text-studio-light">
                    Message Forwarded to WhatsApp
                  </h4>
                  <p className="text-xs text-studio-muted">
                    Your message details were prepared for WhatsApp. Feel free to send another message if needed.
                  </p>
                  <Button variant="dark" size="sm" onClick={() => setFormSent(false)}>
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-1.5">
                      Your Name <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-studio-dark/90 border border-studio-border rounded-xl px-4 py-3 text-sm text-studio-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-1.5">
                      Mobile Number <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="e.g. +91 98421 00000"
                      className="w-full bg-studio-dark/90 border border-studio-border rounded-xl px-4 py-3 text-sm text-studio-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-studio-light font-semibold mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      placeholder="Tell us about your event, photoshoot, or album inquiry..."
                      className="w-full bg-studio-dark/90 border border-studio-border rounded-xl px-4 py-3 text-sm text-studio-light focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    fullWidth
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Send to Studio via WhatsApp
                  </Button>
                </form>
              )}
            </div>

            {/* Google Maps Location Preview Frame */}
            <div className="rounded-2xl overflow-hidden border border-studio-border/70 h-64 relative bg-studio-surface">
              <iframe
                title="Nithya Studio & Video Karapattu Map Location"
                src="https://maps.google.com/maps?q=Karapattu,Uthangarai,Tamil+Nadu,635306&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 bg-studio-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gold-500/30 text-[11px] text-gold-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Karapattu, Uthangarai Taluk, TN 635306</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
