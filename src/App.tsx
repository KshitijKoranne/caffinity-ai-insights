
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import AddCaffeineForm from "./components/tracking/AddCaffeineForm";
import BeverageCatalog from "./components/catalog/BeverageCatalog";
import ProfilePage from "./components/profile/ProfilePage";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Create a new query client instance outside of component render
const queryClient = new QueryClient();

// Properly structured component with React root
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            {/* Move TooltipProvider inside the routes to ensure it's not rendered at the root level */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Index />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <AppLayout>
                  <TooltipProvider>
                    <Dashboard />
                  </TooltipProvider>
                </AppLayout>
              } />
              <Route path="/add" element={
                <AppLayout>
                  <TooltipProvider>
                    <AddCaffeineForm />
                  </TooltipProvider>
                </AppLayout>
              } />
              <Route path="/catalog" element={
                <AppLayout>
                  <TooltipProvider>
                    <BeverageCatalog />
                  </TooltipProvider>
                </AppLayout>
              } />
              <Route path="/profile" element={
                <AppLayout>
                  <TooltipProvider>
                    <ProfilePage />
                  </TooltipProvider>
                </AppLayout>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Add Toaster outside of routes but inside auth context */}
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
