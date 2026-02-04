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
      shadow: 'shadow-blue-500/20',
      trend: '+12% from last week'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/20',
      trend: '4 requiring attention'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      gradient: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      trend: '98% completion rate'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      trend: 'Urgent action needed'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`border-0 overflow-hidden relative group hover:scale-[1.02] transition-all duration-300 shadow-xl ${card.shadow}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                <card.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              {/* Decorative trend indicator - simplified for hackathon */}
              <div className="flex items-center text-xs font-medium text-muted-foreground bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </p>
            </div>
          </CardContent>

          {/* Decorative swoosh */}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
