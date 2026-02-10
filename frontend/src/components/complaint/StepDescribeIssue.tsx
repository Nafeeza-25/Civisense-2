import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, MessageSquareText, Sparkles } from 'lucide-react';
import type { ComplaintFormData } from '@/lib/types';

interface StepDescribeIssueProps {
  data: ComplaintFormData;
  updateData: (updates: Partial<ComplaintFormData>) => void;
}

const areas = [
  'Anna Nagar', 'T. Nagar', 'Mylapore', 'Adyar', 'Velachery',
  'Chromepet', 'Tambaram', 'Guindy', 'Egmore', 'Nungambakkam',
  'Kodambakkam', 'Royapettah', 'Triplicane', 'Perambur', 'Kolathur', 'Other'
];

const StepDescribeIssue = ({ data, updateData }: StepDescribeIssueProps) => {
  const maxLength = 1000;
  const charCount = data.description.length;
  const charPercent = (charCount / maxLength) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
          <MessageSquareText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Describe Your Issue
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Tell us about your problem in any language — Tamil, English, or Tanglish. Our AI understands all.
        </p>
      </div>

      <div className="space-y-5">
        {/* Complaint Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            What is your complaint? <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              placeholder="உங்கள் பிரச்சனையை இங்கே விவரிக்கவும்... / Describe your problem here..."
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className="min-h-[160px] text-base resize-none rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
              maxLength={maxLength}
              aria-describedby="description-hint char-count"
              required
            />
            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 rounded-b-xl overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${charPercent > 90 ? 'bg-red-500' : charPercent > 50 ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${charPercent}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <p id="description-hint" className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Be specific about location and issue for better AI analysis
            </p>
            <span
              id="char-count"
              className={`font-mono font-medium ${charCount > maxLength * 0.9 ? "text-red-500" : "text-slate-400"}`}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        </div>

        {/* Area/Location */}
        <div className="space-y-2">
          <Label htmlFor="area" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            Area / Location <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.area}
            onValueChange={(value) => updateData({ area: value })}
          >
            <SelectTrigger id="area" className="w-full rounded-xl h-11">
              <SelectValue placeholder="Select your area" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">
            Select the area where the issue is located
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepDescribeIssue;
