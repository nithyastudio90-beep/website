import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Filter
} from 'lucide-react';
import { CalendarEvent, Booking } from '../../types/database.types';
import { useStudio } from '../../context/StudioContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate, buildWhatsAppLink } from '../../lib/utils';

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export const BookingCalendarManager: React.FC = () => {
  const { calendarEvents, bookings } = useStudio();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Month navigation
  const prevPeriod = () => {
    const d = new Date(currentDate);
    if (activeView === 'month') d.setMonth(d.getMonth() - 1);
    else if (activeView === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextPeriod = () => {
    const d = new Date(currentDate);
    if (activeView === 'month') d.setMonth(d.getMonth() + 1);
    else if (activeView === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Filter events
  const filteredEvents = calendarEvents.filter(e => {
    if (filterStatus === 'all') return true;
    return e.status === filterStatus;
  });

  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter(e => e.event_date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Pending':
      case 'New':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Completed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gold-500/15 text-gold-400 border-gold-500/30';
    }
  };

  // Render Month Grid
  const renderMonthView = () => {
    const days = [];
    // Blank days before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="min-h-[90px] bg-studio-surface/20 border border-studio-border/30 rounded-xl opacity-30" />);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dayStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={`day-${day}`}
          className={`min-h-[90px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
            isToday
              ? 'bg-gold-500/10 border-gold-500/50 shadow-gold-glow-sm'
              : 'bg-studio-card/80 border-studio-border/60 hover:border-studio-border'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                isToday ? 'bg-gold-500 text-studio-black font-bold' : 'text-studio-light'
              }`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-[10px] text-studio-muted font-medium">
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[60px] pr-0.5">
            {dayEvents.map(evt => (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] truncate border block transition-colors ${getStatusColor(evt.status)}`}
                title={`${evt.title} (${evt.start_time} - ${evt.end_time})`}
              >
                {evt.title}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-semibold text-studio-muted text-xs py-1.5 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {days}
      </div>
    );
  };

  // Render Agenda View
  const renderAgendaView = () => {
    const sorted = [...filteredEvents].sort((a, b) => a.event_date.localeCompare(b.event_date));

    if (sorted.length === 0) {
      return (
        <div className="p-12 text-center text-studio-muted">
          <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No calendar bookings found for the selected status.</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-studio-border/50 bg-studio-card/80 rounded-2xl border border-studio-border/70 overflow-hidden">
        {sorted.map(evt => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="p-4 hover:bg-studio-surface/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-studio-light text-sm">{evt.title}</h4>
                <div className="flex items-center gap-3 text-studio-muted mt-1 text-[11px]">
                  <span>{formatDate(evt.event_date)}</span>
                  <span>•</span>
                  <span>{evt.start_time} - {evt.end_time}</span>
                  {evt.location && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[150px]">{evt.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(evt.status)}`}>
                {evt.status}
              </span>
              <Button size="sm" variant="ghost">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-studio-dark border border-studio-border rounded-xl p-1">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded-lg text-studio-muted hover:text-white hover:bg-studio-surface transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={jumpToToday}
              className="px-2.5 py-1 text-xs font-semibold text-studio-light hover:text-gold-400 transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded-lg text-studio-muted hover:text-white hover:bg-studio-surface transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-cinzel text-lg font-bold text-studio-light tracking-wide">
            {monthName}
          </h2>
        </div>

        {/* View Switches & Filter */}
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Events ({calendarEvents.length})</option>
            <option value="Confirmed">Confirmed Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Completed">Completed Only</option>
          </select>

          <div className="flex items-center bg-studio-dark border border-studio-border rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveView('month')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                activeView === 'month' ? 'bg-gold-500 text-studio-black font-semibold' : 'text-studio-muted hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setActiveView('agenda')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                activeView === 'agenda' ? 'bg-gold-500 text-studio-black font-semibold' : 'text-studio-muted hover:text-white'
              }`}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar View Canvas */}
      {activeView === 'month' ? renderMonthView() : renderAgendaView()}

      {/* Calendar Event Details Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title="Calendar Appointment Details"
      >
        {selectedEvent && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-studio-border/60">
              <h3 className="font-cinzel text-sm font-bold text-studio-light">
                {selectedEvent.title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(selectedEvent.status)}`}>
                {selectedEvent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-studio-muted block">Scheduled Date:</span>
                <span className="font-semibold text-studio-light">{formatDate(selectedEvent.event_date)}</span>
              </div>
              <div>
                <span className="text-studio-muted block">Time Window:</span>
                <span className="font-semibold text-gold-400">{selectedEvent.start_time} - {selectedEvent.end_time}</span>
              </div>
            </div>

            {selectedEvent.customer_name && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-studio-muted block">Client Name:</span>
                  <span className="text-studio-light font-medium">{selectedEvent.customer_name}</span>
                </div>
                <div>
                  <span className="text-studio-muted block">Contact Phone:</span>
                  <a href={`tel:${selectedEvent.customer_phone}`} className="text-gold-400 hover:underline font-medium">
                    {selectedEvent.customer_phone}
                  </a>
                </div>
              </div>
            )}

            {selectedEvent.location && (
              <div>
                <span className="text-studio-muted block">Venue / Location:</span>
                <span className="text-studio-light">{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.notes && (
              <div className="p-3 bg-studio-dark rounded-xl border border-studio-border text-studio-muted italic">
                "{selectedEvent.notes}"
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              {selectedEvent.customer_phone && (
                <a
                  href={buildWhatsAppLink(`Hello ${selectedEvent.customer_name || 'Customer'},\n\nRegarding your appointment with Nithya Studio & Video on ${formatDate(selectedEvent.event_date)}:`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gold" size="sm">
                    Open WhatsApp Chat
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
