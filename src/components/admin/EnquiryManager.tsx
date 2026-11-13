import React, { useState } from 'react';
import { Mail, Phone, Calendar, Clock, CheckCircle2, MessageSquare, Trash2, Search, Filter } from 'lucide-react';
import { CustomerEnquiry, EnquiryStatus } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDisplayDate, buildWhatsAppLink } from '../../lib/utils';

interface EnquiryManagerProps {
  enquiries: CustomerEnquiry[];
  onUpdateStatus: (id: string, status: EnquiryStatus, adminNotes?: string) => Promise<boolean>;
  onDeleteEnquiry?: (id: string) => Promise<boolean>;
}

export const EnquiryManager: React.FC<EnquiryManagerProps> = ({
  enquiries,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (e: CustomerEnquiry) => {
    setSelectedEnquiry(e);
    setAdminNotes(e.admin_notes || '');
  };

  const handleSaveStatus = async (status: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    await onUpdateStatus(selectedEnquiry.id, status, adminNotes);
    setIsUpdating(false);
    setSelectedEnquiry(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            Customer Contact Enquiries
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Review general messages submitted via the Contact Us page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-studio-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-studio-charcoal border border-studio-border text-xs rounded-xl pl-9 pr-3 py-2 text-studio-light placeholder:text-studio-muted focus:outline-none focus:border-gold-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-studio-charcoal border border-studio-border text-xs rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {filteredEnquiries.map((e) => (
          <div
            key={e.id}
            onClick={() => handleOpenModal(e)}
            className="p-5 bg-studio-card/60 hover:bg-studio-card rounded-2xl border border-studio-border/70 hover:border-gold-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  e.status === 'New' ? 'bg-amber-950/70 border border-amber-800 text-amber-300' :
                  e.status === 'Contacted' ? 'bg-blue-950/70 border border-blue-800 text-blue-300' :
                  e.status === 'Resolved' ? 'bg-green-950/70 border border-green-800 text-green-300' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {e.status}
                </span>
                <h4 className="text-sm font-semibold text-studio-light truncate">{e.customer_name}</h4>
                <span className="text-[11px] text-studio-muted">• {formatDisplayDate(e.created_at)}</span>
              </div>

              <p className="text-xs text-studio-muted line-clamp-1">"{e.message}"</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-studio-muted flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>{e.phone}</span>
              </span>
              {e.email && (
                <span className="hidden md:flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-400" />
                  <span>{e.email}</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredEnquiries.length === 0 && (
          <div className="py-16 text-center text-studio-muted bg-studio-card/40 rounded-2xl border border-studio-border">
            <MessageSquare className="w-10 h-10 mx-auto text-studio-muted/40 mb-3" />
            <p className="text-sm">No customer enquiries found matching your search.</p>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title="Customer Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-4">
            <div className="p-4 bg-studio-charcoal rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-studio-muted">Customer Name:</span>
                <span className="font-semibold text-white">{selectedEnquiry.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-studio-muted">Phone Number:</span>
                <span className="font-mono text-gold-400">{selectedEnquiry.phone}</span>
              </div>
              {selectedEnquiry.email && (
                <div className="flex justify-between">
                  <span className="text-studio-muted">Email Address:</span>
                  <span className="text-white">{selectedEnquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-studio-muted">Received At:</span>
                <span className="text-studio-light">{new Date(selectedEnquiry.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1">
                Customer Message
              </label>
              <div className="p-3 bg-studio-dark rounded-xl border border-studio-border text-xs text-studio-light leading-relaxed">
                "{selectedEnquiry.message}"
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1">
                Internal Administrative Notes
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Called customer on WhatsApp, sent package details..."
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl p-3 text-xs text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <a
                href={buildWhatsAppLink(`Hello ${selectedEnquiry.customer_name}, thanking you for contacting Nithya Studio & Video!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 hover:text-green-300 font-semibold inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSaveStatus('Contacted')}
                  disabled={isUpdating}
                  className="text-blue-300 text-xs"
                >
                  Mark Contacted
                </Button>
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => handleSaveStatus('Resolved')}
                  disabled={isUpdating}
                  className="text-xs shadow-gold-glow-sm"
                >
                  Mark Resolved
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
