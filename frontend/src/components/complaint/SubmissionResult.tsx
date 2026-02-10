import { CheckCircle, FileText, Gauge, Lightbulb, ArrowRight, Copy, Check, Sparkles, BrainCircuit, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import type { ComplaintSubmissionResult } from '@/lib/types';

interface SubmissionResultProps {
  result: ComplaintSubmissionResult;
  onNewComplaint: () => void;
}

const SubmissionResult = ({ result, onNewComplaint }: SubmissionResultProps) => {
  const [copied, setCopied] = useState(false);

  const copyReferenceId = async () => {
    await navigator.clipboard.writeText(result.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityColor = result.priorityScore >= 70
    ? 'text-red-600' : result.priorityScore >= 40
      ? 'text-amber-600' : 'text-emerald-600';

  const priorityBg = result.priorityScore >= 70
    ? 'from-red-500 to-rose-600' : result.priorityScore >= 40
      ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500';

  const priorityLabel = result.priorityScore >= 70 ? 'High' : result.priorityScore >= 40 ? 'Medium' : 'Low';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 🎉 Success Hero */}
      <div className="text-center py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/80 to-transparent dark:from-green-950/20 dark:to-transparent rounded-3xl -z-10" />
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-xl shadow-green-200/50">
          <CheckCircle className="w-10 h-10 text-white" aria-hidden="true" />
          <div className="absolute inset-0 rounded-full ring-4 ring-green-100 dark:ring-green-900/50 animate-ping opacity-25" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
          Complaint Registered!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
          Your grievance has been analyzed by our <span className="font-semibold text-violet-600">Gemini AI</span> and routed for resolution.
        </p>
      </div>

      {/* Reference Number */}
      <div className="flex items-center justify-between bg-primary/5 border border-primary/15 rounded-2xl p-5">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reference ID</p>
          <p className="text-3xl font-mono font-black text-primary tracking-tight">{result.referenceId}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyReferenceId}
          className="gap-2 min-w-[100px] rounded-xl"
        >
          {copied ? (
            <><Check className="w-4 h-4 text-green-600" /> Copied</>
          ) : (
            <><Copy className="w-4 h-4" /> Copy ID</>
          )}
        </Button>
      </div>

      {/* AI Analysis Cards */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Classification Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Classification</span>
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-400 font-medium mb-1">Detected Category</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-slate-900 dark:text-white">{result.category}</p>
              <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 font-bold">
                {result.confidence}%
              </Badge>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
                Gemini AI Classification
              </div>
            </div>
          </div>
        </div>

        {/* Priority Score Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Assessment</span>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${priorityColor}`}>
                  {result.priorityScore}
                </span>
                <span className="text-sm text-slate-300 font-bold">/100</span>
              </div>
              <span className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${priorityBg}`}>
                {priorityLabel}
              </span>
            </div>
            {/* Score bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${priorityBg} transition-all duration-1000`}
                style={{ width: `${result.priorityScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-600">Why: </span>
              {result.urgencyExplanation || "Determined based on urgency keywords and impact analysis."}
            </p>
          </div>
        </div>
      </div>

      {/* Welfare Scheme */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/30 dark:via-slate-950 dark:to-violet-950/20 overflow-hidden shadow-sm relative group">
        <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <BrainCircuit className="w-24 h-24 text-indigo-600" />
        </div>

        <div className="px-6 py-4 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Welfare Scheme Recommendation</span>
          </div>

          {result.suggestedScheme && result.suggestedScheme !== "None" ? (
            <>
              <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-3">
                {result.suggestedScheme}
              </p>
              <div className="bg-white/70 dark:bg-black/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30 backdrop-blur-sm">
                <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed flex gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{result.schemeExplanation}</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-slate-400 italic text-sm">No specific welfare scheme matched at this time.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onNewComplaint} variant="outline" size="lg" className="flex-1 h-12 text-base font-medium rounded-xl gap-2">
          <Home className="w-4 h-4" />
          File Another Grievance
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 pb-4">
        AI results are advisory — all complaints are verified by government officials.
      </p>
    </div>
  );
};

export default SubmissionResult;
