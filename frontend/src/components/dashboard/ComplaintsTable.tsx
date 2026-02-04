import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowUpDown, Filter, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Complaint, ComplaintStatus } from '@/lib/types';
import { format } from 'date-fns';

interface ComplaintsTableProps {
  complaints: Complaint[];
  onStatusChange: (id: string, status: ComplaintStatus) => void;
}

type SortField = 'timestamp' | 'priority' | 'category' | 'area' | 'status';
type SortDirection = 'asc' | 'desc';

const statusOptions: ComplaintStatus[] = [
  'New',
  'Verified',
  'Scheme Linked',
  'Assigned',
  'Resolved',
  'Closed'
];

const priorityOrder = { high: 3, medium: 2, low: 1 };

const ComplaintsTable = ({ complaints, onStatusChange }: ComplaintsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'timestamp':
        return multiplier * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case 'priority':
        return multiplier * (priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'category':
        return multiplier * a.category.localeCompare(b.category);
      case 'area':
        return multiplier * a.area.localeCompare(b.area);
      case 'status':
        return multiplier * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold hover:bg-transparent text-slate-500 hover:text-slate-900"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" aria-hidden="true" />
    </Button>
  );

  const getPriorityBadge = (priority: Complaint['priority']) => {
    const styles = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high'
    };

    return (
      <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5", styles[priority])}>
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    const styles: Record<ComplaintStatus, string> = {
      'New': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      'Verified': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
      'Scheme Linked': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
      'Assigned': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
      'Closed': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {status}
      </Badge>
    );
  };

  if (complaints.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground flex flex-col items-center justify-center border rounded-xl border-dashed bg-slate-50/50">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Filter className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No complaints found</h3>
        <p className="max-w-xs mx-auto mt-1">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-50/80">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="min-w-[240px] py-4">Complaint</TableHead>
            <TableHead>
              <SortButton field="category">Category</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead className="font-semibold text-slate-500">Scheme</TableHead>
            <TableHead>
              <SortButton field="area">Area</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="timestamp">Time</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedComplaints.map((complaint) => {
            const isExpanded = expandedId === complaint.id;

            return (
              <>
                <TableRow
                  key={complaint.id}
                  className={cn(
                    "cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0",
                    isExpanded ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                >
                  <TableCell className="pl-4">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-primary" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium pr-6">
                    <div className="max-w-[280px] break-words line-clamp-2 leading-relaxed" title={complaint.description}>
                      {complaint.description}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                        ID: {complaint.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{complaint.category}</span>
                  </TableCell>
                  <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600 dark:text-slate-400 max-w-[150px] block truncate" title={complaint.scheme}>
                      {complaint.scheme || "—"}
                    </span>
                  </TableCell>
                  <TableCell>{complaint.area}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={complaint.status}
                      onValueChange={(value: ComplaintStatus) => onStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className={cn("w-[140px] h-8 text-xs border-0 shadow-sm", {
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-200': complaint.status === 'New',
                        'bg-violet-50 text-violet-700 ring-1 ring-violet-200': complaint.status === 'Verified',
                        'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200': complaint.status === 'Scheme Linked',
                        'bg-orange-50 text-orange-700 ring-1 ring-orange-200': complaint.status === 'Assigned',
                        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200': complaint.status === 'Resolved',
                        'bg-slate-50 text-slate-700 ring-1 ring-slate-200': complaint.status === 'Closed',
                      })}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status} className="text-xs text-black">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                    {format(new Date(complaint.timestamp), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>

                {/* Expanded Details */}
                {isExpanded && (
                  <TableRow key={`${complaint.id}-details`} className="bg-blue-50/30 dark:bg-blue-900/5 hover:bg-blue-50/30">
                    <TableCell colSpan={8} className="p-0">
                      <div className="p-6 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Full Description</h4>
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm">
                              {complaint.description}
                            </div>
                          </div>

                          <div className="flex gap-4 items-start">
                            {complaint.scheme && (
                              <div className="flex-1">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Recommended Scheme</h4>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 text-indigo-900 dark:text-indigo-200 text-sm">
                                  {complaint.scheme}
                                </div>
                              </div>
                            )}

                            {/* AI Feedback Control */}
                            <div className="pt-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs gap-2 border-slate-200 hover:bg-slate-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newCat = prompt("Correct the Category (for AI Training):", complaint.category);
                                  if (newCat && newCat !== complaint.category) {
                                    // Call feedback API (we'd need to inject this prop or use context, but for demo we can log/alert)
                                    // Ideally: onFeedback(complaint.id, { correctCategory: newCat })
                                    alert(`AI Training Feedback Sent: Category corrected to '${newCat}'`);
                                  }
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-1.5 5.315 5.315-1.5a2 2 0 0 0 .5-.5l13.5-13.5Z" /></svg>
                                Correct Analysis
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                              <Eye className="w-4 h-4 text-slate-400" />
                              Citizen Details
                            </h4>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                              <div>
                                <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Name</dt>
                                <dd className="font-medium">{complaint.contact.name}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Phone</dt>
                                <dd className="font-medium font-mono">{complaint.contact.phone}</dd>
                              </div>
                              <div className="col-span-2">
                                <dt className="text-slate-500 text-xs uppercase tracking-wide mb-1">Email</dt>
                                <dd className="font-medium">{complaint.contact.email || "Not provided"}</dd>
                              </div>
                            </dl>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Vulnerability Assessment</h4>
                            <div className="flex flex-wrap gap-2">
                              {complaint.vulnerability.seniorCitizen && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Senior Citizen</Badge>
                              )}
                              {complaint.vulnerability.lowIncome && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Low Income</Badge>
                              )}
                              {complaint.vulnerability.disability && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Disability</Badge>
                              )}
                              {!complaint.vulnerability.seniorCitizen &&
                                !complaint.vulnerability.lowIncome &&
                                !complaint.vulnerability.disability && (
                                  <span className="text-sm text-slate-400 italic">No specific vulnerabilities flagged</span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintsTable;
