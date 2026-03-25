import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { EditModeProvider, useEditMode } from "@/lib/edit-context";
import { EditBar } from "@/components/edit-bar";
import { GradientBackground } from "@/components/gradient-background";
import AboutPage from "@/pages/about";
import ExperiencePage from "@/pages/experience";
import RandomFactsPage from "@/pages/random-facts";
import AdminLoginPage from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function AdminLogoutPage() {
  const { logout } = useEditMode();
  const [, setLocation] = useLocation();

  useEffect(() => {
    logout().then(() => setLocation("/"));
  }, [logout, setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AboutPage} />
      <Route path="/experience" component={ExperiencePage} />
      <Route path="/random-facts" component={RandomFactsPage} />
      <Route path="/admin-login" component={AdminLoginPage} />
      <Route path="/admin-logout" component={AdminLogoutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <EditModeProvider>
          <TooltipProvider>
            <GradientBackground variant="vibrant">
              <Toaster />
              <Router />
              <EditBar />
            </GradientBackground>
          </TooltipProvider>
        </EditModeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
