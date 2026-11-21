import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

// Pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Guardians from "@/pages/guardians";
import Contracts from "@/pages/contracts";
import ApiManagement from "@/pages/api-management";
import Analytics from "@/pages/analytics";
import Users from "@/pages/users";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import ScrollVerseFooter from "@/components/scrollverse-footer";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <p className="text-muted-foreground">Loading ScrollVerse Command Hub...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/guardians" component={() => <ProtectedRoute component={Guardians} />} />
          <Route path="/contracts" component={() => <ProtectedRoute component={Contracts} />} />
          <Route path="/api-management" component={() => <ProtectedRoute component={ApiManagement} />} />
          <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
          <Route path="/users" component={() => <ProtectedRoute component={Users} />} />
          <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ScrollVerseFooter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
