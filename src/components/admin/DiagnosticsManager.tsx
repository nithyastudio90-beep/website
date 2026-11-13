import React, { useState, useEffect } from 'react';
import { Activity, Database, Key, Server, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DiagnosticsReport } from '../../types/database.types';
import { DataService, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/Button';

export const DiagnosticsManager: React.FC = () => {
  const [report, setReport] = useState<DiagnosticsReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const res = await DataService.checkConnectionHealth();
    setReport(res);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold-400" />
            <span>Supabase Cloud Diagnostics</span>
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Real-time status of your PostgreSQL database, Supabase Auth, Storage bucket, and schema cache.
          </p>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={runDiagnostics}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Checking...' : 'Run Diagnostics'}</span>
        </Button>
      </div>

      {/* Top Level Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Database */}
        <div className="p-5 rounded-2xl bg-studio-card border border-studio-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-studio-muted uppercase tracking-wider">Database Service</span>
            <Database className="w-4 h-4 text-gold-400" />
          </div>
          <div className="flex items-center gap-2">
            {report?.apiStatus === 'online' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-base font-bold text-studio-light capitalize">
              {report?.apiStatus || 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] text-studio-muted">
            Latency: {report?.responseTimeMs || 0}ms
          </p>
        </div>

        {/* Auth */}
        <div className="p-5 rounded-2xl bg-studio-card border border-studio-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-studio-muted uppercase tracking-wider">Auth Service</span>
            <ShieldCheck className="w-4 h-4 text-gold-400" />
          </div>
          <div className="flex items-center gap-2">
            {report?.authStatus === 'online' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-base font-bold text-studio-light capitalize">
              {report?.authStatus || 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] text-studio-muted">
            Session handling: JWT & RLS active
          </p>
        </div>

        {/* Storage */}
        <div className="p-5 rounded-2xl bg-studio-card border border-studio-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-studio-muted uppercase tracking-wider">Storage (CDN)</span>
            <Server className="w-4 h-4 text-gold-400" />
          </div>
          <div className="flex items-center gap-2">
            {report?.storageStatus === 'online' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-base font-bold text-studio-light capitalize">
              {report?.storageStatus || 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] text-studio-muted">
            Target bucket: <code className="text-gold-400">gallery</code>
          </p>
        </div>
      </div>

      {/* Database Tables Verification */}
      <div className="bg-studio-card/80 p-6 rounded-2xl border border-studio-border space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-studio-light">
          PostgreSQL Database Tables Status
        </h3>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(report.tablesStatus).map(([tableName, info]) => (
              <div
                key={tableName}
                className="p-3.5 bg-studio-charcoal/60 rounded-xl border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {info.exists ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-mono font-semibold text-studio-light">{tableName}</p>
                    <p className="text-[10px] text-studio-muted">
                      {info.exists ? `${info.count} records stored` : info.error || 'Pending migration'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    info.exists
                      ? 'bg-green-950/60 text-green-300 border border-green-800/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  {info.exists ? 'Ready' : 'Not Found'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-studio-muted gap-2">
          <span>Project Endpoint: <code className="text-gold-400 font-mono">{report?.projectUrl}</code></span>
          <span>Last probe: {report ? new Date(report.lastChecked).toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>
    </div>
  );
};
