import type { IssueStatus, IssuePriority, IssueSeverity } from '../types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const statusConfig: Record<IssueStatus, { label: string; color: string; dot: string }> = {
  'Open':        { label: 'Open',        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',    dot: 'bg-blue-500' },
  'In Progress': { label: 'In Progress', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
  'Resolved':    { label: 'Resolved',    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  'Closed':      { label: 'Closed',      color: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',  dot: 'bg-slate-400' },
};

export const priorityConfig: Record<IssuePriority, { label: string; color: string; dot: string }> = {
  'Low':      { label: 'Low',      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',       dot: 'bg-blue-400' },
  'Medium':   { label: 'Medium',   color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', dot: 'bg-orange-400' },
  'High':     { label: 'High',     color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',             dot: 'bg-red-500' },
  'Critical': { label: 'Critical', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', dot: 'bg-purple-500' },
};

export const severityConfig: Record<IssueSeverity, { label: string; color: string }> = {
  'Minor':    { label: 'Minor',    color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  'Major':    { label: 'Major',    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  'Critical': { label: 'Critical', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

export const StatusBadge = ({ status }: { status: IssueStatus }) => {
  const cfg = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium text-xs px-2.5 py-1 rounded-full border', cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} />
      {cfg.label}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const cfg = priorityConfig[priority];
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium text-xs px-2.5 py-1 rounded-full border', cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} />
      {cfg.label}
    </Badge>
  );
};

export const SeverityBadge = ({ severity }: { severity: IssueSeverity }) => {
  const cfg = severityConfig[severity];
  return (
    <Badge variant="outline" className={cn('font-medium text-xs px-2.5 py-1 rounded-full border', cfg.color)}>
      {cfg.label}
    </Badge>
  );
};
