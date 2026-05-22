import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, MoreHorizontal, Trash2, Edit2,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { api } from '../../api/axios';
import type { Issue, IssueFilters, IssueStatus, IssuePriority } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadges';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export const IssueList = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filters, setFilters] = useState<IssueFilters>({ page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 10));

      const res = await api.get(`/issues?${params.toString()}`);
      setIssues(res.data.issues || []);
      setTotal(res.data.meta?.total || 0);
      setTotalPages(res.data.meta?.totalPages || 1);
    } catch {
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/issues/${deleteId}`);
      toast.success('Issue deleted successfully');
      setDeleteId(null);
      fetchIssues();
    } catch {
      toast.error('Failed to delete issue');
    }
  };

  const activeFilterCount = [filters.status, filters.priority, filters.severity].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setSearchInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Issues</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {loading ? 'Loading...' : `${total} issue${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchIssues} className="h-9 w-9 border-border/70">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Link to="/issues/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> New Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-9 bg-muted/30 border-border/60 focus-visible:ring-primary/30 text-sm"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 border-border/60 h-9 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground h-9 text-xs">
              <X className="w-3.5 h-3.5" /> Clear
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Separator className="mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                  <Select
                    value={filters.status || ''}
                    onValueChange={(v) => setFilters((p) => ({ ...p, status: v as IssueStatus || '', page: 1 }))}
                  >
                    <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
                  <Select
                    value={filters.priority || ''}
                    onValueChange={(v) => setFilters((p) => ({ ...p, priority: v as IssuePriority || '', page: 1 }))}
                  >
                    <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Per page</label>
                  <Select
                    value={String(filters.limit || 10)}
                    onValueChange={(v) => setFilters((p) => ({ ...p, limit: Number(v), page: 1 }))}
                  >
                    <SelectTrigger className="h-9 text-sm bg-muted/30 border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Issues Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_140px_130px_140px_40px] gap-4 px-5 py-3 bg-muted/30 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Issue</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Created</span>
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_140px_130px_140px_40px] gap-4 px-5 py-4 items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            ))
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-lg">No issues found</p>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                {searchInput || activeFilterCount > 0
                  ? 'Try adjusting your search or filters'
                  : 'Create your first issue to start tracking'}
              </p>
              {!searchInput && activeFilterCount === 0 && (
                <Link to="/issues/new" className="mt-5">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-4 h-4" /> Create Issue
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {issues.map((issue, i) => (
                <motion.div
                  key={issue._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_140px_130px_140px_40px] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {issue.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                            {issue.createdBy?.username?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground truncate">{issue.createdBy?.username || 'Unknown'}</p>
                      </div>
                    </div>
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(issue._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between mb-2.5">
                      <p className="text-sm font-semibold text-foreground flex-1 mr-2 leading-snug">{issue.title}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={() => setDeleteId(issue._id)}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={issue.status} />
                      <PriorityBadge priority={issue.priority} />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-border/50 flex items-center justify-between bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Page <span className="font-bold text-foreground">{filters.page}</span> of{' '}
              <span className="font-bold text-foreground">{totalPages}</span>
              <span className="ml-1.5 text-muted-foreground/70">({total} total)</span>
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border/60"
                disabled={filters.page === 1}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border/60"
                disabled={filters.page === totalPages}
                onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this issue?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This issue will be permanently removed from your workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete Issue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
