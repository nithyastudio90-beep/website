import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Check, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const AdminAccountManager: React.FC = () => {
  const { user, updatePassword, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    const res = await updatePassword(newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Your password was successfully updated in Supabase Auth.' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <h2 className="font-cinzel text-xl font-bold text-studio-light flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gold-400" />
          <span>Admin Security & Account</span>
        </h2>
        <p className="text-xs text-studio-muted mt-1">
          Manage your administrator password and authenticated session via Supabase Auth.
        </p>
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

      {/* Account Identity Card */}
      <div className="p-6 bg-studio-card rounded-2xl border border-studio-border space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-studio-light">
          Active Administrative Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-studio-charcoal/60 rounded-xl border border-white/5">
            <span className="text-studio-muted block mb-1">Authenticated Email</span>
            <span className="font-semibold text-white">{user?.email || 'Administrator'}</span>
          </div>

          <div className="p-3.5 bg-studio-charcoal/60 rounded-xl border border-white/5">
            <span className="text-studio-muted block mb-1">Assigned Role</span>
            <span className="font-semibold text-gold-400 capitalize">{user?.role || 'admin'}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="p-6 bg-studio-card rounded-2xl border border-studio-border space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-studio-light flex items-center gap-2">
          <Key className="w-4 h-4 text-gold-400" />
          <span>Update Admin Password</span>
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            New Password (minimum 8 characters)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <Button
            type="submit"
            variant="gold"
            size="sm"
            disabled={isSubmitting}
            className="shadow-gold-glow-sm"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};
