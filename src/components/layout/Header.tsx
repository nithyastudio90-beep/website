import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Phone, Menu, X, Instagram, Youtube, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useStudio();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Wedding Photography', path: '/wedding-photography' },
    { name: 'Wedding Videography', path: '/wedding-videography' },
    { name: 'Pre-Wedding', path: '/pre-wedding-photography' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-studio-black/90 backdrop-blur-md border-b border-studio-border/70 py-3 shadow-xl'
          : 'bg-gradient-to-b from-studio-black/90 via-studio-black/50 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Studio Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-[1.5px] shadow-gold-glow-sm group-hover:shadow-gold-glow transition-all">
              <div className="w-full h-full bg-studio-black rounded-[10px] flex items-center justify-center">
                <Camera className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-studio-light group-hover:text-gold-400 transition-colors">
                NITHYA STUDIO
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-500 font-semibold -mt-0.5">
                & VIDEO • KARAPATTU
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.slice(0, 4).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-xs tracking-wider uppercase font-medium transition-colors relative py-1 hover:text-gold-400',
                    isActive ? 'text-gold-400 font-semibold' : 'text-studio-light/80'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}

            {/* Special Highlights Dropdown / Direct Links */}
            <div className="relative group py-1">
              <button className="flex items-center gap-1 text-xs tracking-wider uppercase font-medium text-studio-light/80 group-hover:text-gold-400 transition-colors">
                <span>Specialities</span>
                <span className="text-[10px] text-gold-400">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-studio-dark/95 backdrop-blur-md border border-studio-border/80 rounded-xl shadow-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <Link
                  to="/wedding-photography"
                  className="block px-3 py-2 text-xs text-studio-light hover:text-gold-400 hover:bg-studio-surface/60 rounded-lg transition-colors"
                >
                  Wedding Photography
                </Link>
                <Link
                  to="/wedding-videography"
                  className="block px-3 py-2 text-xs text-studio-light hover:text-gold-400 hover:bg-studio-surface/60 rounded-lg transition-colors"
                >
                  Wedding Videography
                </Link>
                <Link
                  to="/pre-wedding-photography"
                  className="block px-3 py-2 text-xs text-studio-light hover:text-gold-400 hover:bg-studio-surface/60 rounded-lg transition-colors"
                >
                  Pre-Wedding Shoots
                </Link>
              </div>
            </div>

            <Link
              to="/contact"
              className={cn(
                'text-xs tracking-wider uppercase font-medium transition-colors py-1 hover:text-gold-400',
                location.pathname === '/contact' ? 'text-gold-400 font-semibold' : 'text-studio-light/80'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-2 border-r border-studio-border/60 pr-4">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-studio-muted hover:text-gold-400 hover:bg-studio-surface transition-all"
                title="Follow Nithya Studio on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-studio-muted hover:text-gold-400 hover:bg-studio-surface transition-all"
                title="Subscribe on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-8 h-8 rounded-full flex items-center justify-center text-studio-muted hover:text-gold-400 hover:bg-studio-surface transition-all"
                title={`Call ${settings.phone}`}
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Admin status link */}
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 text-xs text-gold-400 bg-gold-500/10 border border-gold-500/30 px-3 py-1.5 rounded-full hover:bg-gold-500/20 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-studio-muted hover:text-gold-400 p-1.5 rounded-lg transition-colors"
                title="Staff & Admin Portal"
              >
                <ShieldCheck className="w-4 h-4 opacity-50 hover:opacity-100" />
              </Link>
            )}

            {/* Primary Book Session CTA */}
            <Link to="/booking">
              <Button
                variant="gold"
                size="sm"
                leftIcon={<CalendarCheck className="w-4 h-4" />}
              >
                Book Session
              </Button>
            </Link>
          </div>

          {/* Mobile Menu & Book Button */}
          <div className="flex md:hidden items-center gap-2.5">
            <Link to="/booking">
              <Button variant="gold" size="sm" className="px-3 py-1.5 text-xs">
                Book
              </Button>
            </Link>

            <button
              onClick={onOpenMobileNav}
              className="p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-light hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
