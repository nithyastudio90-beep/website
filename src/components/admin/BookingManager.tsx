import React, { useState } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  User,
  Eye,
  FileText,
  XCircle,
  History,
  Send,
  Check,
  AlertCircle
} from 'lucide-react';
import { Booking, BookingStatus, BookingStatusHistory } from '../../types/database.types';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate, buildWhatsAppLink } from '../../lib/utils';
import { useStudio } from '../../context/StudioContext';
import { DataService } from '../../lib/supabase';

interface BookingManagerProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus, adminNotes?: string) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
}) => {
  const { services, confirmBooking, rejectBooking } = useStudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Rejection Dialog State
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Schedule unavailable for requested date');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Confirmation Success & WhatsApp Preparation State
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [confirmFeedback, setConfirmFeedback] = useState<string | null>(null);

  // Status History Modal State
  const [historyBooking, setHistoryBooking] = useState<Booking | null>(null);
  const [historyList, setHistoryList] = useState<BookingStatusHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobile_number.includes(searchTerm) ||
      b.event_location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesService = serviceFilter === 'all' || b.service_name === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const handleQuickConfirm = async (b: Booking) => {
    setIsUpdating(b.id);
    const res = await confirmBooking(b.id);
    setIsUpdating(null);

    if (res.success) {
      setConfirmedBooking(b);
      setConfirmFeedback(null);
    } else {
      setConfirmFeedback(res.error || 'Conflict: Slot unavailable.');
    }
  };

  const handleOpenReject = (b: Booking) => {
    setRejectingBooking(b);
    setRejectionReason('Date and time slot already reserved for another assignment.');
  };

  const handleConfirmReject = async () => {
    if (!rejectingBooking || !rejectionReason.trim()) return;
    setIsSubmittingReject(true);
    await rejectBooking(rejectingBooking.id, rejectionReason.trim());
    setIsSubmittingReject(false);
    setRejectingBooking(null);
  };

  const handleViewHistory = async (b: Booking) => {
    setHistoryBooking(b);
    setIsLoadingHistory(true);
    const hist = await DataService.fetchBookingHistory(b.id);
    setHistoryList(hist);
    setIsLoadingHistory(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await onDeleteBooking(deleteId);
    setDeleteId(null);
    if (selectedBooking?.id === deleteId) {
      setSelectedBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      {confirmFeedback && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{confirmFeedback}</span>
          </div>
          <button onClick={() => setConfirmFeedback(null)} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 max-w-[180px] truncate"
          >
            <option value="all">All Services</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table / List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-studio-card/50 border border-studio-border/60">
          <Calendar className="w-12 h-12 text-studio-muted mx-auto mb-3 opacity-40" />
          <h3 className="font-cinzel text-base font-semibold text-studio-light">
            No booking enquiries match your filters
          </h3>
          <p className="text-xs text-studio-muted mt-1 max-w-sm mx-auto">
            Try adjusting your search keyword or resetting the status and service filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-studio-border/70 overflow-hidden bg-studio-card/80 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-studio-surface/80 border-b border-studio-border/80 text-studio-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Event Date & Time</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border/50 text-studio-light">
              {filteredBookings.map((b) => {
                const customerWhatsAppUrl = buildWhatsAppLink(
                  `Hello ${b.customer_name},\n\nWe received your booking enquiry for "${b.service_name}" on ${formatDate(b.event_date)} at Nithya Studio & Video. We are reviewing date availability.`
                );

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-studio-surface/40 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-studio-light flex items-center gap-1.5">
                        <span>{b.customer_name}</span>
                      </div>
                      <div className="text-[11px] text-studio-muted flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${b.mobile_number}`}
                          className="hover:text-gold-400 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-gold-400" />
                          <span>{b.mobile_number}</span>
                        </a>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gold-400">{b.service_name}</span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-studio-light">
                        <Calendar className="w-3.5 h-3.5 text-studio-muted" />
                        <span className="font-semibold">{formatDate(b.event_date)}</span>
                      </div>
                      <div className="text-[10px] text-studio-muted mt-0.5">
                        {b.event_start_time || '09:00'} - {b.event_end_time || '17:00'}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[180px] truncate">
                      <div className="flex items-center gap-1 text-studio-muted">
                        <MapPin className="w-3.5 h-3.5 text-studio-muted shrink-0" />
                        <span className="truncate">{b.event_location}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Confirm button */}
                      {b.status !== 'Confirmed' && b.status !== 'Completed' && (
                        <button
                          onClick={() => handleQuickConfirm(b)}
                          disabled={isUpdating === b.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 font-medium text-[11px]"
                          title="Confirm Booking & Lock Slot"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      )}

                      {/* Reject button */}
                      {b.status !== 'Rejected' && b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleOpenReject(b)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-400 hover:bg-rose-900/50 font-medium text-[11px]"
                          title="Reject Booking with Reason"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      {/* View History */}
                      <button
                        onClick={() => handleViewHistory(b)}
                        className="p-1.5 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-gold-400"
                        title="Audit History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* View Details */}
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setAdminNotes(b.admin_notes || '');
                        }}
                        className="p-1.5 rounded-lg bg-studio-surface border border-studio-border text-studio-light hover:text-gold-400"
                        title="View Full Booking Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteId(b.id)}
                        className="p-1.5 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-rose-400 hover:border-rose-500/50"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation & WhatsApp Send Modal */}
      <Modal
        isOpen={Boolean(confirmedBooking)}
        onClose={() => setConfirmedBooking(null)}
        title="Booking Successfully Confirmed!"
      >
        {confirmedBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Date & Time Slot Reserved in Calendar</span>
              </div>
              <p className="text-[11px] text-studio-muted">
                {confirmedBooking.customer_name} • {confirmedBooking.service_name} • {formatDate(confirmedBooking.event_date)}
              </p>
            </div>

            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Prepared WhatsApp Confirmation Message
              </label>
              <div className="p-3 bg-studio-dark rounded-xl border border-studio-border text-studio-light whitespace-pre-line text-xs font-mono">
                {`Hello ${confirmedBooking.customer_name},

Your booking with Nithya Studio & Video has been confirmed!

Service: ${confirmedBooking.service_name}
Event Date: ${formatDate(confirmedBooking.event_date)}
Time: ${confirmedBooking.event_start_time || '09:00'} - ${confirmedBooking.event_end_time || '17:00'}
Location: ${confirmedBooking.event_location}

Thank you for choosing Nithya Studio & Video!`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="ghost" size="sm" onClick={() => setConfirmedBooking(null)}>
                Close
              </Button>
              <a
                href={buildWhatsAppLink(
                  `Hello ${confirmedBooking.customer_name},\n\nYour booking with Nithya Studio & Video has been confirmed!\n\nService: ${confirmedBooking.service_name}\nEvent Date: ${formatDate(confirmedBooking.event_date)}\nTime: ${confirmedBooking.event_start_time || '09:00'} - ${confirmedBooking.event_end_time || '17:00'}\nLocation: ${confirmedBooking.event_location}\n\nThank you for choosing Nithya Studio & Video!`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" size="sm" leftIcon={<Send className="w-3.5 h-3.5 text-studio-black" />}>
                  Send WhatsApp Confirmation
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Mandatory Rejection Dialog Modal */}
      <Modal
        isOpen={Boolean(rejectingBooking)}
        onClose={() => setRejectingBooking(null)}
        title="Reject Booking Enquiry"
      >
        {rejectingBooking && (
          <div className="space-y-4 text-xs">
            <p className="text-studio-muted">
              Please enter the official reason for rejecting <strong className="text-white">{rejectingBooking.customer_name}'s</strong> booking request on <strong className="text-white">{formatDate(rejectingBooking.event_date)}</strong>:
            </p>

            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Mandatory Rejection Reason *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Schedule already fully occupied for Muhurtham shoot on this date..."
                className="w-full bg-studio-dark border border-studio-border rounded-xl p-3 text-xs text-studio-light focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="ghost" size="sm" onClick={() => setRejectingBooking(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isSubmittingReject || !rejectionReason.trim()}
                onClick={handleConfirmReject}
              >
                {isSubmittingReject ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status History Modal */}
      <Modal
        isOpen={Boolean(historyBooking)}
        onClose={() => setHistoryBooking(null)}
        title={`Audit History: ${historyBooking?.customer_name}`}
      >
        <div className="space-y-3 text-xs">
          {isLoadingHistory ? (
            <p className="text-studio-muted py-6 text-center">Loading audit history...</p>
          ) : historyList.length === 0 ? (
            <p className="text-studio-muted py-6 text-center">No previous status transitions recorded.</p>
          ) : (
            <div className="divide-y divide-studio-border/40">
              {historyList.map((h) => (
                <div key={h.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-studio-light">
                      {h.from_status} → <span className="text-gold-400">{h.to_status}</span>
                    </span>
                    <span className="text-studio-muted">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                  {h.reason && <p className="text-studio-muted text-[11px] italic">"{h.reason}"</p>}
                  <div className="text-[10px] text-studio-muted">Changed by: {h.changed_by}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Booking Details Modal */}
      <Modal
        isOpen={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title="Customer Booking Enquiry Details"
        maxWidth="lg"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-studio-border/60">
              <div>
                <span className="text-studio-muted">Enquiry Reference ID:</span>
                <span className="font-mono text-gold-400 ml-2 font-bold">
                  {selectedBooking.id}
                </span>
              </div>
              <StatusBadge status={selectedBooking.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-studio-muted block">Customer Full Name:</span>
                <span className="text-sm font-semibold text-studio-light">
                  {selectedBooking.customer_name}
                </span>
              </div>
              <div>
                <span className="text-studio-muted block">Mobile Number:</span>
                <a
                  href={`tel:${selectedBooking.mobile_number}`}
                  className="text-sm font-semibold text-gold-400 hover:underline"
                >
                  {selectedBooking.mobile_number}
                </a>
              </div>
            </div>

            {selectedBooking.email && (
              <div>
                <span className="text-studio-muted block">Email Address:</span>
                <span className="text-studio-light">{selectedBooking.email}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-studio-muted block">Service Requested:</span>
                <span className="font-semibold text-gold-400">
                  {selectedBooking.service_name}
                </span>
              </div>
              <div>
                <span className="text-studio-muted block">Event Date:</span>
                <span className="font-semibold text-studio-light">
                  {formatDate(selectedBooking.event_date)} ({selectedBooking.event_start_time || '09:00'} - {selectedBooking.event_end_time || '17:00'})
                </span>
              </div>
            </div>

            <div>
              <span className="text-studio-muted block">Venue / Event Location:</span>
              <span className="font-medium text-studio-light">
                {selectedBooking.event_location}
              </span>
            </div>

            {selectedBooking.rejection_reason && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-rose-400 block font-semibold mb-1">
                  Rejection Reason:
                </span>
                <p className="text-rose-200 italic">
                  "{selectedBooking.rejection_reason}"
                </p>
              </div>
            )}

            {selectedBooking.additional_message && (
              <div className="p-3.5 rounded-xl bg-studio-surface/80 border border-studio-border/60">
                <span className="text-studio-muted block font-semibold mb-1">
                  Customer Message / Notes:
                </span>
                <p className="text-studio-light italic">
                  "{selectedBooking.additional_message}"
                </p>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="pt-2">
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Internal Admin Notes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Private note e.g. Advance paid, photographer assigned..."
                  className="flex-1 bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
                />
                <Button
                  size="sm"
                  variant="gold"
                  onClick={async () => {
                    await onUpdateStatus(selectedBooking.id, selectedBooking.status, adminNotes);
                    setSelectedBooking({ ...selectedBooking, admin_notes: adminNotes });
                  }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4 text-xs">
          <p className="text-studio-muted">
            Are you sure you want to delete this booking enquiry record? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
