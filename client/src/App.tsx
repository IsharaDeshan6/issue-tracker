import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './store/useAuthStore';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';


function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors closeButton />
      <Analytics />
    </TooltipProvider>
  );
}

export default App;
