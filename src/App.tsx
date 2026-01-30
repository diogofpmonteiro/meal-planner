import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { MealCalendar } from "@/components/MealCalendar";
import { RecipesPage } from "@/components/RecipesPage";
import { RecipeSearch } from "@/components/RecipeSearch";
import { ShoppingList } from "@/components/ShoppingList";
import NotFound from "./pages/NotFound.tsx";
import { useAuthStore } from "./lib/stores/authStore.ts";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return <Navigate to='/login' replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { currentUser } = useAuthStore();

  return (
    <Routes>
      <Route path='/login' element={currentUser ? <Navigate to='/' replace /> : <LoginPage />} />
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
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
