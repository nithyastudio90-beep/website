import React from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Award,
  Users,
  XCircle,
  Layers,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Booking, Service, Customer, CustomerEnquiry } from '../../types/database.types';
import { Card } from '../ui/Card';
import { useStudio } from '../../context/StudioContext';

interface StatsOverviewProps {
  bookings: Booking[];
  enquiries?: CustomerEnquiry[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ bookings, enquiries = [] }) => {
  const { services, customers } = useStudio();

  const total = bookings.length;
  const newBookings = bookings.filter((b) => b.status === 'New').length;
  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const rejected = bookings.filter((b) => b.status === 'Rejected').length;
  const completed = bookings.filter((b) => b.status === 'Completed').length;
  const cancelled = bookings.filter((b) => b.status === 'Cancelled').length;

  const totalCustomers = customers.length;
  const activeServices = services.filter((s) => s.is_active).length;
  const inactiveServices = services.filter((s) => !s.is_active).length;
  const totalEnquiries = enquiries.length;

  const primaryStats = [
    {
      title: 'Total Bookings',
      count: total,
      icon: CalendarCheck,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30',
    },
    {
      title: 'New & Pending',
      count: newBookings + pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      title: 'Confirmed Slots',
      count: confirmed,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    {
      title: 'Completed Events',
      count: completed,
      icon: Award,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
  ];

  const secondaryStats = [
    { label: 'Registered Clients', count: totalCustomers, icon: Users, color: 'text-purple-400' },
    { label: 'Active Services', count: activeServices, icon: Layers, color: 'text-emerald-400' },
    { label: 'Inactive Services', count: inactiveServices, icon: Layers, color: 'text-zinc-400' },
    { label: 'Contact Messages', count: totalEnquiries, icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Rejected Requests', count: rejected, icon: XCircle, color: 'text-rose-400' },
    { label: 'Cancelled Bookings', count: cancelled, icon: AlertCircle, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {primaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className={`p-5 bg-studio-card/90 border ${stat.border} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-studio-muted font-medium">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light">
                {stat.count}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {secondaryStats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-studio-card/70 border border-studio-border/60 flex items-center justify-between text-xs"
            >
              <div>
                <div className="text-[10px] text-studio-muted uppercase tracking-wider">{s.label}</div>
                <div className="text-base font-bold text-studio-light mt-0.5">{s.count}</div>
              </div>
              <Icon className={`w-4 h-4 ${s.color} shrink-0 opacity-80`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
