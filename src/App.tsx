import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Import dashboards directly (reverted from lazy loading to fix white screen issue)
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import SalesManagerDashboard from "./pages/SalesManagerDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AccountingDashboard from "./pages/AccountingDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import CommercialDashboard from "./pages/CommercialDashboard";
import AgencyDirectorDashboard from "./pages/AgencyDirectorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/superadmin"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenant"
                  element={
                    <ProtectedRoute allowedRoles={['tenant']}>
                      <TenantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/salesmanager"
                  element={
                    <ProtectedRoute allowedRoles={['salesmanager']}>
                      <SalesManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounting"
                  element={
                    <ProtectedRoute allowedRoles={['accounting']}>
                      <AccountingDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technician"
                  element={
                    <ProtectedRoute allowedRoles={['technician']}>
                      <TechnicianDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/commercial"
                  element={
                    <ProtectedRoute allowedRoles={['commercial']}>
                      <CommercialDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agencydirector"
                  element={
                    <ProtectedRoute allowedRoles={['agencydirector']}>
                      <AgencyDirectorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
