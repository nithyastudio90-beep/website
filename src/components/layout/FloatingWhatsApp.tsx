import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { buildWhatsAppLink } from '../../lib/utils';
import { useStudio } from '../../context/StudioContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStudio();
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultMessage = "Hello Nithya Studio & Video, I am visiting your website and would like to enquire about your photography and videography services.";
  const whatsappUrl = buildWhatsAppLink(defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col">
      {/* Quick message tooltip popup */}
      {showTooltip && (
        <div className="mb-3 p-3 bg-studio-dark border border-gold-500/40 rounded-2xl shadow-2xl max-w-xs text-xs text-studio-light animate-fade-in relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-studio-muted hover:text-white"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-semibold text-gold-400 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Nithya Studio & Video
          </div>
          <p className="text-studio-muted">
            Have questions about wedding dates or packages? Chat directly with us on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-950/60 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
        aria-label="Chat with Nithya Studio & Video on WhatsApp"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:opacity-40" />
        <MessageSquare className="w-7 h-7 relative z-10" />

        {/* Floating tooltip label on desktop */}
        <span className="hidden md:block absolute right-full mr-3 px-3 py-1.5 bg-studio-black/95 text-studio-light text-xs font-medium rounded-lg border border-studio-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat on WhatsApp • {settings.phone}
        </span>
      </a>
    </div>
  );
};
