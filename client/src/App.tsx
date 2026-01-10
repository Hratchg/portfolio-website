import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { GradientBackground } from "@/components/gradient-background";
import AboutPage from "@/pages/about";
import ExperiencePage from "@/pages/experience";
import RandomFactsPage from "@/pages/random-facts";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AboutPage} />
      <Route path="/experience" component={ExperiencePage} />
      <Route path="/random-facts" component={RandomFactsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GradientBackground variant="vibrant">
            <Toaster />
            <Router />
          </GradientBackground>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
