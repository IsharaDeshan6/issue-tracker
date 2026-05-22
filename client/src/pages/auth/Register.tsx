import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...payload } = data;
      const res = await api.post('/auth/register', payload);
      login(res.data.user, res.data.token);
      toast.success('Account created! Welcome to Trackora 🎉');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const fieldError = (msg?: string) =>
    msg ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-destructive text-xs font-medium"
      >
        ⚠ {msg}
      </motion.p>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h2>
        <p className="text-muted-foreground text-sm">Start tracking issues like a pro — it's free forever</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Username</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('username')}
              placeholder="johndoe"
              className="pl-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
            />
          </div>
          {fieldError(errors.username?.message)}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              className="pl-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
            />
          </div>
          {fieldError(errors.email?.message)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
              />
            </div>
            {fieldError(errors.password?.message)}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirm</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 h-11 bg-muted/50 border-border/80 focus:border-primary/60 focus-visible:ring-primary/30 transition-all"
              />
            </div>
            {fieldError(errors.confirmPassword?.message)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPassword ? 'Hide' : 'Show'} passwords
          </button>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 group"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">Already have an account?</span>
        </div>
      </div>

      <Link
        to="/login"
        className="flex items-center justify-center w-full h-11 rounded-xl border border-border bg-muted/30 text-sm font-semibold text-foreground hover:bg-muted/60 transition-all hover:-translate-y-0.5"
      >
        Sign in instead
      </Link>
    </div>
  );
};
