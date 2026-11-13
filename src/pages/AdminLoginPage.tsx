import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your administrative email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-studio-black">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial-gold opacity-20 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs text-studio-muted hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Card */}
        <div className="bg-studio-card/90 border border-gold-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 p-[1.5px] mx-auto mb-4 shadow-gold-glow-sm">
              <div className="w-full h-full bg-studio-black rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-gold-400" />
              </div>
            </div>

            <h1 className="font-cinzel text-2xl font-bold text-studio-light">
              Admin Portal
            </h1>
            <p className="text-xs uppercase tracking-wider text-gold-500 font-semibold mt-1">
              Nithya Studio & Video CMS
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-studio-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nithyastudio.in"
                  required
                  autoComplete="email"
                  className="w-full bg-studio-charcoal/80 border border-studio-border/70 rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder:text-studio-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-studio-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-studio-charcoal/80 border border-studio-border/70 rounded-xl pl-10 pr-4 py-3 text-sm text-studio-light placeholder:text-studio-muted focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3 mt-2 shadow-gold-glow-sm"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>

        </div>

        {/* Footer Security Note */}
        <p className="text-center text-[11px] text-studio-muted">
          Protected by Supabase Authentication & Row Level Security.
        </p>
      </div>
    </div>
  );
};
