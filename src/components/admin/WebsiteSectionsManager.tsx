import React, { useState } from 'react';
import { Save, Layers, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { WebsiteSections } from '../../types/database.types';
import { Button } from '../ui/Button';

interface WebsiteSectionsManagerProps {
  sections: WebsiteSections;
  onSave: (sections: WebsiteSections) => Promise<boolean>;
}

export const WebsiteSectionsManager: React.FC<WebsiteSectionsManagerProps> = ({
  sections,
  onSave,
}) => {
  const [formData, setFormData] = useState<WebsiteSections>(sections);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const toggleSection = (key: keyof Omit<WebsiteSections, 'id' | 'updated_at'>) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    const success = await onSave(formData);
    setIsSaving(false);

    if (success) {
      setFeedback({ type: 'success', message: 'Website sections visibility updated!' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to update section toggles.' });
    }
  };

  const sectionItems: Array<{ key: keyof Omit<WebsiteSections, 'id' | 'updated_at'>; label: string; desc: string }> = [
    { key: 'show_hero', label: 'Cinematic Hero Banner', desc: 'Main headline, CTA buttons, and background image' },
    { key: 'show_about_overview', label: 'About Studio Preview', desc: 'Karapattu studio legacy overview on the homepage' },
    { key: 'show_services', label: 'Featured Services Grid', desc: 'All 9 studio photography and videography services' },
    { key: 'show_portfolio', label: 'Featured Portfolio Showcase', desc: 'Curated gallery images with category tabs' },
    { key: 'show_youtube', label: 'YouTube Video Reel', desc: 'Cinematic trailers and wedding highlight videos' },
    { key: 'show_instagram', label: 'Instagram Grid Banner', desc: '@nithyastudiokpt visual feed integration' },
    { key: 'show_testimonials', label: 'Customer Testimonials', desc: 'Reviews and feedback from families' },
    { key: 'show_quick_contact', label: 'Quick Contact Banner', desc: 'Instant WhatsApp and phone inquiry cards' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            Homepage Section Visibility
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Enable or disable sections displayed on your public homepage in real time.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 shadow-gold-glow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Visibility'}</span>
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-green-950/40 border-green-800/50 text-green-300'
              : 'bg-red-950/40 border-red-800/50 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionItems.map((item) => {
          const isVisible = formData[item.key];
          return (
            <div
              key={item.key}
              onClick={() => toggleSection(item.key)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isVisible
                  ? 'bg-studio-card/80 border-gold-500/40 shadow-sm'
                  : 'bg-studio-card/30 border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-studio-light">{item.label}</h4>
                </div>
                <p className="text-xs text-studio-muted">{item.desc}</p>
              </div>

              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
                  isVisible ? 'bg-gold-500' : 'bg-studio-charcoal'
                }`}
              >
                <div
                  className={`bg-studio-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isVisible ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
