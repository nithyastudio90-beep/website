import React, { useState } from 'react';
import { Save, Sparkles, Upload, Check, AlertCircle } from 'lucide-react';
import { HomepageContent } from '../../types/database.types';
import { Button } from '../ui/Button';
import { DataService } from '../../lib/supabase';

interface HomepageManagerProps {
  content: HomepageContent;
  onSave: (content: HomepageContent) => Promise<boolean>;
}

export const HomepageManager: React.FC<HomepageManagerProps> = ({ content, onSave }) => {
  const [formData, setFormData] = useState<HomepageContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    const res = await DataService.uploadImageToStorage(file, 'site/hero');
    setIsUploading(false);

    if (res.success && res.url) {
      setFormData(prev => ({ ...prev, hero_background_image: res.url! }));
      setFeedback({ type: 'success', message: 'New hero banner image uploaded to Supabase Storage.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to upload hero image.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const success = await onSave(formData);
    setIsSaving(false);

    if (success) {
      setFeedback({ type: 'success', message: 'Homepage content successfully updated in Supabase!' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to update homepage content.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            Homepage Content & Hero Banner
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Dynamically update hero headlines, subtitle, call-to-action buttons, and the cinematic background image.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 shadow-gold-glow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Homepage'}</span>
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

      {/* Hero Content Section */}
      <div className="bg-studio-card/60 p-6 rounded-2xl border border-studio-border space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Hero Section Content
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            Featured Badge Text
          </label>
          <input
            type="text"
            value={formData.featured_badge}
            onChange={(e) => setFormData({ ...formData, featured_badge: e.target.value })}
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            Hero Headline *
          </label>
          <input
            type="text"
            value={formData.hero_headline}
            onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
            required
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            Hero Subheadline Description *
          </label>
          <textarea
            rows={3}
            value={formData.hero_subheadline}
            onChange={(e) => setFormData({ ...formData, hero_subheadline: e.target.value })}
            required
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl p-4 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Primary CTA Button Label
            </label>
            <input
              type="text"
              value={formData.hero_cta_primary}
              onChange={(e) => setFormData({ ...formData, hero_cta_primary: e.target.value })}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Secondary CTA Button Label
            </label>
            <input
              type="text"
              value={formData.hero_cta_secondary}
              onChange={(e) => setFormData({ ...formData, hero_cta_secondary: e.target.value })}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Hero Background Image Upload */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light">
            Hero Cinematic Background Image
          </label>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-studio-dark border border-studio-border relative flex-shrink-0">
              <img
                src={formData.hero_background_image}
                alt="Current Hero Background"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="relative border border-dashed border-studio-border hover:border-gold-500 rounded-xl p-3 text-center cursor-pointer bg-studio-charcoal/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isUploading}
                />
                <p className="text-xs font-medium text-studio-light flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>{isUploading ? 'Uploading to Supabase Storage...' : 'Upload New Hero Banner Image'}</span>
                </p>
              </div>

              <input
                type="url"
                value={formData.hero_background_image}
                onChange={(e) => setFormData({ ...formData, hero_background_image: e.target.value })}
                placeholder="Or paste direct image URL"
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-[11px] text-studio-muted focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
