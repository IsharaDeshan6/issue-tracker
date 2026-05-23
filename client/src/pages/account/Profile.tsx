import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

export const Profile = () => {
  const { user } = useAuthStore();
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'TR';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">Your personal account information</p>
      </div>

      {/* Profile Card */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-violet-500/10 to-primary/5 relative" />
        <CardContent className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 border-border/60 mb-1">
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </Button>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="text-xl font-bold text-foreground">{user?.username}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <Badge
              variant="outline"
              className="mt-1 capitalize bg-primary/5 border-primary/30 text-primary text-xs"
            >
              {user?.role}
            </Badge>
          </div>

          <Separator className="mb-5 opacity-50" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Username</p>
                <p className="text-sm font-semibold text-foreground">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Email</p>
                <p className="text-sm font-semibold text-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Role</p>
                <p className="text-sm font-semibold text-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Calendar className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Member since</p>
                <p className="text-sm font-semibold text-foreground">
                  {user?.createdAt
                    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
