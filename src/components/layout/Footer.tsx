import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Phone, Mail, Instagram, Youtube, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { buildWhatsAppLink } from '../../lib/utils';

export const Footer: React.FC = () => {
  const { settings, services } = useStudio();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-studio-dark border-t border-studio-border/70 pt-16 pb-8 text-studio-muted relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial-gold pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-studio-border/60">
          
          {/* Col 1: Studio Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-[1.5px] shadow-gold-glow-sm">
                <div className="w-full h-full bg-studio-black rounded-[10px] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold text-studio-light tracking-wider">
                  NITHYA STUDIO
                </span>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold-500 font-semibold -mt-0.5">
                  & VIDEO • KARAPATTU
                </p>
              </div>
            </div>

            <p className="text-xs text-studio-muted leading-relaxed">
              Premier destination for luxury wedding photography, cinematic films, and timeless portraits in Karapattu, Uthangarai, and across Tamil Nadu. Capturing raw emotions and sacred moments.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-muted hover:text-gold-400 hover:border-gold-500/50 transition-all"
                title="Follow on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-muted hover:text-gold-400 hover:border-gold-500/50 transition-all"
                title="Watch on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={buildWhatsAppLink("Hello Nithya Studio & Video, I am contacting you from your website footer.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-muted hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                title="Connect on WhatsApp"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Services */}
          <div>
            <h3 className="text-sm font-cinzel font-semibold text-studio-light uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Our Services</span>
              <span className="w-6 h-[1px] bg-gold-500/60" />
            </h3>
            <ul className="space-y-2 text-xs">
              {services.slice(0, 7).map((srv) => (
                <li key={srv.id}>
                  <Link
                    to={`/services#${srv.slug}`}
                    className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-gold-500/60" />
                    <span>{srv.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-gold-400 hover:underline inline-block pt-1 text-[11px] font-medium"
                >
                  View all 9 studio services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-sm font-cinzel font-semibold text-studio-light uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Quick Links</span>
              <span className="w-6 h-[1px] bg-gold-500/60" />
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">About Our Studio</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-gold-400 transition-colors">Portfolio & Galleries</Link>
              </li>
              <li>
                <Link to="/wedding-photography" className="hover:text-gold-400 transition-colors">Wedding Photography</Link>
              </li>
              <li>
                <Link to="/wedding-videography" className="hover:text-gold-400 transition-colors">Wedding Videography</Link>
              </li>
              <li>
                <Link to="/pre-wedding-photography" className="hover:text-gold-400 transition-colors">Pre-Wedding Shoots</Link>
              </li>
              <li>
                <Link to="/booking" className="text-gold-400 font-semibold hover:underline">Online Booking Enquiry</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">Studio Location & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Address */}
          <div>
            <h3 className="text-sm font-cinzel font-semibold text-studio-light uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Studio Address</span>
              <span className="w-6 h-[1px] bg-gold-500/60" />
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <address className="not-italic text-studio-light/80 leading-relaxed">
                  99, Karapattu Village and Post,<br />
                  Uthangarai Taluk,<br />
                  Karapattu, Tamil Nadu – 635306,<br />
                  India.
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-studio-light hover:text-gold-400 transition-colors font-medium"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-studio-light hover:text-gold-400 transition-colors"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Developer Attribution & Admin Portal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1 text-studio-muted text-center sm:text-left">
            <span>© {currentYear} {settings.business_name}. All rights reserved.</span>
          </div>

          {/* Developer Attribution Lead Button */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919025410200?text=Hello!%20I%20visited%20the%20Nithya%20Studio%20%26%20Video%20website.%20I%20would%20also%20like%20to%20create%20a%20professional%20website%20for%20my%20business.%20Could%20you%20please%20share%20the%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-surface/90 border border-gold-500/30 text-studio-light/90 hover:text-gold-400 hover:border-gold-500/70 hover:bg-gold-500/10 shadow-sm transition-all group"
              title="Contact Developer via WhatsApp: +91 90254 10200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 group-hover:scale-125 transition-transform shadow-gold-glow-sm" />
              <span className="text-[11px] font-medium tracking-wide">
                Crafted Your Digital Presence
              </span>
              <span className="text-[10px] text-gold-400/80 group-hover:translate-x-0.5 transition-transform">↗</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-studio-muted/70 hover:text-gold-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
