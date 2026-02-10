import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/lib/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Complaints',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      shadow: 'shadow-blue-100/50 dark:shadow-blue-900/20',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      shadow: 'shadow-amber-100/50 dark:shadow-amber-900/20',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      gradient: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      shadow: 'shadow-emerald-100/50 dark:shadow-emerald-900/20',
      iconBg: 'bg-emerald-500',
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      shadow: 'shadow-rose-100/50 dark:shadow-rose-900/20',
      iconBg: 'bg-rose-500',
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`border-0 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 shadow-lg ${card.shadow} ${card.bg}`}
        >
          <CardContent className="p-5 md:p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                <card.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm uppercase tracking-wider">
                <TrendingUp className="w-2.5 h-2.5 mr-1" />
                Live
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
            </div>
          </CardContent>

          {/* Decorative */}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
