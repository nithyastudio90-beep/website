import React, { useState } from 'react';
import { Save, Check, MapPin, Phone, Mail, Instagram, Youtube, Building } from 'lucide-react';
import { StudioSettings } from '../../types/database.types';
import { Button } from '../ui/Button';

interface StudioSettingsManagerProps {
  settings: StudioSettings;
  onUpdateSettings: (settings: StudioSettings) => Promise<boolean>;
}

export const StudioSettingsManager: React.FC<StudioSettingsManagerProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);

    const success = await onUpdateSettings(formData);
    setIsSaving(false);
    if (success) {
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex items-center justify-between">
        <div>
          <h3 className="font-cinzel text-base font-semibold text-studio-light">
            Studio Profile & Business Information
          </h3>
          <p className="text-xs text-studio-muted">
            Update your official address, primary phone number, email, and social handles.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Studio settings successfully updated and live across website!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-studio-card/80 border border-studio-border/70 space-y-6 text-xs">
        
        {/* Business Name */}
        <div>
          <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
            Official Business Name
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
            <input
              type="text"
              required
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
            Full Registered Studio Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-studio-muted" />
            <textarea
              rows={3}
              required
              value={formData.full_address}
              onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>
        </div>

        {/* Phone & WhatsApp Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
              Official Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
              Official WhatsApp Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
            Official Studio Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
              Instagram Channel URL
            </label>
            <div className="relative">
              <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1.5">
              YouTube Channel URL
            </label>
            <div className="relative">
              <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-studio-border/60 flex items-center justify-end">
          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Updating Profile...' : 'Save Studio Settings'}
          </Button>
        </div>

      </form>
    </div>
  );
};
