import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ListChecks, CheckCircle2, Clock, AlertTriangle, XCircle,
  TrendingUp, Plus, ArrowUpRight, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '../../api/axios';
import type { Issue } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadges';
import { useAuthStore } from '../../store/useAuthStore';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface StatsData {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
}

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/issues?limit=20&page=1');
        const issues: Issue[] = res.data.issues || [];
        setStats({
          total: res.data.meta?.total || issues.length,
          open: issues.filter((i) => i.status === 'Open').length,
          inProgress: issues.filter((i) => i.status === 'In Progress').length,
          resolved: issues.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length,
          critical: issues.filter((i) => i.priority === 'Critical').length,
        });
        setRecentIssues(issues.slice(0, 5));
      } catch {
        // fallback empty
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Issues', value: stats?.total, icon: ListChecks, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+8%' },
    { label: 'Open', value: stats?.open, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+12%' },
    { label: 'In Progress', value: stats?.inProgress, icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '-3%' },
    { label: 'Resolved', value: stats?.resolved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+24%' },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.username?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening across your workspace today.</p>
        </div>
        <Link to="/issues/new">
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> New Issue
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border border-border/60 bg-card/60 backdrop-blur-sm hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {card.trend}
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-foreground tracking-tight">{card.value ?? 0}</p>
              )}
              <p className="text-xs text-muted-foreground font-medium mt-1">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Issues Table */}
        <motion.div variants={fadeUp} className="xl:col-span-2">
          <Card className="border border-border/60 bg-card/60 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Recent Issues</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest activity in your workspace</p>
                </div>
              </div>
              <Link to="/issues">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground text-xs">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentIssues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-3">
                    <ListChecks className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">No issues yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first issue to get started</p>
                  <Link to="/issues/new" className="mt-4">
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Create Issue
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentIssues.map((issue) => (
                    <div key={issue._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{issue.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={issue.status} />
                        <PriorityBadge priority={issue.priority} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel */}
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Quick Stats */}
          <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Issue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {loading ? (
                <div className="space-y-2.5">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-lg" />)}
                </div>
              ) : (
                <>
                  {[
                    { label: 'Open', value: stats?.open || 0, total: stats?.total || 1, color: 'bg-blue-500' },
                    { label: 'In Progress', value: stats?.inProgress || 0, total: stats?.total || 1, color: 'bg-violet-500' },
                    { label: 'Resolved', value: stats?.resolved || 0, total: stats?.total || 1, color: 'bg-emerald-500' },
                    { label: 'Critical', value: stats?.critical || 0, total: stats?.total || 1, color: 'bg-red-500' },
                  ].map((item) => {
                    const pct = stats?.total ? Math.round((item.value / (stats.total || 1)) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium text-muted-foreground">{item.label}</span>
                          <span className="font-bold text-foreground">{item.value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border border-border/60 bg-gradient-to-br from-primary/5 to-violet-500/5 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <CardContent className="p-5 relative z-10">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <XCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Need help?</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Check our documentation to learn how to manage issues effectively.
              </p>
              <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary w-full justify-center">
                View Docs <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
