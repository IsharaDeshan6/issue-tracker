import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Shield, Palette, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '../../store/useAuthStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your preferences and account configuration</p>
      </div>

      {/* Appearance */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <p className="text-sm text-muted-foreground">Choose how Trackora looks to you. This is saved to your browser.</p>
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'system'] as const).map((mode) => {
              const isSystem = mode === 'system';
              const isActive = isSystem ? false : theme === mode;
              const Icon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    if (!isSystem) {
                      if (theme !== mode) toggleTheme();
                    } else {
                      toast.info('System mode coming soon!');
                    }
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium',
                    isActive
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="capitalize">{mode}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Bell className="w-4 h-4 text-blue-500" />
            </div>
            <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {[
            { label: 'Issue updates', desc: 'Get notified when an issue you own is updated', state: notifications, toggle: () => setNotifications((p) => !p) },
            { label: 'New assignments', desc: 'Get notified when an issue is assigned to you', state: true, toggle: () => toast.info('Coming soon!') },
            { label: 'Weekly digest', desc: 'Receive a weekly summary of workspace activity', state: false, toggle: () => toast.info('Coming soon!') },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={item.toggle}
                className={cn(
                  'relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
                  item.state ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              >
                <span className={cn(
                  'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
                  item.state ? 'translate-x-4' : 'translate-x-0'
                )} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <CardTitle className="text-base font-semibold">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-foreground">Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">Last changed never</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Password change coming soon!')} className="border-border/60 text-xs">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
