import React, { useState } from 'react';
import { Bot, Save, Sparkles, MessageSquare, Mic, Volume2, Check, AlertCircle } from 'lucide-react';
import { AISettings } from '../../types/database.types';
import { useStudio } from '../../context/StudioContext';
import { Button } from '../ui/Button';

export const AIAssistantManager: React.FC = () => {
  const { aiSettings, updateAISettings } = useStudio();
  const [formData, setFormData] = useState<AISettings>(aiSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);
    const ok = await updateAISettings(formData);
    setIsSaving(false);
    if (ok) {
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 text-xs">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-base font-bold text-studio-light flex items-center gap-2">
            <Bot className="w-5 h-5 text-gold-400" />
            <span>AI Voice & Chat Assistant Configuration</span>
          </h3>
          <p className="text-xs text-studio-muted">
            Configure Google Gemini AI assistant behavior, studio domain knowledge, and voice chat features.
          </p>
        </div>

        <Button
          type="submit"
          variant="gold"
          size="sm"
          disabled={isSaving}
          leftIcon={<Save className="w-4 h-4 text-studio-black" />}
        >
          {isSaving ? "Saving..." : "Save AI Settings"}
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>AI Assistant configuration successfully saved and live across website!</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="p-6 rounded-2xl bg-studio-card/80 border border-studio-border space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-studio-border/60">
          <div>
            <h4 className="font-semibold text-sm text-studio-light">Enable Studio AI Assistant</h4>
            <p className="text-studio-muted text-[11px]">Display the floating "Speak with Nithya Studio" button on the website.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_enabled}
              onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-studio-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Assistant Name
            </label>
            <input
              type="text"
              value={formData.assistant_name}
              onChange={(e) => setFormData({ ...formData, assistant_name: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Gemini Model Version
            </label>
            <select
              value={formData.model_name}
              onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
            Welcome Greeting Message
          </label>
          <input
            type="text"
            value={formData.welcome_message}
            onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
            className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
            Domain Knowledge & System Prompt
          </label>
          <textarea
            rows={5}
            value={formData.system_prompt}
            onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
            className="w-full bg-studio-dark border border-studio-border rounded-xl p-3 text-studio-light focus:outline-none focus:border-gold-500 font-mono text-[11px] leading-relaxed resize-none"
          />
          <p className="text-[10px] text-studio-muted mt-1">
            Specify Karapattu studio details, services offered, booking guidance, and language preferences.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-studio-border/60">
          <div>
            <h4 className="font-semibold text-studio-light flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-gold-400" />
              <span>Voice Interaction (Speech-to-Text & Voice Reply)</span>
            </h4>
            <p className="text-studio-muted text-[11px]">Enables microphone input and spoken audio responses using the Web Speech API.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.voice_enabled}
              onChange={(e) => setFormData({ ...formData, voice_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-studio-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
          </label>
        </div>
      </div>
    </form>
  );
};
