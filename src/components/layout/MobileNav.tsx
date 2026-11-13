import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, MessageSquare, Instagram, Youtube, CalendarCheck, ShieldCheck, MapPin, Mail } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';
import { buildWhatsAppLink } from '../../lib/utils';
import { Button } from '../ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { settings } = useStudio();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close drawer upon navigation
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio & Gallery', path: '/portfolio' },
    { name: 'Wedding Photography', path: '/wedding-photography' },
    { name: 'Wedding Videography', path: '/wedding-videography' },
    { name: 'Pre-Wedding Shoots', path: '/pre-wedding-photography' },
    { name: 'Book a Session', path: '/booking' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-studio-dark border-l border-studio-border/80 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-studio-border/60">
            <div>
              <h2 className="font-cinzel text-lg font-bold text-studio-light">
                NITHYA STUDIO
              </h2>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 font-semibold">
                & VIDEO • KARAPATTU
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-studio-surface text-studio-muted hover:text-gold-400 focus:outline-none"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 my-4">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-studio-surface border border-studio-border text-xs font-semibold text-studio-light hover:border-gold-500/50 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call Studio</span>
            </a>
            <a
              href={buildWhatsAppLink("Hello Nithya Studio & Video, I would like to enquire about your photography services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 mt-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-400 font-semibold border-l-2 border-gold-500 pl-4'
                      : 'text-studio-light/80 hover:text-gold-400 hover:bg-studio-surface/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Info & Social */}
        <div className="pt-6 border-t border-studio-border/60 space-y-4">
          <div className="space-y-1.5 text-xs text-studio-muted">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
              <span>99, Karapattu, Uthangarai Taluk, TN 635306</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>{settings.email}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-muted hover:text-gold-400"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-studio-surface border border-studio-border flex items-center justify-center text-studio-muted hover:text-gold-400"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="text-xs text-gold-400 flex items-center gap-1 font-medium bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs text-studio-muted hover:text-gold-400 flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 opacity-60" />
                Admin Login
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
