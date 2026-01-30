import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/components/auth/LoginPage.tsx";
import { Dashboard } from "@/components/Dashboard";
import { MealCalendar } from "@/components/MealCalendar";
import { RecipesPage } from "@/components/RecipesPage";
import { RecipeSearch } from "@/components/RecipeSearch";
import { ShoppingList } from "@/components/ShoppingList";
import NotFound from "./pages/NotFound.tsx";
import { useAuthStore } from "./lib/stores/authStore.ts";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (!user && !loading) return <Navigate to='/login' replace />;

  return <Layout>{children}</Layout>;
}

export function AppRoutes() {
  const { user, fetchUser } = useAuthStore();
  useEffect(() => {
    if (!user) fetchUser();
  }, [fetchUser, user]);

  return (
    <Routes>
      <Route path='/login' element={user ? <Navigate to='/' replace /> : <LoginPage />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/calendar'
        element={
          <ProtectedRoute>
            <MealCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path='/recipes'
        element={
          <ProtectedRoute>
            <RecipesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/search'
        element={
          <ProtectedRoute>
            <RecipeSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path='/shopping'
        element={
          <ProtectedRoute>
            <ShoppingList />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
