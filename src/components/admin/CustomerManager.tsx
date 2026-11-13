import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  FileText,
  Star,
  Award,
  Edit2,
  Save,
  Clock
} from 'lucide-react';
import { Customer, Booking } from '../../types/database.types';
import { useStudio } from '../../context/StudioContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate, buildWhatsAppLink } from '../../lib/utils';

export const CustomerManager: React.FC = () => {
  const { customers, updateCustomer, bookings } = useStudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredCustomers = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile_number.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  const handleOpenCustomer = (cust: Customer) => {
    setSelectedCustomer(cust);
    setNotesText(cust.internal_notes || '');
    setIsEditingNotes(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    setIsSaving(true);
    const updated = { ...selectedCustomer, internal_notes: notesText };
    await updateCustomer(updated);
    setSelectedCustomer(updated);
    setIsSaving(false);
    setIsEditingNotes(false);
  };

  // Customer booking records
  const customerBookings = selectedCustomer
    ? bookings.filter((b: Booking) => b.mobile_number.includes(selectedCustomer.mobile_number) || (selectedCustomer.normalized_phone && b.mobile_number.replace(/[^0-9]/g, '').includes(selectedCustomer.normalized_phone)))
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-base font-bold text-studio-light">
            Customer Directory ({customers.length})
          </h3>
          <p className="text-xs text-studio-muted">
            Manage your client relationship profiles, lifetime bookings, and private notes.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
          <input
            type="text"
            placeholder="Search by name, mobile, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-studio-dark border border-studio-border rounded-xl pl-10 pr-4 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-studio-card/50 border border-studio-border/60 text-studio-muted">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No customer profiles found matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-studio-border/70 overflow-hidden bg-studio-card/80 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-studio-surface/80 border-b border-studio-border/80 text-studio-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Client Name</th>
                <th className="py-3 px-4 font-semibold">Contact Phone</th>
                <th className="py-3 px-4 font-semibold text-center">Bookings Summary</th>
                <th className="py-3 px-4 font-semibold">Last Booking</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-studio-border/50 text-studio-light">
              {filteredCustomers.map(c => {
                const whatsappUrl = buildWhatsAppLink(
                  `Hello ${c.name},\n\nGreetings from Nithya Studio & Video!`
                );

                return (
                  <tr key={c.id} className="hover:bg-studio-surface/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-studio-light">{c.name}</div>
                      {c.address && (
                        <div className="text-[11px] text-studio-muted flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-studio-muted shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a href={`tel:${c.mobile_number}`} className="text-gold-400 hover:underline font-mono">
                        {c.mobile_number}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border text-[11px]">
                        <span className="text-studio-light font-bold">{c.total_bookings} Total</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{c.confirmed_bookings} Confirmed</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-studio-muted">
                      {c.last_booking_date ? formatDate(c.last_booking_date) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenCustomer(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border text-studio-light hover:text-gold-400 text-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Profile & Notes</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Detail & Notes Modal */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title="Customer CRM Profile"
        maxWidth="lg"
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-studio-border/60">
              <div>
                <h3 className="font-cinzel text-base font-bold text-studio-light">
                  {selectedCustomer.name}
                </h3>
                <p className="text-[11px] text-studio-muted mt-0.5">
                  Client ID: {selectedCustomer.id}
                </p>
              </div>
              <a
                href={buildWhatsAppLink(`Hello ${selectedCustomer.name},\n\n`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="gold" leftIcon={<MessageSquare className="w-3.5 h-3.5 text-studio-black" />}>
                  WhatsApp Direct
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-studio-muted block">Mobile Number:</span>
                <span className="text-studio-light font-semibold">{selectedCustomer.mobile_number}</span>
              </div>
              <div>
                <span className="text-studio-muted block">WhatsApp Number:</span>
                <span className="text-studio-light font-semibold">{selectedCustomer.whatsapp_number || selectedCustomer.mobile_number}</span>
              </div>
            </div>

            {selectedCustomer.address && (
              <div>
                <span className="text-studio-muted block">Address / Village:</span>
                <span className="text-studio-light">{selectedCustomer.address}</span>
              </div>
            )}

            {/* Lifetime Booking Statistics Card */}
            <div className="p-3.5 rounded-xl bg-studio-surface border border-studio-border grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-white">{selectedCustomer.total_bookings}</div>
                <div className="text-[10px] text-studio-muted uppercase">Total</div>
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-400">{selectedCustomer.confirmed_bookings}</div>
                <div className="text-[10px] text-studio-muted uppercase">Confirmed</div>
              </div>
              <div>
                <div className="text-sm font-bold text-blue-400">{selectedCustomer.completed_bookings}</div>
                <div className="text-[10px] text-studio-muted uppercase">Completed</div>
              </div>
              <div>
                <div className="text-sm font-bold text-rose-400">{selectedCustomer.rejected_bookings}</div>
                <div className="text-[10px] text-studio-muted uppercase">Rejected</div>
              </div>
            </div>

            {/* Private Studio CRM Notes */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-studio-muted font-semibold uppercase tracking-wider text-[10px]">
                  Internal Studio CRM Notes (Private to Admin)
                </label>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-gold-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Enter private notes e.g. Prefers candid style, family referrals, discount agreements..."
                    className="w-full bg-studio-dark border border-studio-border rounded-xl p-3 text-xs text-studio-light focus:outline-none focus:border-gold-500 resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" disabled={isSaving} onClick={handleSaveNotes}>
                      {isSaving ? 'Saving...' : 'Save Notes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-studio-dark rounded-xl border border-studio-border text-studio-light min-h-[50px] italic">
                  {selectedCustomer.internal_notes || 'No private notes added yet.'}
                </div>
              )}
            </div>

            {/* Booking History for this customer */}
            <div className="pt-2">
              <h4 className="font-semibold text-studio-light mb-2 text-xs uppercase tracking-wider">
                Booking History ({customerBookings.length})
              </h4>
              {customerBookings.length === 0 ? (
                <p className="text-studio-muted text-[11px]">No previous bookings found.</p>
              ) : (
                <div className="divide-y divide-studio-border/40 max-h-40 overflow-y-auto pr-1">
                  {customerBookings.map((b: Booking) => (
                    <div key={b.id} className="py-2 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-gold-400">{b.service_name}</span>
                        <span className="text-studio-muted ml-2">{formatDate(b.event_date)}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-studio-dark border border-studio-border">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-studio-border/60 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
