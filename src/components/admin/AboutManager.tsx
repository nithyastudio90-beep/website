import React, { useState } from 'react';
import { Save, BookOpen, Upload, Check, AlertCircle } from 'lucide-react';
import { AboutContent } from '../../types/database.types';
import { Button } from '../ui/Button';
import { DataService } from '../../lib/supabase';

interface AboutManagerProps {
  content: AboutContent;
  onSave: (content: AboutContent) => Promise<boolean>;
}

export const AboutManager: React.FC<AboutManagerProps> = ({ content, onSave }) => {
  const [formData, setFormData] = useState<AboutContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    const res = await DataService.uploadImageToStorage(file, 'site/about');
    setIsUploading(false);

    if (res.success && res.url) {
      setFormData(prev => ({ ...prev, main_image_url: res.url! }));
      setFeedback({ type: 'success', message: 'About page showcase image uploaded.' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to upload image.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const success = await onSave(formData);
    setIsSaving(false);

    if (success) {
      setFeedback({ type: 'success', message: 'About Page content successfully updated in Supabase!' });
    } else {
      setFeedback({ type: 'error', message: 'Failed to update about content.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            About Us & Studio Story
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Manage your Karapattu heritage story, photography philosophy, years of experience, and studio imagery.
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
          <span>{isSaving ? 'Saving Changes...' : 'Save About Page'}</span>
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

      <div className="bg-studio-card/60 p-6 rounded-2xl border border-studio-border space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Studio Story & Headings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Page Main Title
            </label>
            <input
              type="text"
              value={formData.page_title}
              onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
              required
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Story Headline
            </label>
            <input
              type="text"
              value={formData.story_title}
              onChange={(e) => setFormData({ ...formData, story_title: e.target.value })}
              required
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            Page Subtitle Banner
          </label>
          <input
            type="text"
            value={formData.page_subtitle}
            onChange={(e) => setFormData({ ...formData, page_subtitle: e.target.value })}
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Years of Experience Stat
            </label>
            <input
              type="text"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Weddings Covered Stat
            </label>
            <input
              type="text"
              value={formData.weddings_covered}
              onChange={(e) => setFormData({ ...formData, weddings_covered: e.target.value })}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Story Paragraphs */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light">
            Story Paragraphs
          </label>
          {formData.story_paragraphs.map((p, idx) => (
            <textarea
              key={idx}
              rows={3}
              value={p}
              onChange={(e) => {
                const updated = [...formData.story_paragraphs];
                updated[idx] = e.target.value;
                setFormData({ ...formData, story_paragraphs: updated });
              }}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl p-3 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          ))}
        </div>

        {/* About Main Image */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light">
            About Showcase Image
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-studio-dark border border-studio-border relative flex-shrink-0">
              <img
                src={formData.main_image_url}
                alt="About Showcase"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="relative border border-dashed border-studio-border hover:border-gold-500 rounded-xl p-3 text-center cursor-pointer bg-studio-charcoal/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isUploading}
                />
                <p className="text-xs font-medium text-studio-light flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>{isUploading ? 'Uploading to Supabase Storage...' : 'Upload New About Photo'}</span>
                </p>
              </div>

              <input
                type="url"
                value={formData.main_image_url}
                onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
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
