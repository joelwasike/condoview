import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DemoRoleSelection from "./pages/DemoRoleSelection";
// Agency Director pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Management from "./pages/Management";
import Accounting from "./pages/Accounting";
import Analytics from "./pages/Analytics";
import Advertisements from "./pages/Advertisements";
import Messages from "./pages/Messages";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
// Sales Manager pages
import SalesManagerOverview from "./pages/sales-manager/Overview";
import Occupancy from "./pages/sales-manager/Occupancy";
import SalesManagerClients from "./pages/sales-manager/Clients";
import Alerts from "./pages/sales-manager/Alerts";
// Commercial pages
import CommercialOverview from "./pages/commercial/Overview";
import Listings from "./pages/commercial/Listings";
import Visits from "./pages/commercial/Visits";
import Requests from "./pages/commercial/Requests";
// Administrative pages
import AdministrativeOverview from "./pages/administrative/Overview";
import Inbox from "./pages/administrative/Inbox";
import AdminDocuments from "./pages/administrative/Documents";
import Utilities from "./pages/administrative/Utilities";
import Debts from "./pages/administrative/Debts";
import Reminders from "./pages/administrative/Reminders";
import Leases from "./pages/administrative/Leases";
// Accounting pages
import AccountingOverview from "./pages/accounting/Overview";
import Collections from "./pages/accounting/Collections";
import AccountingLandlordPayments from "./pages/accounting/LandlordPayments";
import AccountingTenantPayments from "./pages/accounting/TenantPayments";
import Reports from "./pages/accounting/Reports";
import AccountingExpenses from "./pages/accounting/Expenses";
import AccountingTenants from "./pages/accounting/Tenants";
import Deposits from "./pages/accounting/Deposits";
import Cashier from "./pages/accounting/Cashier";
// Technician pages
import TechnicianOverview from "./pages/technician/Overview";
import Inspections from "./pages/technician/Inspections";
import Tasks from "./pages/technician/Tasks";
// Landlord pages
import LandlordOverview from "./pages/landlord/Overview";
import LandlordProperties from "./pages/landlord/Properties";
import LandlordTenants from "./pages/landlord/Tenants";
import LandlordPayments from "./pages/landlord/Payments";
import Rents from "./pages/landlord/Rents";
import LandlordExpenses from "./pages/landlord/Expenses";
import Works from "./pages/landlord/Works";
import LandlordDocuments from "./pages/landlord/Documents";
import Inventory from "./pages/landlord/Inventory";
import Tracking from "./pages/landlord/Tracking";
// Tenant pages
import TenantOverview from "./pages/tenant/Overview";
import TenantPayments from "./pages/tenant/Payments";
import Maintenance from "./pages/tenant/Maintenance";
// Super Admin pages
import SuperAdminOverview from "./pages/super-admin/Overview";
import Transactions from "./pages/super-admin/Transactions";
import SuperAdminClients from "./pages/super-admin/Clients";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const demoMode = localStorage.getItem('demo_mode') === 'true';

  // Allow access if authenticated OR in demo mode
  if (!demoMode && (!token || !user)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication or demo mode
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (demoMode) {
      // Demo mode - allow access
      setIsAuthenticated(true);
    } else if (token && user) {
      try {
        JSON.parse(user); // Validate user data
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
                  <Routes>
                    <Route 
                      path="/login" 
                      element={
                        (isAuthenticated && !localStorage.getItem('demo_mode')) ? <Navigate to="/" replace /> : <Login />
                      } 
                    />
                    <Route 
                      path="/demo" 
                      element={<DemoRoleSelection />} 
                    />
            {/* Agency Director Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management"
              element={
                <ProtectedRoute>
                  <Management />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounting"
              element={
                <ProtectedRoute>
                  <Accounting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              }
            />
            
            {/* Sales Manager Routes */}
            <Route
              path="/occupancy"
              element={
                <ProtectedRoute>
                  <Occupancy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <SalesManagerClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            
            {/* Commercial Routes */}
            <Route
              path="/listings"
              element={
                <ProtectedRoute>
                  <Listings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visits"
              element={
                <ProtectedRoute>
                  <Visits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              }
            />
            
            {/* Administrative Routes */}
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <AdminDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/utilities"
              element={
                <ProtectedRoute>
                  <Utilities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/debts"
              element={
                <ProtectedRoute>
                  <Debts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leases"
              element={
                <ProtectedRoute>
                  <Leases />
                </ProtectedRoute>
              }
            />
            
            {/* Accounting Routes */}
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landlord-payments"
              element={
                <ProtectedRoute>
                  <AccountingLandlordPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant-payments"
              element={
                <ProtectedRoute>
                  <AccountingTenantPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <AccountingExpenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <AccountingTenants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposits"
              element={
                <ProtectedRoute>
                  <Deposits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashier"
              element={
                <ProtectedRoute>
                  <Cashier />
                </ProtectedRoute>
              }
            />
            
            {/* Technician Routes */}
            <Route
              path="/inspections"
              element={
                <ProtectedRoute>
                  <Inspections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            
            {/* Landlord Routes */}
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <LandlordProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <ProtectedRoute>
                  <LandlordTenants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <LandlordPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rents"
              element={
                <ProtectedRoute>
                  <Rents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <LandlordExpenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/works"
              element={
                <ProtectedRoute>
                  <Works />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <LandlordDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              }
            />
            
            {/* Tenant Routes */}
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              }
            />
            
            {/* Super Admin Routes */}
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <SuperAdminClients />
                </ProtectedRoute>
              }
            />
            
            {/* Shared Routes */}
            <Route
              path="/advertisements"
              element={
                <ProtectedRoute>
                  <Advertisements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
