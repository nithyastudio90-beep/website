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
  FileText
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types/database.types';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate, buildWhatsAppLink } from '../../lib/utils';
import { useStudio } from '../../context/StudioContext';

interface BookingManagerProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
}) => {
  const { services } = useStudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

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

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setIsUpdating(id);
    await onUpdateStatus(id, newStatus);
    setIsUpdating(null);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
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
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500 max-w-[160px]"
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

      {/* Bookings List / Table */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 rounded-2xl bg-studio-card/50 border border-studio-border/60 text-center">
          <FileText className="w-8 h-8 text-gold-500/40 mx-auto mb-2" />
          <p className="text-sm text-studio-muted">No booking enquiries matched your search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-studio-border/70 bg-studio-card/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-studio-dark/80 text-studio-muted uppercase tracking-wider border-b border-studio-border/70">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Service</th>
                <th className="py-3.5 px-4 font-semibold">Event Date</th>
                <th className="py-3.5 px-4 font-semibold">Venue / Location</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border/40">
              {filteredBookings.map((b) => {
                const customerWhatsAppUrl = buildWhatsAppLink(
                  `Hello ${b.customer_name}, this is Nithya Studio & Video regarding your booking enquiry for "${b.service_name}" on ${formatDate(b.event_date)}.`
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
                        <span>{formatDate(b.event_date)}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[180px] truncate">
                      <div className="flex items-center gap-1 text-studio-muted">
                        <MapPin className="w-3.5 h-3.5 text-studio-muted shrink-0" />
                        <span className="truncate">{b.event_location}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={b.status}
                        disabled={isUpdating === b.id}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingStatus)
                        }
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors ${
                          b.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : b.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : b.status === 'Completed'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <option value="Pending" className="bg-studio-dark text-white">Pending</option>
                        <option value="Confirmed" className="bg-studio-dark text-white">Confirmed</option>
                        <option value="Completed" className="bg-studio-dark text-white">Completed</option>
                        <option value="Cancelled" className="bg-studio-dark text-white">Cancelled</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* WhatsApp quick contact */}
                      <a
                        href={customerWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40"
                        title="Chat with Customer on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      {/* View Details Modal */}
                      <button
                        onClick={() => setSelectedBooking(b)}
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
                  {formatDate(selectedBooking.event_date)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-studio-muted block">Venue / Event Location:</span>
              <span className="font-medium text-studio-light">
                {selectedBooking.event_location}
              </span>
            </div>

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

            <div className="pt-2 text-studio-muted text-[11px]">
              Enquiry Submitted on: {new Date(selectedBooking.created_at).toLocaleString()}
            </div>

            {/* Quick Actions in Modal */}
            <div className="pt-4 border-t border-studio-border/60 flex items-center justify-between gap-3">
              <a
                href={buildWhatsAppLink(
                  `Hello ${selectedBooking.customer_name}, this is Nithya Studio & Video reaching out regarding your booking enquiry for "${selectedBooking.service_name}".`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="gold"
                  size="sm"
                  fullWidth
                  className="bg-emerald-500 hover:bg-emerald-400 text-studio-black font-semibold"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Reply via WhatsApp
                </Button>
              </a>

              <Button
                variant="dark"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Record Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="font-cinzel text-base font-semibold text-studio-light">
            Delete this booking enquiry?
          </h4>
          <p className="text-studio-muted">
            This action cannot be undone. Are you sure you want to permanently remove this enquiry from your studio database?
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="dark" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
