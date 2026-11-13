import React from 'react';
import { CalendarCheck, Clock, CheckCircle2, Award, Users, TrendingUp } from 'lucide-react';
import { Booking } from '../../types/database.types';
import { Card } from '../ui/Card';

interface StatsOverviewProps {
  bookings: Booking[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ bookings }) => {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'Pending').length;
  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const completed = bookings.filter((b) => b.status === 'Completed').length;

  const stats = [
    {
      title: 'Total Enquiries',
      count: total,
      icon: Users,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30',
    },
    {
      title: 'Pending Review',
      count: pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      title: 'Confirmed Bookings',
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => {
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
            <div>
              <div className="text-2xl sm:text-3xl font-cinzel font-bold text-studio-light">
                {stat.count}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
