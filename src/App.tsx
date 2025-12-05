import { Suspense, lazy } from "react";
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

// Lazy load dashboard components for code-splitting
const TenantDashboard = lazy(() => import("./pages/TenantDashboard"));
const LandlordDashboard = lazy(() => import("./pages/LandlordDashboard"));
const SalesManagerDashboard = lazy(() => import("./pages/SalesManagerDashboard"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AccountingDashboard = lazy(() => import("./pages/AccountingDashboard"));
const TechnicianDashboard = lazy(() => import("./pages/TechnicianDashboard"));
const CommercialDashboard = lazy(() => import("./pages/CommercialDashboard"));
const AgencyDirectorDashboard = lazy(() => import("./pages/AgencyDirectorDashboard"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

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
                  <Suspense fallback={<LoadingFallback />}>
                    <SuperAdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant"
              element={
                <ProtectedRoute allowedRoles={['tenant']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <TenantDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord"
              element={
                <ProtectedRoute allowedRoles={['landlord']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <LandlordDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/salesmanager"
              element={
                <ProtectedRoute allowedRoles={['salesmanager']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <SalesManagerDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounting"
              element={
                <ProtectedRoute allowedRoles={['accounting']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <AccountingDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/technician"
              element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <TechnicianDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/commercial"
              element={
                <ProtectedRoute allowedRoles={['commercial']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <CommercialDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agencydirector"
              element={
                <ProtectedRoute allowedRoles={['agencydirector']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <AgencyDirectorDashboard />
                  </Suspense>
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
