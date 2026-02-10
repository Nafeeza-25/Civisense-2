import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, SlidersHorizontal } from 'lucide-react';
import type { ComplaintStatus } from '@/lib/types';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  areaFilter: string;
  onAreaChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isRefreshing: boolean;
}

const categories = [
  'All Categories', 'Water Supply', 'Road Maintenance', 'Healthcare',
  'Housing', 'Social Welfare', 'Electricity', 'Sanitation', 'General'
];

const areas = [
  'All Areas', 'Anna Nagar', 'T. Nagar', 'Mylapore', 'Adyar',
  'Velachery', 'Chromepet', 'Tambaram', 'Guindy', 'Other'
];

const statuses: (ComplaintStatus | 'All Statuses')[] = [
  'All Statuses', 'New', 'Verified', 'Scheme Linked', 'Assigned', 'Resolved', 'Closed'
];

const Filters = ({
  searchQuery, onSearchChange,
  categoryFilter, onCategoryChange,
  areaFilter, onAreaChange,
  statusFilter, onStatusChange,
  isRefreshing
}: FiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search by description, ID, or name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
            aria-label="Search complaints"
          />
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${isRefreshing ? 'text-primary border-primary/20 bg-primary/5' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span className="hidden sm:inline">{isRefreshing ? 'Syncing' : 'Live'}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </div>

        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] h-9 rounded-lg text-xs" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-xs">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={areaFilter} onValueChange={onAreaChange}>
          <SelectTrigger className="w-[140px] h-9 rounded-lg text-xs" aria-label="Filter by area">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {areas.map((area) => (
              <SelectItem key={area} value={area} className="text-xs">
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px] h-9 rounded-lg text-xs" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters;
