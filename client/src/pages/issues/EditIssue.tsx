import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Loader2, Save, AlertCircle,
  FileText, Settings2, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '../../api/axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const issueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  severity: z.enum(['Minor', 'Major', 'Critical']),
});
type IssueForm = z.infer<typeof issueSchema>;

const priorityOptions = [
  { value: 'Low', dot: 'bg-blue-500' },
  { value: 'Medium', dot: 'bg-orange-500' },
  { value: 'High', dot: 'bg-red-500' },
  { value: 'Critical', dot: 'bg-purple-500' },
] as const;

export const EditIssue = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);

  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IssueForm>({ resolver: zodResolver(issueSchema) });

  const watchedPriority = watch('priority');
  const watchedStatus = watch('status');

  // Load existing issue data
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await api.get(`/issues/${id}`);
        const issue = res.data.issue || res.data;
        reset({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          severity: issue.severity,
        });
      } catch {
        toast.error('Failed to load issue');
        navigate('/issues');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchIssue();
  }, [id, navigate, reset]);

  const onSubmit = async (data: IssueForm) => {
    try {
      await api.put(`/issues/${id}`, data);
      toast.success('Issue updated successfully!');
      navigate('/issues');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update issue');
    }
  };

  const fieldError = (msg?: string) =>
    msg ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-destructive text-xs flex items-center gap-1.5 font-medium"
      >
        <AlertCircle className="w-3.5 h-3.5" /> {msg}
      </motion.p>
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/issues">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border/70 hover:-translate-y-0.5 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit Issue</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Update the details of this issue
            {isDirty && (
              <span className="ml-2 text-amber-500 font-medium">• Unsaved changes</span>
            )}
          </p>
        </div>
      </div>

      {fetching ? (
        /* Loading skeleton */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-border/60">
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border border-border/60">
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">Issue Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Title <span className="text-destructive">*</span>
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="Brief summary of the issue"
                      className={cn(
                        'h-11 bg-muted/40 border-border/70 focus-visible:ring-primary/30 transition-all text-sm',
                        errors.title && 'border-destructive focus-visible:ring-destructive/30'
                      )}
                    />
                    {fieldError(errors.title?.message)}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Detailed description of the issue..."
                      rows={8}
                      className={cn(
                        'bg-muted/40 border-border/70 focus-visible:ring-primary/30 transition-all text-sm resize-none leading-relaxed',
                        errors.description && 'border-destructive focus-visible:ring-destructive/30'
                      )}
                    />
                    {fieldError(errors.description?.message)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">Properties</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </label>
                    <Select
                      value={watchedStatus}
                      onValueChange={(v) => setValue('status', v as IssueForm['status'], { shouldDirty: true })}
                    >
                      <SelectTrigger className="h-9 text-sm bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Priority buttons */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Priority
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {priorityOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setValue('priority', opt.value, { shouldDirty: true })}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-150',
                            watchedPriority === opt.value
                              ? 'border-transparent bg-primary/10 text-primary shadow-sm'
                              : 'border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50'
                          )}
                        >
                          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', opt.dot)} />
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Severity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Severity
                    </label>
                    <Select
                      value={watch('severity')}
                      onValueChange={(v) => setValue('severity', v as IssueForm['severity'], { shouldDirty: true })}
                    >
                      <SelectTrigger className="h-9 text-sm bg-muted/40 border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Minor', 'Major', 'Critical'].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tags hint card */}
              <Card className="border border-border/60 bg-card/40 backdrop-blur-sm shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Labels
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['bug', 'feature', 'ui', 'backend', 'urgent'].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-border/60 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Tag editing coming in a future update.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <Link to="/issues">
              <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground">
                Discard changes
              </Button>
            </Link>
            <div className="flex gap-3">
              <Link to="/issues">
                <Button type="button" variant="outline" className="border-border/70">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
};
