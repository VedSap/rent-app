
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthForm } from "@/components/AuthForm";
import { MainApp } from "@/components/MainApp";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showFallback, setShowFallback] = useState(false);

  // Show fallback UI if loading takes too long
  useEffect(() => {
    if (loading) {
      const fallbackTimer = setTimeout(() => {
        setShowFallback(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(fallbackTimer);
    } else {
      setShowFallback(false);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">🏠 RentApp</div>
          <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
          {showFallback && (
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs text-primary hover:underline"
              >
                Taking too long? Click here to refresh
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <AuthForm />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="rentapp-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<AppContent />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
