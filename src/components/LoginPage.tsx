import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ChefHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    login(email);
    setIsLoading(false);
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-background to-sage-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'>
        {/* Logo and Title */}
        <div className='text-center mb-8'>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-sage-600 shadow-glow mb-4'>
            <ChefHat className='w-8 h-8 text-primary-foreground' />
          </motion.div>
          <h1 className='font-display text-3xl font-bold text-foreground mb-2'>MealPrep Planner</h1>
          <p className='text-muted-foreground'>Plan your meals, simplify your life</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-card rounded-2xl shadow-large p-6 border border-border/50'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm font-medium'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-10 h-12 rounded-xl border-border/50 focus:border-primary focus:ring-primary'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-sm font-medium'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='pl-10 h-12 rounded-xl border-border/50 focus:border-primary focus:ring-primary'
                  defaultValue='password'
                />
              </div>
              <p className='text-xs text-muted-foreground'>Demo mode: any password works</p>
            </div>

            <Button
              type='submit'
              disabled={isLoading || !email}
              className='w-full h-12 rounded-xl bg-linear-to-r from-primary to-sage-600 hover:from-primary/90 hover:to-sage-600/90 text-primary-foreground font-semibold shadow-glow transition-all'>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className='w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full'
                />
              ) : (
                <>
                  Get Started
                  <ArrowRight className='ml-2 w-5 h-5' />
                </>
              )}
            </Button>
          </form>

          <div className='mt-6 pt-6 border-t border-border/50'>
            <p className='text-sm text-center text-muted-foreground'>
              New here? Enter any email to start your meal planning journey.
            </p>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-8 grid grid-cols-3 gap-4 text-center'>
          {[
            { label: "Plan Meals", icon: "📅" },
            { label: "Save Recipes", icon: "🍳" },
            { label: "Shop Smart", icon: "🛒" },
          ].map((feature) => (
            <div key={feature.label} className='space-y-1'>
              <span className='text-2xl'>{feature.icon}</span>
              <p className='text-xs text-muted-foreground font-medium'>{feature.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
