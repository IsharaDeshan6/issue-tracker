import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground text-sm">Sign in to continue to your Trackora workspace</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-medium flex items-center gap-1"
            >
              <span>⚠</span> {errors.email.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Password</label>
            {/*<button type="button" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">*/}
            {/*  Forgot password?*/}
            {/*</button>*/}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pl-10 pr-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs font-medium"
            >
              ⚠ {errors.password.message}
            </motion.p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 group"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">New to Trackora?</span>
        </div>
      </div>

      <Link
        to="/register"
        className="flex items-center justify-center w-full h-11 rounded-xl border border-border bg-muted/30 text-sm font-semibold text-foreground hover:bg-muted/60 transition-all hover:-translate-y-0.5 shadow-sm"
      >
        Create a free account
      </Link>

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{' '}
        <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
        {' '}and{' '}
        <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
      </p>
    </div>
  );
};
