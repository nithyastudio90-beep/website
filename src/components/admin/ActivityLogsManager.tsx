import React, { useState } from 'react';
import { Shield, Clock, RefreshCw, Filter, User, Activity, FileText } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import { DataService } from '../../lib/supabase';

export const ActivityLogsManager: React.FC = () => {
  const { activityLogs } = useStudio();
  const [logs, setLogs] = useState(activityLogs);
  const [filterAction, setFilterAction] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const refreshed = await DataService.fetchActivityLogs();
    setLogs(refreshed);
    setIsRefreshing(false);
  };

  const filteredLogs = (logs.length > 0 ? logs : activityLogs).filter(l => {
    if (filterAction === 'all') return true;
    return l.action.toLowerCase().includes(filterAction.toLowerCase());
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CONFIRM') || action.includes('SAVE')) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    if (action.includes('REJECT') || action.includes('DELETE')) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    return 'bg-gold-500/15 text-gold-400 border-gold-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-base font-bold text-studio-light">
            Administrative Activity & Audit Trail
          </h3>
          <p className="text-xs text-studio-muted">
            Immutable log of database updates, booking confirmations, rejections, and settings modifications.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Actions</option>
            <option value="CONFIRM">Booking Confirmations</option>
            <option value="REJECT">Booking Rejections</option>
            <option value="SAVE">Creations & Saves</option>
            <option value="UPDATE">Updates</option>
            <option value="DELETE">Deletions</option>
          </select>

          <Button
            variant="dark"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-studio-card/50 border border-studio-border/60 text-studio-muted">
          <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No activity logs recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-studio-border/70 overflow-hidden bg-studio-card/80 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-studio-surface/80 border-b border-studio-border/80 text-studio-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Admin / User</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border/50 text-studio-light">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-studio-surface/40 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-studio-muted text-[11px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-studio-light">
                    {log.user_email || log.user_id || 'Studio Admin'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-gold-400">
                    {log.entity_type} {log.entity_id ? `(#${log.entity_id.slice(-6)})` : ''}
                  </td>
                  <td className="py-3 px-4 text-studio-muted text-[11px]">
                    {log.details ? (
                      <span className="truncate max-w-[250px] inline-block font-mono">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
