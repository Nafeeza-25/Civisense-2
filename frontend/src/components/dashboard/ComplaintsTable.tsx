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
import { ChevronDown, ChevronUp, ArrowUpDown, Filter, BrainCircuit, Phone, Mail, User, Sparkles, ShieldAlert } from 'lucide-react';
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Paginate
  const totalPages = Math.ceil(sortedComplaints.length / itemsPerPage);
  const paginatedComplaints = sortedComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold hover:bg-transparent text-slate-500 hover:text-slate-900"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className={cn("ml-1.5 h-3.5 w-3.5 transition-opacity", sortField === field ? "opacity-100 text-primary" : "opacity-40")} aria-hidden="true" />
    </Button>
  );

  const getPriorityBadge = (priority: Complaint['priority']) => {
    const config = {
      low: { label: 'Low', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' },
      medium: { label: 'Medium', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
      high: { label: 'High', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300' }
    };

    const { label, className } = config[priority];
    return (
      <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 font-semibold text-xs", className)}>
        {label}
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
    <div className="space-y-4">
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
            {paginatedComplaints.map((complaint) => {
              const isExpanded = expandedId === complaint.id;

              return (
                <>
                  <TableRow
                    key={complaint.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0",
                      isExpanded ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                  >
                    <TableCell className="pl-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                        isExpanded ? "bg-primary/10 rotate-180" : "bg-slate-100"
                      )}>
                        <ChevronDown className={cn("w-3.5 h-3.5", isExpanded ? "text-primary" : "text-slate-400")} aria-hidden="true" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium pr-6">
                      <div className="max-w-[280px] break-words line-clamp-2 leading-relaxed text-slate-800 dark:text-slate-200" title={complaint.description}>
                        {complaint.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide">
                          #{complaint.id}
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
                    <TableCell>
                      <span className="text-sm">{complaint.area}</span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={complaint.status}
                        onValueChange={(value: ComplaintStatus) => onStatusChange(complaint.id, value)}
                      >
                        <SelectTrigger className={cn("w-[140px] h-8 text-xs border-0 shadow-sm font-medium", {
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
                    <TableRow key={`${complaint.id}-details`} className="bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-50/60 border-b-2 border-primary/10">
                      <TableCell colSpan={8} className="p-0">
                        <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid md:grid-cols-3 gap-6">

                            {/* Column 1: Description & Scheme */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Description</h4>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 leading-relaxed shadow-sm">
                                  {complaint.description}
                                </div>
                              </div>

                              {complaint.scheme && complaint.scheme !== 'Pending' && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Scheme</h4>
                                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-sm font-medium">
                                    {complaint.scheme}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Column 2: AI Analysis */}
                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-violet-100 dark:border-violet-900/50 relative overflow-hidden">
                              <div className="absolute top-2 right-2 opacity-5">
                                <BrainCircuit className="w-20 h-20 text-violet-600" />
                              </div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-4 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI Analysis
                              </h4>

                              <div className="space-y-4 relative z-10">
                                {/* Confidence */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-300">Confidence</span>
                                  <Badge variant="outline" className="bg-white/80 text-violet-700 border-violet-200 font-bold">
                                    {Math.round((complaint.confidence || 0) * 100)}%
                                  </Badge>
                                </div>

                                {/* Score Bars */}
                                <div className="space-y-3">
                                  {[
                                    { label: 'Urgency', value: complaint.urgencyScore, color: 'bg-red-500' },
                                    { label: 'Impact', value: complaint.impactScore, color: 'bg-blue-500' },
                                    { label: 'Vulnerability', value: complaint.vulnerabilityScore, color: 'bg-amber-500' },
                                  ].map(({ label, value, color }) => (
                                    <div key={label}>
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500 font-medium">{label}</span>
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{(value || 0).toFixed(2)}</span>
                                      </div>
                                      <div className="w-full h-2 bg-white/60 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className={cn("h-full rounded-full transition-all duration-700", color)}
                                          style={{ width: `${Math.min((value || 0) * 100, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Explanation */}
                                {complaint.explanation && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-violet-100 dark:border-violet-800 pt-3 mt-3">
                                    {complaint.explanation}
                                  </p>
                                )}
                              </div>

                              {/* Correct Analysis */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs gap-2 w-full mt-4 bg-white/60 hover:bg-white border-violet-200 text-violet-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newCat = prompt("Correct the Category (for AI Training):", complaint.category);
                                  if (newCat && newCat !== complaint.category) {
                                    alert(`AI Training Feedback Sent: Category corrected to '${newCat}'`);
                                  }
                                }}
                              >
                                <Sparkles className="w-3 h-3" />
                                Correct AI Analysis
                              </Button>
                            </div>

                            {/* Column 3: Citizen & Vulnerability */}
                            <div className="space-y-4">
                              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                  <User className="w-3.5 h-3.5" />
                                  Citizen Details
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">Name</p>
                                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{complaint.contact.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                      <Phone className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">Phone</p>
                                      <p className="font-semibold text-sm font-mono text-slate-800 dark:text-slate-200">{complaint.contact.phone || 'Not provided'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                      <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400">Email</p>
                                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{complaint.contact.email || 'Not provided'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Vulnerability Badges */}
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  Vulnerability
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {complaint.vulnerability.seniorCitizen && (
                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1">
                                      👴 Senior Citizen
                                    </Badge>
                                  )}
                                  {complaint.vulnerability.lowIncome && (
                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 gap-1">
                                      💰 Low Income
                                    </Badge>
                                  )}
                                  {complaint.vulnerability.disability && (
                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200 gap-1">
                                      ♿ Disability
                                    </Badge>
                                  )}
                                  {!complaint.vulnerability.seniorCitizen &&
                                    !complaint.vulnerability.lowIncome &&
                                    !complaint.vulnerability.disability && (
                                      <span className="text-xs text-slate-400 italic">No vulnerabilities flagged</span>
                                    )}
                                </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
          <p>
            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span>–<span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, sortedComplaints.length)}</span> of <span className="font-semibold text-slate-700">{sortedComplaints.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-8 text-xs px-3"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "h-8 w-8 text-xs p-0",
                  page === currentPage && "shadow-sm"
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-8 text-xs px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsTable;
