import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, ChefHat, ShoppingCart, LayoutDashboard, Search, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/calendar", label: "Meal Plan", icon: CalendarDays },
  { path: "/recipes", label: "Recipes", icon: ChefHat },
  { path: "/search", label: "Search", icon: Search },
  { path: "/shopping", label: "Shopping", icon: ShoppingCart },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { currentUser, logout } = useAuthStore();

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 px-4 py-3'>
        <div className='max-w-6xl mx-auto flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-linear-to-br from-primary to-sage-600 flex items-center justify-center'>
              <ChefHat className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='font-display text-xl font-bold text-foreground'>MealPrep</span>
          </Link>

          {currentUser && (
            <div className='flex items-center gap-3'>
              <div className='hidden sm:flex items-center gap-2 text-sm text-muted-foreground'>
                <User className='w-4 h-4' />
                <span>{currentUser.name}</span>
              </div>
              <button onClick={logout} className='p-2 rounded-lg hover:bg-muted transition-colors' aria-label='Logout'>
                <LogOut className='w-4 h-4 text-muted-foreground' />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 pb-20 md:pb-6'>
        <div className='max-w-6xl mx-auto p-4'>{children}</div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-border/50 md:hidden'>
        <div className='flex items-center justify-around py-2 px-4'>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className='relative flex flex-col items-center py-2 px-3'>
                {isActive && (
                  <motion.div
                    layoutId='nav-indicator'
                    className='absolute inset-0 bg-primary/10 rounded-xl'
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors relative z-10",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-xs mt-1 transition-colors relative z-10",
                    isActive ? "text-primary font-medium" : "text-muted-foreground",
                  )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className='hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50'>
        <div className='bg-card rounded-2xl shadow-large p-2 flex flex-col gap-1'>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-3 py-3 px-4 rounded-xl transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}>
                <item.icon className='w-5 h-5 shrink-0' />
                <span className='text-sm font-medium whitespace-nowrap'>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
