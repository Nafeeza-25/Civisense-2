import { Droplets, Construction, Heart, Home, Users, Zap, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplaintFormData, ServiceType } from '@/lib/types';

interface StepServiceTypeProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const serviceTypes: { value: ServiceType; label: string; icon: React.ElementType; description: string; color: string }[] = [
  { value: 'water', label: 'Water', icon: Droplets, description: 'Water supply issues', color: 'text-blue-500 bg-blue-50 border-blue-200 ring-blue-500/20' },
  { value: 'road', label: 'Road', icon: Construction, description: 'Road & infrastructure', color: 'text-orange-500 bg-orange-50 border-orange-200 ring-orange-500/20' },
  { value: 'health', label: 'Health', icon: Heart, description: 'Healthcare services', color: 'text-rose-500 bg-rose-50 border-rose-200 ring-rose-500/20' },
  { value: 'housing', label: 'Housing', icon: Home, description: 'Housing assistance', color: 'text-emerald-500 bg-emerald-50 border-emerald-200 ring-emerald-500/20' },
  { value: 'welfare', label: 'Welfare', icon: Users, description: 'Social welfare', color: 'text-violet-500 bg-violet-50 border-violet-200 ring-violet-500/20' },
  { value: 'electricity', label: 'Electricity', icon: Zap, description: 'Power supply issues', color: 'text-amber-500 bg-amber-50 border-amber-200 ring-amber-500/20' },
  { value: 'sanitation', label: 'Sanitation', icon: Trash2, description: 'Cleanliness & waste', color: 'text-teal-500 bg-teal-50 border-teal-200 ring-teal-500/20' },
  { value: 'other', label: 'Other', icon: HelpCircle, description: 'Other services', color: 'text-slate-500 bg-slate-50 border-slate-200 ring-slate-500/20' },
];

const StepServiceType = ({ data, updateData }: StepServiceTypeProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-100 mb-3">
          <HelpCircle className="w-6 h-6 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Select Service Type
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Choose the category that best describes your issue
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        role="radiogroup"
        aria-label="Service type selection"
      >
        {serviceTypes.map(({ value, label, icon: Icon, description, color }) => {
          const isSelected = data.serviceType === value;
          const colorClasses = color.split(' ');

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateData({ serviceType: value })}
              className={cn(
                "flex flex-col items-center justify-center p-5 md:p-6 rounded-xl border-2 transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:scale-[1.03] active:scale-[0.98]",
                isSelected
                  ? `${colorClasses[1]} ${colorClasses[2]} ring-4 ${colorClasses[3]} shadow-md`
                  : "border-slate-200 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-sm text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all",
                isSelected ? `${colorClasses[1]}` : "bg-slate-100 dark:bg-slate-800"
              )}>
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? colorClasses[0] : "text-slate-400"
                  )}
                  aria-hidden="true"
                />
              </div>
              <span className={cn(
                "font-semibold text-sm",
                isSelected ? colorClasses[0] : "text-slate-700 dark:text-slate-300"
              )}>
                {label}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 text-center hidden md:block leading-tight">
                {description}
              </span>
            </button>
          );
        })}
      </div>

      {data.serviceType && (
        <div className="text-center text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Selected: <span className="font-semibold text-slate-700 dark:text-slate-200">{serviceTypes.find(s => s.value === data.serviceType)?.label}</span>
        </div>
      )}
    </div>
  );
};

export default StepServiceType;
