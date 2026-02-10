import { CheckCircle, FileText, Gauge, Lightbulb, ArrowRight, Copy, Check, Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ComplaintSubmissionResult } from '@/lib/types';

interface SubmissionResultProps {
  result: ComplaintSubmissionResult;
  onNewComplaint: () => void;
}

const SubmissionResult = ({ result, onNewComplaint }: SubmissionResultProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyReferenceId = async () => {
    await navigator.clipboard.writeText(result.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 shadow-lg shadow-green-100/50 ring-4 ring-green-50 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          Complaint Registered!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto text-lg leading-relaxed">
          Your grievance has been successfully submitted and analyzed by our <span className="font-semibold text-primary">Gemini AI Engine</span>.
        </p>
      </div>

      {/* Reference Number */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Reference ID</p>
              <p className="text-3xl font-mono font-bold text-primary tracking-tight">{result.referenceId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferenceId}
              className="gap-2 min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy ID
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Section */}
      <div className="grid gap-6 md:grid-cols-2 mt-2">
        {/* Category & Confidence */}
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4" />
              AI Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="mb-1 text-sm text-slate-400 font-medium">Detected Category</div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.category}</p>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                {result.confidence}% Confidence
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Analyzed from complaint text</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Score */}
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              AI Priority Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-end justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${result.priorityScore >= 70 ? 'text-red-600' : result.priorityScore >= 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {result.priorityScore}
                </span>
                <span className="text-sm text-slate-400 font-semibold">/100</span>
              </div>
              <Badge variant={result.priorityScore >= 70 ? 'destructive' : result.priorityScore >= 40 ? 'default' : 'outline'} className={result.priorityScore >= 40 && result.priorityScore < 70 ? 'bg-amber-500 hover:bg-amber-600' : ''}>
                {result.priorityScore >= 70 ? 'High' : result.priorityScore >= 40 ? 'Medium' : 'Low'} Priority
              </Badge>
            </div>

            <p className="text-sm text-slate-500 mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Reasoning: </span>
              {result.urgencyExplanation || "Determined based on urgency keywords and impact analysis."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Scheme - The "Wow" Factor */}
      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-950 shadow-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <BrainCircuit className="w-32 h-32 text-indigo-600" />
        </div>

        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4" />
            Welfare Scheme Recommendation
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 pt-2">
          {result.suggestedScheme && result.suggestedScheme !== "None" ? (
            <>
              <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-3">
                {result.suggestedScheme}
              </p>
              <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50 backdrop-blur-sm">
                <p className="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed flex gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{result.schemeExplanation}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-slate-500 italic">No specific welfare scheme matched at this time.</div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button onClick={onNewComplaint} variant="outline" size="lg" className="flex-1 h-12 text-base font-medium">
          File Another Grievance
        </Button>
        <Button onClick={() => navigate('/dashboard')} size="lg" className="flex-1 h-12 text-base font-medium gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          View Live Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        AI-generated results may vary based on complaint details. Always verified by officials.
      </p>
    </div>
  );
};

export default SubmissionResult;
